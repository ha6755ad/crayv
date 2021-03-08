<template>
  <q-card flat class="q-pa-md">
    <div class="t-r" v-if="value">
      <remove-button service="crayv-classifieds" :value="value"></remove-button>
    </div>

    <image-form v-model="form.images" multiple></image-form>

    <div class="q-my-md text-xs text-mb-xs text-weight-bold">{{ form.name ? form.name : 'Add Listing' }}</div>

    <q-input
      :error="$vErrorCheck('name')"
      :error-message="$vErrorMessage('name')"
      v-model="form.name" placeholder="Name Listing"></q-input>


    <q-input
      :error="$vErrorCheck('description')"
      :error-message="$vErrorMessage('description')"
      v-model="form.description" placeholder="Description"
      autogrow filled></q-input>


    <price-picker
      :errorCheck="$vErrorCheck"
      :errorMessage="$vErrorMessage"
      v-model="form.price"/>

    <q-separator dark class="q-my-md"></q-separator>


    <div class="row items-center">
      <q-radio label="Best Offer (obo)" v-model="form.type" val="obo" class="q-mx-xs"></q-radio>
      <q-radio label="First Offer" v-model="form.type" val="first" class="q-mx-xs"></q-radio>
    </div>

    <q-separator dark class="q-my-md"></q-separator>

    <tag-picker service-in="crayv-classifieds" v-model="form.tags"></tag-picker>

    <q-separator dark class="q-my-md"></q-separator>

    <div class="q-pa-md text-xs text-mb-xs text-weight-medium">Location Options</div>

    <q-btn v-if="lget(form, 'location.latitude')" icon="mdi-map-marker" flat color="nice" icon-right="mdi-pencil-box"
           :label="$limitStr(lget(form, 'location.formatted'), 60)" @click="addingAddress = true">
      <q-tooltip>Change</q-tooltip>
    </q-btn>

    <q-slide-transition>
      <address-form
        v-if="addingAddress || !lget(form, 'location.latitude')"
        :value="lget(user, 'addresses')"
        @input="handleAddress"
        adding
      ></address-form>
    </q-slide-transition>

    <q-separator dark class="q-my-md"></q-separator>

    <template v-if="lget(form, 'location.latitude')">
      <div class="q-pa-md text-xxs text-mb-xxs text-weight-bold">Delivery Options</div>

      <boundary-form v-model="form.boundary" :location="form.location" :check-change="!!form._id"></boundary-form>

      <div class="q-pa-sm">
        <q-input
          filled
          :value="dollarString(lget(form, 'price.delivery.basePrice', 0), '', 2)"
          @input="$lset(form, 'price.delivery.basePrice', parseFloat($event))" label="Delivery Fee"
          mask="#.##"
          fill-mask="0"
          reverse-fill-mask
        >
          <template v-slot:prepend>
            <q-icon :name="$getCurrencyIcon(lget(form, 'price.currency'))"></q-icon>
          </template>
        </q-input>
      </div>
    </template>
    <q-separator dark class="q-my-md"></q-separator>

    <div class="q-pa-md row justify-end">
      <q-btn push color="secondary" label="save" icon="mdi-content-save" @click="save"></q-btn>
    </div>
  </q-card>
</template>

<script>
  import {models} from 'feathers-vuex';
  import RemoveButton from 'components/common/atoms/buttons/RemoveButton';
  import PricePicker from 'components/common/atoms/pickers/PricePicker';
  import TagPicker from 'components/common/atoms/pickers/TagPicker';
  import AddressForm from 'components/family-pod/personal/AddressForm';
  import {mapGetters} from 'vuex';
  import {vCheck} from 'src/mixins/ir-validate';
  import ImageForm from 'components/family-pod/personal/ImageForm';
  import BoundaryForm from 'components/common/atoms/geo/BoundaryForm';

  export default {
    name: 'ClassifiedsForm',
    mixins: [vCheck],
    components: { BoundaryForm, ImageForm, AddressForm, TagPicker, PricePicker, RemoveButton },
    props: {
      value: Object
    },
    mounted() {
      if (this.value){
        Object.assign(this.form, Object.assign({}, this.value));
      }
    },
    data() {
      return {
        addingAddress: true,
        updateValidOnInput: true,
        form: new models.api.CrayvClassifieds().clone(),
        dirty: false
      };
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters({ coordinates: 'coordinates' }),

      vCheckForm() {
        return this.form;
      },
      validCheck() {
        return {
          name: { name: 'Name', v: ['notEmpty', 'lt:40'] },
          description: { name: 'Description', v: ['notEmpty'] },
          'price.basePrice': { name: 'Price', v: ['notEmpty'] },
          'price.currency': { name: 'Currency', v: ['notEmpty'] },
          tags: { name: 'Tags', v: ['arrayLength:1'] },
          'location.latitude': { name: 'Location', v: ['notEmpty'] },
          'boundary.featrues': { name: 'Delivery area or location' }, v: ['arrayLength:1']
        };
      }
    },
    methods: {
      handleAddress(val) {
        this.form.location = val;
        this.$store.dispatch('users/patch', [this.user._id, {
          $addToSet: { addresses: val }
        }]);
        this.addingAddress = false;
      },
      save() {
        const errors = this.$vCheck(this.form);
        if (errors && errors.length) {
          errors.forEach(err => {
            this.$vErrNotify(err);
          });
        } else {
          console.log('saving', this.form);
          // this.$store.dispatch('crayv-classifieds/patch', [this.form._id, {
          //   boundary: this.form.boundary
          // }])
          this.form.save()
            .then(res => {
              console.log('saved', res);
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

<style scoped>

</style>
