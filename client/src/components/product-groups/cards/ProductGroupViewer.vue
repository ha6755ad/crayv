<template>
  <div style="overflow-y: scroll" class="fill_size relative-position q-px-md q-pt-md q-pb-lg">
    <div class="text-md text-mb-md text-weight-medium">{{lget(value, 'name')}}</div>
    <div class="text-xs text-mb-sm text-weight-light">{{lget(value, 'description')}}</div>
    <q-separator class="q-my-md"></q-separator>
    <div class="q-pa-md row" v-if="sellType !== 'a-la-carte'">
      <div style="display: flex; flex-direction: column; justify-content: flex-end">
        <q-icon size="30px" :name="$getCurrencyIcon(lget(value, 'price.currency'))"/>
        <div class="text-md text-mb-md text-green text-weight-bold" v-html="priceDisplay"></div>
        <q-btn icon="mdi-cart-check" color="primary" push :label="`Buy all ${productList.length} items`"></q-btn>
      </div>
    </div>
    <div class="q-mt-md text-sm text-mb-sm text-weight-medium" v-if="sellType !== 'package'">
      Shop Individually
    </div>
    <q-separator></q-separator>
    <div class="row q-my-md">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 q-pa-sm" v-for="(product, i) in productList" :key="`product-${i}`">
        <q-card>
        <corner-card :value="product"></corner-card>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
  import CornerCard from 'components/products/card/ProductCard';
  export default {
    name: 'ProductGroupViewer',
    components: { CornerCard },
    props: {
      value: Object
    },
    data(){
      return {
        tab: 0,
      };
    },
    computed: {
      sellType(){
        return this.lget(this.value, 'type', 'a-la-carte');
      },
      product(){
        if(this.sellType === 'a-la-carte'){
          return this.lget(this.productList, [this.imgTab]);
        } else return this.value;
      },
      productList() {
        return this.lget(this.value, '_fastjoin.products', []);
      },
      totalPrice(){
        return this.lget(this.product, 'priceObj.total', this.lget(this.product, 'price.basePrice', 0));
      },
      basePrice(){
        return this.lget(this.product, 'price.basePrice', 0);
      },
      priceDisplay() {
        let base = this.basePrice;
        let total = this.totalPrice;
        let exp = this.lget(this.product, 'priceObj.exp', null);
        if (base > total) {
          return `<div><div><span class="text-grey-6" style="text-decoration: line-through">${this.$dollarString(base, '', 2)}</span> <span>${this.$dollarString(total, '', 2)}</span></div><div class="text-xs text-mb-xs absolute-bottom text-weight-light text-primary q-pa-sm">${exp ? 'Expires: ' + this.getDateFormat(exp, 'ddd MMM-DD YYYY') : ''}</div></div>`;
        } else return `<span>${this.$dollarString(total, '', 2)}</span>`;
      },
    }
  };
</script>
