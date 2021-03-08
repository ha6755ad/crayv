<template>
  <div>
    <q-item>
      <q-item-section avatar>
        <q-btn color="color" dense flat :label="discountDisplay">
        </q-btn>
      </q-item-section>
      <q-item-section>
        <q-item-label>
          <span>From <b>{{minDisplay}}</b> to <b>{{maxDisplay}}</b> {{lget(value, 'rangeType') === 'quantity' ? 'orders' : 'total'}}</span>
        </q-item-label>
        <q-item-label caption>
          Discount - {{discountDisplay}}
        </q-item-label>
      </q-item-section>
      <q-item-section side v-if="$scopedSlots.side">
        <slot name="side"></slot>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
  export default {
    name: 'DiscountItem',
    props: {
      value: Object,
      currency: String,
      color: { type: String, default: 'nice' }
    },
    computed: {
      discountDisplay(){
        let discount = this.lget(this.value, 'discount', 0);
        if(this.lget(this.value, 'discountType') === 'percent'){
          return this.$dollarString(discount, '', 2) + '%';
        } else return this.$dollarString(discount, this.currency ? this.$getCurrencyIcon(this.currency) : '', 2);
      },
      minDisplay(){
        let min = this.lget(this.value, 'min', 0);
        if(this.lget(this.value, 'rangeType') === 'quantity'){
          return `${min} orders`;
        } else return `${this.$dollarString(min, this.currency ? this.$getCurrencyIcon(this.currency) : '', 2)}`;
      },
      maxDisplay(){
        let max = this.lget(this.value, 'max', 0);
        if(this.lget(this.value, 'rangeType') === 'quantity'){
          return `${max}`;
        } else return `${this.$dollarString(max, this.currency ? this.$getCurrencyIcon(this.currency) : '', 2)}`;
      }
    }
  };
</script>

<style scoped>

</style>
