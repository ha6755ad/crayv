<template>
  <div :class="colClass" :style="styleIn">
    <q-input
      :input-class="inputClass"
      :dense="dense"
      filled
      v-model.number="price"
      @input="handleInput"
      :label="$attrs.label ? $attrs.label : 'Price'"
      mask="#.##"
      fill-mask="0"
      reverse-fill-mask
      hint="$#.##"
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
      inputClass: {
        type: String,
        default: 'text-right'
      },
      colClass: String,
      styleIn: [Object, String],
      dense: Boolean,
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
          if(typeof newVal === 'number' && newVal !== this.price) {
            this.price = newVal.toFixed(2);
          }
        }
      }
    },
    computed: {
      currencyIcon(){
        return `mdi-currency-${this.currencyIn}`;
      }
    },
    methods: {
      handleInput(){
        this.$emit('input', this.price);
      }
    }
  };
</script>
