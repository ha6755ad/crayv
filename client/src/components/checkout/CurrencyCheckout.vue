<template>
  <q-card flat style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow-y: scroll">

  </q-card>
</template>

<script>
// import CreateCharge from 'components/ir-commerce/finance/checkout/CreateCharge';
// import TaxLine from 'components/ir-commerce/products/tax/TaxLine';
// import CartLine from 'components/ir-commerce/cart/lines/CartLine';
  import {models} from 'feathers-vuex';
  import {mapActions, mapGetters, mapState} from 'vuex';

  export default {
    name: 'CurrencyCheckout',
    components: {
    // CreateCharge,
    // TaxLine,
    // CartLine
    },
    props: {
      cartIn: Object
    },
    async mounted() {
      let id = this.lget(this.cartIn, '_id', this.lget(this.$route, 'params.cartId', false));

      const checkOrLoadLines = (cart) => {
        if (!Array.isArray(this.lget(cart, 'cartlines', null))) {
          this.$store.dispatch('cart-lines/find', {
            query: {cart: this.lget(cart, '_id')},
            $populateParams: {name: 'withProduct'}
          });
        }
      };

      if (id) {
        await this.loadCart(id, {
          $populateParams: {
            name: 'withLines'
          }
        }).then(res => {
          console.log('cart loaded in checkout drawer', res);
          this.cart = res.clone();
          checkOrLoadLines(res);
        }).catch(err => {
          console.log('error loading cart in checkout drawer', err);
        });
      } else {
        await this.loadCarts({
          query: {
            person: this.user,
            active: true
          },
          $populateParams: {
            name: 'withLines'
          }
        })
          .then(res => {
            console.log('got cart res', res);
            let cart = this.$arrayFilterZero(res.data);
            if (cart) this.cart = cart.clone();
            checkOrLoadLines(cart);
          }).catch(err => console.log('error finding carts in checkout drawer', err));
      }
    },
    data() {
      return {
        cart: new models.api.CrayvCarts().clone(),
        chargeDialog: false,
        order: null
      };
    },
    watch: {},
    computed: {
      ...mapState('auth', {user: 'user'}),
      ...mapGetters('crayv-carts', {findCarts: 'find', getCart: 'get'}),
      ...mapGetters('crayv-vendors', {getVendor: 'get'}),
      ...mapGetters('crayv-cart-lines', {findLines: 'find'}),
      ...mapGetters('orders', {findOrders: 'find'}),
      orderStatus() {
        let order = this.$arrayFilterZero(this.stateOrders.filter(a => a.cart === this.cart._id));
        if (order) {
          let status = this.lget(order, 'status', 'pending');
          if (status === 'pending') return 'Order Processing';
          else if (status === 'complete') return 'Order Complete';
          else return 'Error Processing Order';
        } else return null;
      },
      stateOrders() {
        // TODO: handle pagination
        return this.findOrders({
          query: {
            person: this.user.hasPerson
          }
        }).data.map(a => a.clone());
      },
      stateLines() {
        return this.findLines({
          query: {
            cart: this.lget(this.cart, '_id')
          }
        }).data.map(a => a.clone());
      },
      stateCarts() {
        return this.findCarts({
          query: {
            person: this.lget(this.user, 'hasPerson', '$'),
            active: true
          }
        }).data.map(a => a.clone());
      },
      productList() {
        return this.$flattenArray(this.cartLines).map(c => c.product);
      },
      subTotal() {
        let total = 0;
        this.productList.forEach(product => {
          total += this.lget(product, 'price.pricePaid', 0);
        });
        return total;
      },
      total() {
        //TODO: add tax calc
        return this.subTotal;
      },
      cartId() {
        return this.$route.params.cartId;
      },
      person() {
        return this.user;
      },
      cartLines() {
        let joined = this.lget(this.cart, 'cartlines', []);
        if (joined) return joined;
        else return this.stateLines;
      }
    },
    methods: {
      ...mapActions('crayv-carts', {loadCart: 'get', loadCarts: 'find'}),
      orderMade(order) {
        console.log('order made', order);
        this.order = order;
        this.chargeDialog = false;
      },
      clearOut() {
        this.stateLines.forEach(async line => {
          await line.remove({
            'disableSoftDelete': true
          })
            .then(res => console.log('removed line', res));
        });
        this.stateCarts.forEach(async cart => {
          await cart.remove({
            'disableSoftDelete': true
          })
            .then(res => console.log('removed cart', res));
        });
      }
    }
  };

</script>
