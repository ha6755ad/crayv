<template>
  <q-card class="bg-light" flat style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow-y: scroll">
    <template v-if="user && validNameEmail">
    <q-card-section>
      <div class="q-mb-sm text-xs text-mb-xs text-weight-light text-right row justify-end">{{lget(person, 'name', false) ? person.name + '\'s' : 'Your'}} Cart</div>
      <q-separator/>
    </q-card-section>
    <div class="q-px-lg text-xxs text-mb-xxs text-weight-medium">{{cartLineCount}} {{cartLineCount === 1 ? 'item'
      : 'items'}}
    </div>


    <template v-for="(cart, idx) in cartList">
    <div :key="`cart-${idx}`" class="bg-white q-my-lg" style="position: relative">

      <div class="t-r" style="display: flex">
      <q-btn dense flat :icon="$getProductCurrencyIcon(lget(cart, 'currency'))">
        <q-tooltip class="text-white bg-dark">Items in this cart paid in {{lget(cart, 'currency')}}</q-tooltip>
      </q-btn>
        <q-btn dense flat icon="mdi-delete-empty" @click="inactivate(cart)" color="red"/>
      </div>

      <q-dialog :value="chargeDialog === idx" @input="val => !val ? chargeDialog = -1 : ''">
        <q-card style="width: 500px; max-width: 80vw">
          <template v-if="lget(cart, 'currency', 'ngn') === 'ngn'">
            <flutter-wave-checkout :cart-in="cart"></flutter-wave-checkout>
          </template>
          <template v-else>
          <create-charge :cart-in="cart" :lines-in="lget(cart, 'cartlines', [])" @order="orderMade"/>
          </template>
        </q-card>
      </q-dialog>


    <div class="q-my-lg row justify-center text-md text-mb-md text-primary text-weight-bold" v-if="getOrderStatus(cart)">{{getOrderStatus(cart)}}</div>
    <template v-for="(line, i) in lget(cart, 'cartlines', [])">
      <cart-line :line-in="line" :key="`line-${i}`" @remove="cartList[idx]['cartlines'].splice(i, 1)"></cart-line>
      <q-separator :key="`separator-${i}`"/>
    </template>
    <q-card-section>
      <div class="row justify-end">
        <div class="text-xxs text-mb-xxs text-weight-medium">
          <template v-if="$getCartTotal(cart) > 0">
          <div class="text-weight-light">Subtotal: {{$dollarString($getCartSubTotal(cart), $getCurrencySymbol(null, lget(cart, 'currency')), 2)}}</div>
          <tax-line></tax-line>
          </template>
          <div>Total: {{$dollarString($getCartTotal(cart), $getCurrencySymbol(null, lget(cart, 'currency')), 2)}}</div>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row justify-end">
        <div class="q-gutter-sm" style="display: flex; flex-direction: column">
<!--          <q-btn @click="$emit('close')" size="sm" outline color="secondary" label="keep shopping"/>-->
          <q-btn label="checkout" color="primary" @click="chargeDialog = idx" :disable="getOrderStatus(cart) === 'Order Complete'"/>
        </div>
      </div>
    </q-card-section>
    </div>

    <q-separator color="primary" :key="`sep-${idx}`"/>
    </template>
    </template>
    <template v-else>
      <div class="text-xs text-mb-sm text-weight-medium q-pa-md">Your account must have a name and email address in order to checkout. Otherwise we cannot send valid receipts. Please update your profile to continue</div>
      <q-separator class="q-my-md"/>
      <div class="col-12">
        <div class="row justify-center">
          <personal-profile></personal-profile>
        </div>
      </div>
    </template>
  </q-card>
</template>

