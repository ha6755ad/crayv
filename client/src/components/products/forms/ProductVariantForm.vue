<template>
  <q-card class="q-pa-sm">
    <div class="q-pa-sm text-sm text-mb-md text-weight-medium">Product Variant</div>
    <div class="q-pa-sm">
      <div class="row justify-center">
        <multi-image-upload v-model="form.images"></multi-image-upload>
      </div>
      <div class="row">
        <div class="col-12 q-gutter-sm">
          <q-input label="Variant Name" v-model="form.name"/>
          <q-input label="Descriptor" v-model="form.description"/>
          <price-picker v-model="form.price"/>
          <div class="row text-xs text-mb-xs text-weight-light">Variant Type</div>
          <div class="row">
            <q-checkbox label="Size" v-model="form.type" true-value="size"/>
            <q-checkbox label="Flavor" v-model="form.type" true-value="flavor"/>
            <q-checkbox label="Custom" v-model="form.type" true-value="custom"/>
          </div>
        </div>
      </div>
    </div>
    <div class="q-pa-sm row justify-end">
      <q-btn color="accent" label="Save" icon="mdi-content-save" class="glossy text-dark" push @click="save"></q-btn>
    </div>

  </q-card>
</template>

<script>
  import PricePicker from '../../common/atoms/price/PricePicker';
  import common from '../../../store/schemas/common';
  import {vCheck} from 'src/mixins/ir-validate';
  import MultiImageUpload from 'components/common/substance/images/MultiImageUpload';
  export default {
    name: 'ProductVariantForm',
    mixins: [vCheck],
    components: { MultiImageUpload, PricePicker },
    props: {
      value: Object
    },
    data() {
      return {
        updateValidOnInput: true,
        form: common.ProductVariant
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal){
          if(newVal) {
            this.form = {...common.ProductVariant, ...newVal};
          }
        }
      }
    },
    computed: {
      vCheckForm(){
        return this.form;
      },
      validCheck(){
        return {
          name: { name: 'Name', v: ['notEmpty']},
          description: { name: 'Description', v: ['notEmpty']},
          type: { name: 'Type', v: ['notEmpty']}
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
          this.$emit('input', this.form);
        }
      }
    }
  };
</script>
