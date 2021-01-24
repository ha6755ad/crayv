<template>
  <q-card flat class="q-pa-md">
    <div class="t-r">
      <remove-button service="crayv-classifieds" :value="value"></remove-button>
    </div>

    <image-form v-model="form.images" multiple></image-form>

    <div class="q-my-md text-xs text-mb-xs text-weight-bold">{{form.name ? form.name : 'Add Listing'}}</div>

    <q-input
      :error="$vErrorCheck('name')"
      :error-message="$vErrorMessage('name')"
      v-model="form.name" placeholder="Name Listing"></q-input>


    <q-input
      :error="$vErrorCheck('description')"
      :error-message="$vErrorMessage('description')"
      v-model="form.description" placeholder="Description"
             autogrow filled></q-input>

    <q-separator dark class="q-my-md"></q-separator>


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

    <address-form
      :value="lget(user, 'addresses')"
      @input="handleAddress"
      @add="$setForm('location', ...arguments)"
      adding
    ></address-form>

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

  export default {
    name: 'ClassifiedsForm',
    mixins: [vCheck],
    components: { ImageForm, AddressForm, TagPicker, PricePicker, RemoveButton },
    props: {
      value: Object
    },
    mounted(){
      if(this.value) Object.assign(this.form, Object.assign({}, this.value));
    },
    data() {
      return {
        updateValidOnInput: true,
        form: new models.api.CrayvClassifieds().clone(),
        dirty: false
      };
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      vCheckForm(){
        return this.form;
      },
      validCheck(){
        return {
          name: { name: 'Name', v: ['notEmpty', 'lt:40']},
          description: { name: 'Description', v: ['notEmpty']},
          'price.basePrice': { name: 'Price', v: ['notEmpty']},
          'price.currency': { name: 'Currency', v: ['notEmpty']},
          tags: { name: 'Tags', v: ['arrayLength:1']},
          location: { name: 'Location', v: ['type:object']}
        };
      }
    },
    methods: {
      handleAddress(val) {
        this.form.location = val;
        this.$store.dispatch('users/patch', [this.user._id, {
          $addToSet: { addresses: val }
        }]);
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

<style scoped>

</style>
