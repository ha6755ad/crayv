<template>
  <q-page>
    <div class="q-pa-md text-md text-mb-md text-weight-medium">Product Admin</div>
    <q-separator class="q-my-md"></q-separator>
    <div class="q-px-sm">
    <tab-stepper
      :tabs="pages"
      v-model="tab"
      ></tab-stepper>
    </div>
    <q-tab-panels animated v-model="tab">
      <q-tab-panel v-for="(page, i) in pages" :key="`page-${i}`" :name="i">
        <component :is="page.component" v-bind="page.attrs"></component>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
  import {mapGetters} from 'vuex';
  import TabStepper from 'components/common/atoms/tabs/TabStepper';
  import ProductList from 'components/products/lists/ProductList';
  import ProductGroupList from 'components/product-groups/lists/ProductGroupList';
  import LineupList from 'components/lineups/lists/LineupList';

  export default {
    name: 'Catalog',
    components: { TabStepper },
    data() {
      return {
        tab: 0,
        editing: null,
        productDialog: false,
        creditCardDialog: false,
        viewing: {},
        dialog: false,
      };
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters({ vendorContext: 'vendorContext' }),
      pages(){
        return [
          {
            label: 'Products',
            component: ProductList,
            attrs: {
              title: 'Products',
              value: null,
              subtitle: 'Add and manage products',
              loadWatch: this.lget(this.vendorContext, 'products', []),
              search: true,
              editing: true,
              queryIn: {
                _id: { $in: this.lget(this.vendorContext,'products', [])}
              }
            }
          },
          {
            label: 'Product Groups',
            component: ProductGroupList,
            attrs: {
              title: 'Product Groups',
              subtitle: 'You can use product groups to sell packages, or simply to manage products and lineups more easily by grouping',
              loadWatch: this.lget(this.vendorContext, 'productGroups', []),
              search: true,
              editing: true,
              queryIn: {
                _id: { $in: this.lget(this.vendorContext,'productGroups', [])}
              },
            }
          },
          {
            label: 'Product Lineups',
            component: LineupList,
            attrs: {
              title: 'Product Lineups',
              subtitle: 'Manage your customer facing offerings',
              loadWatch: this.lget(this.vendorContext, 'lineups', []),
              search: true,
              editing: true,
              queryIn: {
                _id: { $in: this.lget(this.vendorContext, 'lineups', []) }
              },
            }
          }
        ];
      },
      vendorId() {
        return this.$store.state.vendorContext?._id ? this.$store.state.vendorContext._id : null;
      },
    },
    methods: {
      getPromotionsForProduct(vendorId, productId) {
        return this.findPromotions({
          query: {
            vendor: vendorId,
            $or: [
              { products: { ids: { $in: [productId] } } },
              { products: { all: true } }
            ]
          }
        }).data;
      },
      // async getProductOrder(prod, quantity) {
      //   let productOptions = [];
      //   prod.options.forEach(o => {
      //     let opt = this.$arrayFilterZero(this.stateProducts.filter(p => p._id === o._id));
      //     let name = this.$lget(opt, 'name');
      //     let desc = this.$lget(opt, 'description');
      //     productOptions.push({
      //       name: name,
      //       description: desc,
      //       pricePaid: o.price.basePrice
      //     });
      //   });
      //   let vendorId = this.$lget(prod, 'vendor.vendorId');
      //   let vendor = {
      //     id: vendorId,
      //     name: this.$arrayFilterZero(this.stateVendors.filter(v => v._id === vendorId), {}, 'name')
      //   };
      //   let bestPromotion = { value: 0 };
      //   let promotions = [];
      //   let promo = await this.getPromotionsForProduct(vendorId, prod._id);
      //   if (promo?.length > 0) {
      //     promo.forEach(p => {
      //       promotions.push(this.$getPromotionValue(p, prod, quantity));
      //     });
      //     bestPromotion = promotions.sort((a, b) => b - a)[0];
      //   }
      //   console.log('promotions sorted', promotions, bestPromotion);
      //   let pricePaid = Math.min(this.$lget(prod, 'basePrice', 0) - bestPromotion.value, this.$lget(prod, 'basePrice', 0));
      //   let pricing = {
      //     basePrice: this.$lget(prod, 'price.basePrice', 0),
      //     promotion: bestPromotion,
      //     pricePaid: pricePaid
      //   };
      //   return this.$createProductOrder(prod, quantity, {
      //     pricing: pricing,
      //     optionList: productOptions,
      //     vendor: vendor
      //   });
      // },
      // async addToCart(val, quantity) {
      //   console.log('adding to cart', val, quantity);
      //   let line = new models.api.CrayvCartLines().clone();
      //   console.log('line', line);
      //   let prod = await this.getProductOrder(val, quantity);
      //   line.products = [prod];
      //   console.log('pushed new line', line);
      //   await line.save()
      //     .then(async res => {
      //       console.log('saved cart line', res);
      //       let cart;
      //       if (!this.stateCarts.length > 0) {
      //         cart = new models.api.CrayvCarts().clone();
      //         cart.person = this.person._id;
      //         cart.lines = [res._id];
      //       } else {
      //         cart = this.$arrayFilterZero(this.stateCarts.filter(c => c.active)).clone();
      //         cart.lines.push(res._id);
      //       }
      //       await cart.save()
      //         .then(res => {
      //           console.log('new cart created', res);
      //           this.$q.notify({ message: 'Added to cart', color: 'positive' });
      //         }).catch(err => this.$errNotify(err.message));
      //     }).catch(err => this.$errNotify(err.message));
      // },
      // startBuyNow(val) {
      //   console.log('buyNow val', val);
      //   this.productDialog = false;
      //   this.creditCardDialog = true;
      // },
      // async finishBuyNow(val) {
      //   console.log('finishBuyNow credit card form @submit val', val);
      //   console.log('finishBuyNow this.viewing', this.viewing);
      //   let payload = {
      //     source: val,
      //     amount: this.viewing.price.basePrice * 100,
      //     currency: 'usd',
      //   };
      //   this.processTransaction(payload)
      //     .then(res => {
      //       console.log('Catalog >> finishBuyNow >> this.processTransaction >> then >> res', res);
      //     })
      //     .catch(err => {
      //       console.log('Catalog >> finishBuyNow >> this.processTransaction >> catch >> err', err);
      //     });
      // }
    }
  };
</script>