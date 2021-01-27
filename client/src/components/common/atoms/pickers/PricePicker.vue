<template>
  <div :class="colClass" :style="styleIn">
    <q-select
      :readonly="disable"
      :error-message="errorMessage ? errorMessage('price.currency') : null"
      :error="errorCheck ? errorCheck('price.currency') : false"
      v-if="!currencyOff && !borderless"
      label="Currency"
      v-model="form.currency"
      @input="handleInput"
      :options="currencies"
      option-value="value"
      option-label="name"
      emit-value
      :borderless="borderless"
    ></q-select>
    <q-input
      :disable="disable"
      :borderless="borderless"
      :error-message="errorMessage ? errorMessage('price.basePrice') : null"
      :error="errorCheck ? errorCheck('price.basePrice') : null"
      :input-class="inputClass"
      :dense="dense"
      :filled="!borderless"
      @input="newPrice"
      :value="dollarString(lget(form, 'basePrice', 0), '', 2)"
      :label="!borderless ? label ? label : 'Price' : null"
      mask="#.##"
      fill-mask="0"
      reverse-fill-mask
      :hint="!borderless ? '#.##' : null"
      :hide-bottom-space="borderless"
    >
      <template v-slot:prepend>
        <template v-if="!borderless">
        <q-icon :name="$getCurrencyIcon(form.currency)"/>
        </template>
        <template v-else>
          <q-btn-dropdown size="sm" flat :icon="currencyIcon">
            <q-list dense>
              <q-item v-for="(curr, i) in currencies" :key="`curr-${i}`" @click="handleCurrency(curr.value)" clickable>
                <q-item-section avatar>
                  <q-icon :name="curr.icon"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{curr.name}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat dense size="sm" v-if="form.currency === curr.value" color="positive" icon="mdi-checkbox-marked"></q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </template>
      </template>
    </q-input>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'PricePicker',
    props: {
      disable: Boolean,
      borderless: Boolean,
      inputClass: {
        type: String,
        default: 'text-right text-weight-medium'
      },
      label: String,
      errorCheck: { required: false },
      errorMessage: { required: false },
      currencyOff: Boolean,
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
      ...mapState('currency', {currencies: 'national_currencies'}),
      currencyIcon(){
        return `mdi-currency-${this.lget(this.form, 'currency', 'usd')}`;
      }
    },
    methods: {
      newPrice(val){
        this.form.basePrice = val;
        this.handleInput();
      },
      handleCurrency(val){
        this.form.currency = val;
        this.handleInput();
      },
      handleInput(){
        this.$emit('input', this.form);
      }
    }
  };
</script>
