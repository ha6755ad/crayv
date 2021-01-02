<template>
  <q-card :class="$bgSecondary" style="height: 100%; width: 100%">
    <div class="row" style="height: 100%">
      <div class="col-12 col-sm-6" style="height: 100%">
        <q-card-section style="height: 100%; width: 100%">
          <template v-if="productModel === 'product-groups'">
            <product-group-card :lineup-in="stateLineup"></product-group-card>
          </template>
          <template v-if="productModel === 'products'">
            <product-card :value="stateProduct"></product-card>
          </template>
        </q-card-section>
      </div>
      <div class="col-12 col-sm-6" style="height: 100%">
        <q-card-section>
          <div class="row text-xs text-mb-xs text-weight-bold">{{subscriptionIn.name}}</div>
          <div class="row text-xxs text-mb-xxs text-weight-light">{{subscriptionIn.description}}</div>
        </q-card-section>
        <q-separator :color="getTextColor('--q-color-secondary')"/>
        <q-card-section>
          <div class="text-xs text-mb-xs text-weight-bold">Pricing Options</div>
          <div class="row text-xs text-mb-xs text-weight-light" v-for="(opt, i) in subscriptionIn.options" :key="`opt-${i}`">{{opt.name}}: {{dollarString(opt.price.basePrice, '$')}}</div>
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>

<script>
  import {mapGetters} from 'vuex';
  import ProductGroupCard from '../../product-groups/cards/ProductGroupCard';
  import ProductCard from '../../products/card/ProductCard';

  export default {
    name: 'SubscriptionCard',
    components: { ProductCard, ProductGroupCard },
    props: {
      subscriptionIn: Object
    },
    computed: {
      ...mapGetters('products', { getProduct: 'get' }),
      ...mapGetters('product-groups', { getLineup: 'get' }),
      productModel() {
        return this.subscriptionIn?.product?.productModel ? this.subscriptionIn.product.productModel : '';
      },
      stateProduct() {
        if (this.productModel === 'products') return this.getProduct(this.subscriptionIn.product.id);
        else return null;
      },
      stateLineup() {
        if (this.productModel === 'product-groups') return this.getLineup(this.subscriptionIn.product.id);
        else return null;
      }
    }
  };
</script>
