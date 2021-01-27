<template>
  <div class="__listing_card q-pa-md">
    <div class="t-r-a">
      <remove-button :value="value" service="crayv-classifieds"></remove-button>
    </div>

    <div class="flex q-pa-sm" v-if="$q.screen.lt.md">
      <image-form v-model="form.images" multiple></image-form>
    </div>
    <template v-if="$q.screen.lt.md">
      <tab-stepper
        color="nice"
        :tabs="[{label: offerLabel}, {label: 'Details'}]"
        v-model="tab"
      ></tab-stepper>
    </template>
    <div class="row" style="width: 100%;">
      <q-slide-transition>
        <div class="col-12 col-md-6" v-if="$q.screen.gt.sm || tab === 1">
          <div style="max-width: 500px; position: relative">
            <q-btn v-show="isVDirty" class="t-r" size="sm" push color="primary" label="save changes"
                   icon="mdi-content-save" @click="save"></q-btn>
            <div class="flex q-pa-sm" v-if="$q.screen.gt.sm">
              <image-form v-model="form.images" multiple></image-form>
            </div>
            <q-input
              hide-bottom-space
              :disable="!!value.accepted"
              borderless
              v-model="form.name"
              input-class="text-weight-bold text-xs text-mb-xs"
            ></q-input>

            <q-input
              hide-bottom-space
              :disable="!!value.accepted"
              autogrow
              borderless
              v-model="form.description"
            ></q-input>

            <div class="row">
              <price-picker
                :disable="!!value.accepted"
                borderless
                v-model="form.price"
              ></price-picker>
              <q-space></q-space>
            </div>
            <tag-picker
              @input="isVDirty = true"
              borderless
              service-in="crayv-classifieds"
              v-model="form.tags"
              color="nice"
            ></tag-picker>
            <div class="flex items-center">
              <q-btn icon="mdi-map-marker" color="nice" flat dense></q-btn>
              <div style="width: 80%" class="text-xxs text-mb-xxs text-weight-bold __one-liner">
                {{ lget(value, 'location.formatted') }}
              </div>
              <q-popup-proxy :breakpoint="10">
                <q-card style="width: 500px; max-width: 100vw">
                  <address-form
                    :value="lget(user, 'addresses')"
                    @input="handleAddress"
                    adding
                  ></address-form>
                </q-card>
              </q-popup-proxy>
            </div>
            <div class="row justify-end q-my-xs">
              <q-btn-dropdown flat
                              :label="$arrayFilterZero(types.filter(a => a.value === form.type), {label: 'Choose Type'}, 'label')">
                <q-list dense v-if="!value.accepted">
                  <q-item dense v-for="(type, i) in types" :key="`type-${i}`" clickable
                          @click="form.type = type.value, isVDirty = true">
                    <q-item-section>
                      <q-item-label class="text-weight-medium">{{ type.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <div v-else class="q-pa-sm text-xs text-mb-xs text-italic">
                  Offer already accepted
                </div>
              </q-btn-dropdown>
            </div>
          </div>
        </div>
      </q-slide-transition>
      <q-slide-transition>
        <div class="col-12 col-md-6" v-if="$q.screen.gt.sm || tab === 0">
          <div class="text-xxs text-mb-xxs text-weight-bold q-pa-sm row">
            <div>{{ offerLabel }}</div>
            <q-space></q-space>
            <q-btn flat :disable="!!value.sold" :label="value.sold ? 'Sold' : 'Mark Sold'" icon="mdi-checkbox-marked"
                   color="positive" @click="markSold"></q-btn>
          </div>
          <div style="max-height: 400px; overflow-y: scroll">
            <offers-card
              :subject="value"
              :query-in="offerQuery"
              price-mode
              @input="offerDialog = true"
            ></offers-card>
          </div>
        </div>
      </q-slide-transition>
    </div>

    <q-dialog position="right" transition-hide="slide-right" transition-show="slide-left" :maximized="$q.screen.lt.sm"
              v-model="offerDialog">
      <q-card class="q-px-sm bg-light" style="width: 100vw; max-width: 600px; height: 100vh; overflow-y: scroll">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="offerDialog = false"/>
        <offers-card :subject="value" :query-in="offerQuery"></offers-card>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import {mapGetters, mapState} from 'vuex';
  import ImageForm from 'components/family-pod/personal/ImageForm';
  import PricePicker from 'components/common/atoms/pickers/PricePicker';
  import TagPicker from 'components/common/atoms/pickers/TagPicker';
  import AddressForm from 'components/family-pod/personal/AddressForm';
  import {models} from 'feathers-vuex';
  import {vCheck} from 'src/mixins/ir-validate';
  import TabStepper from 'components/common/atoms/tabs/TabStepper';
  import OffersCard from 'components/offers/cards/OffersCard';
  import RemoveButton from 'components/common/atoms/buttons/RemoveButton';

  export default {
    name: 'ListingCard',
    mixins: [vCheck],
    components: { RemoveButton, OffersCard, TabStepper, AddressForm, TagPicker, PricePicker, ImageForm },
    props: {
      value: Object
    },
    mounted() {
      if (this.value) Object.assign(this.form, Object.assign({}, this.value));
    },
    data() {
      return {
        offerDialog: false,
        tab: 0,
        form: new models.api.CrayvClassifieds().clone(),
        editDialog: false,
        fullScreen: false
      };
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapState('currency', { currencies: 'national_currencies' }),
      types() {
        return [
          {
            label: 'Best Offer',
            value: 'obo'
          },
          {
            label: 'First Offer',
            value: 'first'
          }
        ];
      },
      offerQuery() {
        return {
          $sort: { 'price.basePrice': -1 },
          _id: { $in: this.lget(this.value, 'offers', []) }
        };
      },
      tagList() {
        return Array.from(new Set(this.lget(this.value, 'tags', [])));
      },
      offerLabel() {
        let length = this.lget(this.value, 'offers', []).length;
        return length === 1 ? length + ' Offer' : length + ' Offers';
      },
      currency() {
        return this.$arrayFilterZero(this.currencies.filter(a => a.value === this.lget(this.value, 'price.currency', 'usd')));
      },
      validCheck() {
        return {
          name: { name: 'Name', v: ['notEmpty', 'lt:40'] },
          description: { name: 'Description', v: ['notEmpty'] },
          'price.basePrice': { name: 'Price', v: ['notEmpty'] },
          'price.currency': { name: 'Currency', v: ['notEmpty'] },
          tags: { name: 'Tags', v: ['arrayLength:1'] },
          location: { name: 'Location', v: ['type:object'] }
        };
      }
    },
    methods: {
      handleAddress(val) {
        this.isVDirty = true;
        this.form.location = val;
        this.$store.dispatch('users/patch', [this.user._id, {
          $addToSet: { addresses: val }
        }]);
      },
      markSold() {
        this.$q.dialog({
          title: 'Mark Sold?',
          message: `${!this.value.accepted ? ' You haven\'t accepted any offers.' : ''}`,
          ok: {
            color: 'positive',
            label: 'yes',
            push: true,
            size: 'sm'
          },
          cancel: {
            color: 'negative',
            label: 'nevermind',
            push: true,
            size: 'sm'
          }
        }).onOk(() => {
          this.$store.dispatch('crayv-classifieds/patch', [this.value._id, { sold: new Date() }])
            .then(res => {
              this.$emit('input', res);
              this.$successNotify('Sold!');
            })
            .catch(err => {
              this.$errNotify(err.message);
            });
        });
      },
      save() {
        const errors = this.$vCheck(this.form);
        if (errors && errors.length) {
          errors.forEach(err => {
            this.$vErrNotify(err);
          });
        } else {
          this.form.save()
            .then(res => {
              this.$emit('input', res);
              this.$successNotify('For Sale!');
            })
            .catch(err => {
              this.$errNotify(err.message);
            });
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .__listing_card {
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, .2);
  }
</style>
