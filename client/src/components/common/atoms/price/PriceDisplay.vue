<template>
  <div>
    <div class="flex no-wrap justify-end items-center">
      <q-icon :name="$getCurrencyIcon(currency)"></q-icon>
      <div>
        <div class="text-xs text-mb-xs text-weight-medium">
          {{ dollarString(price, '', 2) }}
        </div>
      </div>
    </div>
    <div class="text-right flex items-start justify-end" v-if="delivery">
      <div style="font-size: 9px" class="text-weight-light text-dark">Delivery</div>&nbsp;
      <div class="text-xxxs text-mb-xxxs text-weight-medium">{{ dollarString(delivery, '', 2) }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PriceDisplay',
    props: {
      value: Object,
      pricePath: { type: String, default: 'basePrice' },
      deliveryPath: { type: String, default: 'delivery.basePrice' },
      currencyPath: { type: String, default: 'currency' }
    },
    computed: {
      price(){
        return this.lget(this.value, this.pricePath);
      },
      delivery(){
        return this.lget(this.value, this.deliveryPath);
      },
      currency(){
        return this.lget(this.value, this.currencyPath);
      }
    }
  };
</script>

<style scoped>

</style>
