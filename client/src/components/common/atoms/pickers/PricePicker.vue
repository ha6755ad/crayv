<template>
  <div :class="colClass" :style="styleIn">
    <q-select
      :error-message="errorMessage('price.currency')"
      :error="errorCheck('price.currency')"
      v-if="!currencyOff"
      label="Currency"
      v-model="form.currency"
      @input="handleInput"
      :options="currencies"
    ></q-select>
    <q-input
      :error-message="errorMessage('price.basePrice')"
      :error="errorCheck('price.basePrice')"
      :input-class="inputClass"
      :dense="dense"
      filled
      @input="newPrice"
      :value="dollarString(lget(form, 'basePrice', 0), '', 2)"
      :label="$attrs.label ? $attrs.label : 'Price'"
      mask="#.##"
      fill-mask="0"
      reverse-fill-mask
      hint="#.##"
    >
      <template v-slot:prepend>
        <q-icon :name="currencyIcon"/>
      </template>
    </q-input>
  </div>
</template>

<script>
  import { currencyEnum } from '../../../../store/schemas/common';
  export default {
    name: 'PricePicker',
    props: {
      errorCheck: { required: false },
      errorMessage: { required: false },
      currencyOff: Boolean,
      inputClass: {
        type: String,
        default: 'text-right'
      },
      colClass: String,
      styleIn: [Object, String],
      dense: Boolean,
      value: Object,
    },
    data(){
      return {
        form: {
          basePrice: 0,
          currency: 'usd'
        },
        currencies: currencyEnum
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal){
          if(newVal) {
            this.form = Object.assign({}, newVal);
          }
        }
      }
    },
    computed: {
      currencyIcon(){
        return `mdi-currency-${this.lget(this.form, 'currency', 'usd')}`;
      }
    },
    methods: {
      newPrice(val){
        this.form.basePrice = val;
        this.handleInput();
      },
      handleInput(){
        this.$emit('input', this.form);
      }
    }
  };
</script>
