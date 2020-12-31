<template>
  <div :class="$attrs.colClass">
    <q-input
      filled
      v-model.number="price"
      @input="$emit('input', price)"
      :label="$attrs.label ? $attrs.label : 'Price'"
      mask="#.##"
      fill-mask="0"
      reverse-fill-mask
      hint="$#.##"
      input-class="text-right"
    >
      <template v-slot:prepend>
        <q-icon :name="currencyIcon"/>
      </template>
    </q-input>
  </div>
</template>

<script>
  export default {
    name: 'PricePicker',
    props: {
      value: Number,
      currencyIn: {
        type: String,
        default: 'usd'
      }
    },
    data(){
      return {
        price: 0
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal){
          this.price = newVal ? newVal.toFixed(2) : 0.00;
        }
      }
    },
    computed: {
      currencyIcon(){
        return `mdi-currency-${this.currencyIn}`;
      }
    }
  };
</script>
