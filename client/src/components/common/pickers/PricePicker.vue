<template>
  <div :class="$attrs.colClass">
    <q-input
      prefix="$"
      filled
      v-model.number="price"
      @input="$emit('input', price)"
      :label="$attrs.label ? $attrs.label : 'Price'"
      mask="#.##"
      fill-mask="0"
      reverse-fill-mask
      hint="$#.##"
      input-class="text-right"
    />
  </div>
</template>

<script>
  export default {
    name: 'PricePicker',
    props: {
      value: Number
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
          this.price = newVal.toFixed(2);
        }
      }
    }
  };
</script>
