<template>
  <div :class="textClass">
    <div class="text-right text-xxxs text-mb-xxxs text-weight-light">Discount</div>
    <div><span><q-icon v-if="currencyIcon && !bestDiscount.append" :name="currencyIcon"/>{{$dollarString(bestDiscount.discount, '', 2)}}{{bestDiscount.append}}</span></div>
  </div>
</template>

<script>
  export default {
    name: 'DiscountDisplay',
    props: {
      textClass: { type: String, default: 'text-xs text-mb-xs text-weight-bold text-right' },
      example: { type: Number, default: 100 },
      value: Object,
      currency: String
    },
    computed: {
      currencyIcon(){
        let c = this.currency ? this.currency : 'usd';
        return this.$getCurrencyIcon(c);
      },
      percentageDiscounts(){
        return this.lget(this.value, 'discounts', []).filter(a => a.discountType === 'percent').sort((a, b) => b.discount - a.discount);
      },
      flatDiscounts(){
        return this.lget(this.value, 'discounts', []).filter(a => a.discountType === 'flat').sort((a, b) => b.discount - a.discount);
      },
      bestDiscount(){
        let pd = this.lget(this.percentageDiscounts, [0]);
        let fd = this.lget(this.flatDiscounts, [0]);
        let fTotal = this.lget(fd, 'discount', 0);
        let pTotal = pd ? (this.lget(pd, 'discount', 0) / 100) * this.example : 0;
        let append = pTotal > fTotal ? '%' : '';
        return {discount: Math.max(pTotal, fTotal), append: append };
      }
    }
  };
</script>

<style scoped lang="scss">

</style>
