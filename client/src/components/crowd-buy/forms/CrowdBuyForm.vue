<template>
  <div class="q-py-md q-pr-md q-pl-lg">
    <div class="text-xs text-mb-xs text-weight-bold q-py-md">{{
        form && form.name ? form.name : 'Create Crowd Buy'
      }}
    </div>

    <div class="q-py-md">
      <div class="text-xxs text-mb-xxs __titles">
        Vendor Account
      </div>
      <div class="row justify-end">
        <vendor-picker
          set-context
          :value="vendorContext"
          :query-in="vendorQuery"
        >
        </vendor-picker>
      </div>

      <q-slide-transition>
        <template v-if="lget(stateVendorSettings, [1]) || (vendorContext && !form.vendorSettings)">

          <vendor-settings-picker emit-value v-model="form.vendorSettings"></vendor-settings-picker>

        </template>
      </q-slide-transition>
    </div>

    <q-slide-transition>
      <div v-if="form.vendorSettings">
        <div class="q-py-md">
          <div class="row justify-center">
            <image-form v-model="form.images" multiple></image-form>
          </div>
          <div class="text-xxs text-mb-xxs __titles">
            Name & Description
          </div>
          <q-input class="q-my-sm" label="Name" v-model="form.name"></q-input>
          <q-input class="q-my-sm" autogrow filled label="Description" v-model="form.description"></q-input>
        </div>

        <q-slide-transition>
          <div v-if="form.name && form.name.charAt(2) && form.description && form.description.charAt(4)">

            <div class="q-pa-sm q-my-md">
              <div class="text-xxs text-mb-xxs __titles">
                Offering
              </div>
              <div class="row items-center justify-around q-py-sm">
                <q-btn v-for="(type, i) in sellingTypes" :key="`type-${i}`" :label="type.label"
                       :color="form.sellingModel === type.value ? 'primary' : 'grey-5'"
                       :icon="form.sellingModel === type.value ? 'mdi-check' : undefined"
                       @click="setSellingModel(type.value)" :size="$q.screen.lt.sm ? 'sm' : ''" flat></q-btn>
              </div>

              <paginate-list
                select
                :load-service="form.sellingModel"
                :query-in="query"
                :search-placeholder="`Select ${activeType.label}`"
                v-model="form.selling"
                emit-value
              >
                <template v-slot:option="scope">
                  <component :active="scope.selected" v-bind="activeType.cardAttrs" @input="scope.handleInput"
                             :is="activeType.card"
                             :value="scope.item"></component>
                </template>
                <template v-slot:chip="scope">
                  <component v-bind="activeType.chipAttrs" @input="scope.handleInput" :is="activeType.chip"
                             :value="scope.item"></component>
                </template>
              </paginate-list>

            </div>

            <q-slide-transition>
              <div v-if="form.selling">

                <div class="q-py-md">
                  <div class="text-xxs text-mb-xxs __titles">
                    Min & Max Deal
                  </div>
                  <div class="row justify-around q-py-sm">
                    <q-input input-class="text-right text-weight-medium" style="width: 45%" label="Minimum Deal"
                             v-model.number="form.minimum"
                             hint="Minimum total order count"
                             :suffix="form.minimum === 1 ? 'order' : 'orders'"></q-input>
                    <q-input input-class="text-right text-weight-medium" style="width: 45%" label="Maximum Capacity"
                             v-model.number="form.maximum"
                             hint="Maximum total order count"
                             :suffix="form.maximum === 1 ? 'order' : 'orders'"></q-input>
                  </div>
                </div>

                <div class="q-py-lg">
                  <div class="text-xxs text-mb-xxs __titles">
                    <div>Schedule</div>
                    <div class="text-weight-light">Define open and close to when people can decide to participate</div>
                  </div>
                  <inline-date-time v-model="form.start" date-label="Start Date"></inline-date-time>
                  <inline-date-time v-model="form.end" date-label="Close Date"></inline-date-time>
                </div>

                <div class="q-py-md">
                  <div class="text-xxs text-mb-xxs __titles">
                    <div>Define Volume Discounts</div>
                    <div class="text-weight-light"> If discounts overlap, the highest will apply</div>
                  </div>

                  <div style="width: 100%">
                    <q-list separator>
                      <add-list-item title="Add Discount" size="md" label="Add Discount"
                                     @input="editDiscount = true"></add-list-item>
                    </q-list>
                    <div v-for="(discount, i) in lget(form, 'discounts', [])" :key="`discount-${i}`">
                      <discount-item color="nice" :value="discount">
                        <template v-slot:side>
                          <q-btn flat dense icon="mdi-pencil-box" @click="editDiscount = i"></q-btn>
                        </template>
                      </discount-item>
                    </div>
                  </div>
                </div>

                <q-separator class="q-my-md"></q-separator>

                <div class="text-xxs text-mb-xxs __titles">Delivery</div>

                <q-expansion-item dense style="width: 100%" expand-separator
                                  :expand-icon="$lisEmpty(lget(form, 'settings.crowdBuySettings.boundary')) ? 'mdi-checkbox-blank-outline' : 'mdi-checkbox-marked'"
                                  :color="$lisEmpty(lget(form, 'settings.crowdBuySettings.boundary')) ? 'dark' : 'positive'">
                  <template v-slot:header>
                    <q-item style="width: 100%;)">
                      <q-item-section avatar>
                        <q-icon name="mdi-map-marker-radius"></q-icon>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-xxs text-mb-xxs text-weight-bold">Custom Boundary</q-item-label>
                        <q-item-label class="text-xxs text-mb-xxs text-weight-light">Set a different boundary from your
                          standard
                          vendor settings
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <div class="q-py-lg">
                    <boundary-form
                      no-set
                      :value="lget(form, 'settings.crowdBuySettings.boundary')"
                      @input="$lset(form, 'settings.crowdBuySettings.boundary', $event)"
                      :location="lget(activeVendorSettings, 'address')"
                      :check-change="!!form._id"
                    ></boundary-form>
                  </div>
                  <q-separator></q-separator>
                </q-expansion-item>

                <div class="q-pa-md row justify-end">
                  <q-btn color="secondary" push label="save" icon="mdi-content-save" @click="save"></q-btn>
                </div>

              </div>
            </q-slide-transition>
          </div>
        </q-slide-transition>
      </div>
    </q-slide-transition>

    <q-dialog :value="editDiscount || (typeof editDiscount === 'number' && editDiscount > -1)"
              @close="editDiscount = false">
      <q-card style="width: 400px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="editDiscount = false"/>
        <discount-form :min="form.minimum" :max="form.maximum" :value="lget(form, ['discounts', editDiscount], null)" @input="addDiscount"></discount-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import VendorPicker from 'components/common/pickers/VendorPicker';
  import {models} from 'feathers-vuex';
  import {mapGetters} from 'vuex';
  import PaginateList from 'components/common/substance/lists/PaginateList';
  import ProductItem from 'components/products/card/ProductItem';
  import ProductGroupItem from 'components/product-groups/cards/ProductGroupItem';
  import LineupItem from 'components/lineups/cards/LineupItem';
  import InlineDateTime from 'components/common/atoms/dates/InlineDateTime';
  import AddListItem from 'components/common/atoms/search/AddListItem';
  import DiscountItem from 'components/crowd-buy/cards/DiscountItem';
  import DiscountForm from 'components/crowd-buy/forms/DiscountForm';
  import BoundaryForm from 'components/common/atoms/geo/BoundaryForm';
  import VendorItem from 'components/vendor/cards/VendorItem';
  import VendorSettingsPicker from 'components/vendor/settings/vendor-settings/VendorSettingsPicker';
  import ProductChip from 'components/products/card/ProductChip';
  import ImageForm from 'components/family-pod/personal/ImageForm';
  import {vCheck} from 'src/mixins/ir-validate';


  export default {
    name: 'CrowdBuyForm',
    mixins: [vCheck],
    components: {
      ImageForm,
      VendorSettingsPicker,
      VendorItem,
      BoundaryForm,
      DiscountForm,
      DiscountItem,
      AddListItem,
      InlineDateTime,
      PaginateList,
      VendorPicker
    },
    props: {
      value: Object
    },
    mounted() {
      if (this.value) {
        Object.assign(this.form, Object.assign({}, this.value));
      }
    },
    data() {
      return {
        editDiscount: false,
        form: new models.api.CrayvCrowdBuys({ sellingModel: 'crayv-products', start: new Date() }).clone(),
      };
    },
    watch: {
      vendorContext: {
        immediate: true,
        async handler(newVal) {
          if (newVal) {
            let vendorSettingsId = this.lget(this.stateVendorSettings, [0, '_id']);
            if (!vendorSettingsId) {
              await this.$store.dispatch('crayv-vendor-settings/find', this.vendorSettingsQuery)
                .then(res => {
                  this.form.vendorSettings = this.lget(res, ['data', 0, '_id'], undefined);
                });
            } else this.form.vendorSettings = vendorSettingsId;
          }
        }
      }
    },
    computed: {
      ...mapGetters({ vendorContext: 'vendorContext' }),
      ...mapGetters('crayv-vendor-settings', { getVendorSettings: 'get', findVendorSettings: 'find' }),
      ...mapGetters({ marketplace: 'marketplaceContext' }),
      vendorQuery() {
        return {
          vendorSettings: { $in: this.lget(this.marketplace, 'vendorSettings', []) }
        };
      },
      stateVendorSettings() {
        return this.findVendorSettings({ query: this.vendorSettingsQuery }).data;
      },
      vendorSettingsQuery() {
        return {
          vendor: this.lget(this.vendorContext, '_id'), marketplace: this.lget(this.marketplace, '_id')
        };
      },
      activeVendorSettings() {
        if (this.lget(this.form, 'vendorSettings')) return this.getVendorSettings(this.form.vendorSettings);
        else return null;
      },
      activeType() {
        return this.$arrayFilterZero(this.sellingTypes.filter(a => a.value === this.form.sellingModel));
      },
      query() {
        let query = { active: true };
        let list = this.lget(this.activeVendorSettings, 'productLineups', []);
        if (['crayv-products', 'crayv-product-groups'].includes(this.form.sellingModel)) {
          query.productLineups = { $in: list };
        } else {
          query._id = { $in: list };
        }
        return query;
      },
      sellingTypes() {
        return [
          {
            label: 'Product',
            value: 'crayv-products',
            cardAttrs: { flat: true },
            card: ProductItem,
            chip: ProductChip,
            chipAttrs: {}
          },
          {
            label: 'Product Group',
            value: 'crayv-product-groups',
            card: ProductGroupItem,
            chip: ProductChip
          },
          {
            label: 'Lineup',
            value: 'crayv-product-lineups',
            card: LineupItem,
            chip: ProductChip,
            chipAttrs: { avatarPath: 'img' }
          }
        ];
      },
      validCheck(){
        return {
          name: { name: 'Name', v: ['gt:2']},
          description: { name: 'Description', v: ['notEmpty']},
          start: { name: 'Name', v: ['notEmpty']},
          vendorSettings: { name: 'Vendor', v: ['notEmpty']},
          selling: { name: 'Products', v: ['arrayLength:1']},
          sellingModel: { name: 'Product Type', v: ['notEmpty']},
          minimum: { name: 'Minimum', v: ['gt:1']},
          discounts: { name: 'Discount Schedule', v: ['arrayLength:1']}
        };
      }
    },
    methods: {
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
              this.$successNotify('Crowd Offer Up!');
            })
            .catch(err => {
              this.$errNotify(err.message);
            });
        }
      },
      setSellingModel(val) {
        this.form.sellingModel = val;
        this.form.selling = [];
      },
      setVendorSettings(options) {
        console.log('got options', options);
        let val = this.lget(options, [0, '_id']);
        if (val) this.form.vendorSettings = val;
      },
      changeDate(val) {
        this.form.start = val.start;
        this.form.end = val.end;
      },
      addDiscount(val) {
        this.form.discounts.push(val);
        this.editDiscount = false;
      }
    }
  };
</script>

<style scoped lang="scss">
  .__titles {
    color: var(--q-color-ir-grey-7);
    font-weight: 600;
    transform: translate(-10px, 0);
  }
</style>