<script>
  import {mapGetters, mapActions } from 'vuex';
  import CartLine from '../cart/lines/CartLine';
  import TaxLine from '../products/tax/TaxLine';
  import {models} from 'feathers-vuex';
  import CreateCharge from '../finance/checkout/CreateCharge';
  import PersonalProfile from 'components/family-pod/personal/PersonalProfile';
  import FlutterWaveCheckout from 'components/flutterwave/FlutterWaveCheckout';

  export default {
    name: 'CheckoutDrawer',
    components: { FlutterWaveCheckout, PersonalProfile, CreateCharge, TaxLine, CartLine },
    props: {},
    mounted(){
      if(this.cartsIn) {
        this.cartsIn.forEach(async cart => {
          let id = this.lget(cart, '_id', this.lget(this.$route, 'params.cartId', false));

          const checkOrLoadLines = (cart) => {
            if (!Array.isArray(this.lget(cart, 'cartlines', null))) {
              this.$store.dispatch('cart-lines/find', {
                query: { cart: this.lget(cart, '_id') },
                $populateParams: { name: 'withProduct' }
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
                checkOrLoadLines(cart);
              }).catch(err => console.log('error finding carts in checkout drawer', err));
          }
        });
      }
    },
    data(){
      return {
        activeCart: new models.api.CrayvCarts().clone(),
        chargeDialog: -1,
        order: null,
        cartList: []
      };
    },
    watch: {
      cartsIn: {
        immediate: true,
        handler(newVal, oldVal){
          if(newVal && !oldVal || newVal && newVal.length !== oldVal.length) {
            this.cartList = newVal.map(a => a.clone());
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters('crayv-carts', { findCarts: 'find', getCart: 'get' }),
      ...mapGetters('crayv-vendors', {getVendor: 'get'}),
      ...mapGetters('crayv-cart-lines', { findLines: 'find' }),
      ...mapGetters('orders', {findOrders: 'find'}),
      validName(){
        return this.lget(this.user, 'name', '').length > 1;
      },
      validEmail(){
        return this.isEmailRule(this.user, 'email', '');
      },
      validNameEmail(){
        return this.validName && this.validEmail;
      },
      cartsIn(){
        return this.stateCarts;
      },
      cartLineCount(){
        let list = this.$flattenArray(this.stateCarts.map(a => a.cartlines));
        if(list) return list.length;
        else return 0;
      },
      stateCartLines(){
        let list = this.cartList ? this.cartList.map(a => a._id) : [];
        return this.findLines({
          query: {
            active: true,
            cart: { $in: list }
          }
        }).data.map(a => a.clone());
      },
      stateOrders(){
        // TODO: handle pagination
        return this.findOrders({
          query: {
            person: this.lget(this.user, '_id')
          }
        }).data.map(a => a.clone());
      },
      stateCarts(){
        return this.findCarts({
          query: {
            person: this.user._id,
            active: true
          }
        }).data;
      },
      cartId(){
        return this.lget(this.cartIn, '_id', this.$route.params.cartId);
      },
      person() {
        return this.user;
      }
    },
    methods: {
      ...mapActions('crayv-carts', { loadCart: 'get', loadCarts: 'find' }),
      inactivate(cart){
        this.$q.dialog({
          title: 'Clear All Items?',
          message: 'This cannot be undone',
          ok: {
            color: 'accent',
            label: 'yes',
            push: true,
            size: 'sm'
          },
          cancel: {
            color: 'primary',
            label: 'nevermind',
            push: true,
            size: 'sm'
          }
        }).onOk(() => {
          this.$store.dispatch('carts/remove', [cart._id]);
        });
      },
      getOrderStatus(cart){
        let order = this.$arrayFilterZero(this.stateOrders.filter(a => a.cart === cart._id));
        if(order){
          let status = this.lget(order, 'status', 'pending');
          if(status === 'pending') return 'Order Processing';
          else if(status === 'complete') return 'Order Complete';
          else return 'Error Processing Order';
        } else return null;
      },
      getCartLines(cart){
        return this.lget(cart, 'cartlines', []);
      },
      orderMade(order){
        console.log('order made', order);
        this.order = order;
        this.chargeDialog = -1;
      },
      clearOut(){
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
