<template>
  <div style="width: 100%">
    <div class="q-pa-md">
      <div class="text-xxs text-mb-xxs text-weight-medium">Order Range</div>
      <div class="text-xxs text-mb-xxs text-weight-light">Define order quantity or purchase total range</div>
      <div class="row items-center">
        <q-radio label="Total (purchase price)" v-model="form.rangeType" val="total"></q-radio>
        <q-radio label="Quantity (order count)" v-model="form.rangeType" val="quantity"></q-radio>
      </div>
    <div class="row">
      <q-input class="q-mx-xs" filled :label="`Min ${form.rangeType}`"  :value="form.min" @input="setMin"></q-input>
      <q-input class="q-mx-xs" filled :label="`Max ${form.rangeType}`" :value="form.max" @input="setMax"></q-input>
    </div>
    </div>

    <div class="q-pa-md">
      <div class="text-xxs text-mb-xxs text-weight-medium">Discount</div>
      <div class="text-xxs text-mb-xxs text-weight-light">Define discount by percentage or flat amount</div>
      <q-radio label="Percent" val="percent" v-model="form.discountType"></q-radio>
      <q-radio label="Flat" val="flat" v-model="form.discountType"></q-radio>
      <q-input v-model.number="form.discount" filled label="Discount Amount" hint="To be applied in whatever currency you're selling in - if you sell in multiple currencies, percentage is usually best" :suffix="form.discountType === 'percent' ? '%' : ''"></q-input>
    </div>
    <div class="q-pa-sm row justify-end">
      <q-btn size="sm" push color="nice" @click="save" label="save"></q-btn>
    </div>
  </div>
</template>

<script>
  import {vCheck} from 'src/mixins/ir-validate';

  const defaultDiscount = () => {
    return {
      rangeType: 'total',
      min: 0,
      max: undefined,
      discountType: 'percent',
      discount: 0
    };
  };
  export default {
    name: 'DiscountForm',
    mixins: [vCheck],
    props: {
      min: { type: Number, default: 1 },
      max: { type: Number },
      value: Object
    },
    data(){
      return {
        form: defaultDiscount()
      };
    },
    computed: {
      vCheckForm(){
        return this.form;
      },
      validCheck(){
        return {
          rangeType: { name: 'Range Type', v: ['notEmpty']},
          min: { name: 'Range Minimum', v: ['type:number']},
          max: { name: 'Range Maximum', v: ['type:number']},
          discountType: { name: 'Discount Type'}, v: ['notEmpty'],
          discount: { name: 'Discount', v: ['type:number']}
        };
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal){
          this.setDefault();
          if(newVal) Object.assign(this.form, Object.assign({}, newVal));
        }
      }
    },
    methods: {
      setMin(val){
        let num = parseInt(val);
        if(this.min) {
          if (num >= this.min) {
            this.form.min = num;
          } else this.$quickNotify(`Must be greater than ${this.min - 1}`);
        } else this.form.min = num;
      },
      setMax(val){
        let num = parseInt(val);
        if(this.max) {
          if (num <= this.max) {
            this.form.max = num;
          } else this.$quickNotify(`Must be less than ${this.max + 1}`);
        } else this.form.max = num;
      },
      setDefault(){
        let obj = { min: this.min };
        if(this.max) obj.max = this.maximum;
        Object.assign(this.form, Object.assign({}, obj));
      },
      save(){
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

<style scoped>

</style>
