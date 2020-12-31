<template>
  <div class="fill_size q-pa-md">
    <div class="text-md text-mb-md text-weight-medium">Checkout</div>
    <div class="text-xs text-mb-xs text-weight-light">Confirm your information</div>
    <q-separator class="q-my-md" color="accent"/>
    <q-card flat>
      <div class="col-12 q-gutter-lg">
        <q-input :value="lget(transaction, 'customer.name', 'Enter Name')" @input="transaction.customer.name = $event" label="Your Name"/>
        <q-input :value="lget(transaction, 'customer.email', 'Enter Email')" @input="lset(transaction, 'customer.email', $event)" label="Your Email"/>
        <div class="row justify-end items-center">
          <div style="display: flex; align-items: center">
            <q-icon color="accent" class="q-mr-xs" size="20px" name="mdi-currency-ngn"/><div class="text-xs text-mb-sm text-weight-bold">{{lget(transaction, 'amount', 0)}}</div>
          </div>
        </div>
        <div class="q-pa-md row justify-end">
          <q-btn icon="mdi-check" v-if="!linkReady" push @click="initializeTransaction" color="accent" label="confirm"></q-btn>
          <a style="text-decoration: none;" v-if="linkReady" :href="link" target="_blank">
          <q-btn push color="blue" icon="mdi-open-in-new" label="Order Created - Click to pay"></q-btn>
          </a>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
  import {mapGetters, mapState} from 'vuex';
  import {models} from 'feathers-vuex';

  const defaultTransaction = () => {
    return {
      amount: 0,
      customer: {
        name: '',
        email: '',
        phonenumber: ''
      },
      payment_options: ['card', 'bank', 'mobilemoney', 'visaqr'],
    };
  };

  export default {
    name: 'FlutterWaveCheckout',
    components: {},
    props: {
      cartIn: Object
    },
    data() {
      return {
        linkReady: false,
        subTotal: 0,
        taxTotal: 0,
        transaction: defaultTransaction(),
        order: new models.api.Orders().clone(),
        transResponse: null
      };
    },
    created() {
    },
    mounted() {
      console.log('mounted', this.user.email);
      this.setData();
    },
    watch: {
      link: {
        immediate: true,
        handler(newVal){
          if(newVal){
            this.linkReady = true;
            console.log('saw link ', newVal);
            window.open(newVal, '_blank');
          }
        }
      }
    },
    computed: {
      ...mapState('auth', {
        accessToken: 'accessToken'
      }),
      ...mapGetters('auth', { user: 'user' }),
      redirectUrl(){
        let env = process.env.VUE_APP_URL;
        return  env ? env :'https://legacycoin.co/orders';
      },
      link(){
        return this.lget(this.transResponse, 'link');
      }
    },
    methods: {
      setData(){
        console.log('setting data');
        this.transaction.customer.email = this.lget(this.user, 'email', '');
        this.subTotal = this.lget(this.cartIn, 'subTotal', 0);
        this.taxTotal = this.lget(this.cartIn, 'taxTotal', 0);
        this.transaction.customer.name = this.lget(this.user, 'name', '');
        this.transaction.customer.phonenumber = this.lget(this.user, 'phone.number.e164', '');
        this.transaction.amount = this.$getCartTotal(this.cartIn);
        this.transaction.tx_ref = this.lget(this.cartIn, '_id');
        this.transaction.currency = 'NGN';
        this.transaction.redirect_url = this.redirectUrl;
        this.transaction.customizations = {
          title: 'Legacy Coin Checkout',
          description: 'Thank you for building the LGCY Network!',
          logo: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/legacy/legacy_coin.png'
        };
      },
      async initializeTransaction() {
        console.log('create', this.transaction);
        await this.$store.dispatch('flutterwave/create', this.transaction)
          .then(res => {
            if(this.lget(res, 'status') === 'error'){
              res.errors.forEach((err, i) => {
                if( i < 5) this.$errNotify(err.field + ' - ' + err.message );
              });
            } else {
              console.log('init transaction res', res);
              this.createOrder(res);
            }
          })
          .catch(err => {
            this.$errNotify('Error creating transaction ', + err.message);
            console.error('transaction error', err);
          });
      },
      async createOrder(res){
        console.log('create order', this.linesIn);
        let list = [];
        this.lget(this.cartIn, 'cartlines', []).forEach(line => {
          if(line.group_order) this.order.group_order = line.group_order;
          list.push(this.$createProductOrder(this.lget(line, 'fullProduct', null), this.lget(line, 'product.quantity', 0), {}, this.lget(line, 'product.event')));
        });
        this.order.products = list;
        this.order.reference.id = this.lget(this.cartIn, '_id');
        this.order.reference.url = this.lget(this.transResponse, 'link');
        console.log('pushed lines', list, this.order);
        // TODO: handle group orders
        let obj = {
          person: this.user._id,
          subtotal: this.subTotal,
          tax: this.taxTotal,
          cart: this.cartIn._id,
          status: this.lget(this.cartIn, 'subtotal', 1) > 0 ? 'pending' : 'complete',
          location: this.lget(this.person, 'address'),
          soldBy: this.lget(this.$route, 'query.referrer')
        };
        Object.keys(obj).forEach(a => {
          if ((obj[a] && typeof obj[a] !== 'undefined') || obj[a] === 0) {
            this.order[a] = obj[a];
          }
        });

        await this.order.save()
          .then(orderResponse => {
            this.transResponse = this.lget(res, 'data');
            this.linkReady = true;
            let contestId = this.lget(this.$route, 'query.contest');
            if(contestId) {
              this.$store.dispatch('network-credit/create', {
                contestId: contestId,
                conversionType: 'buy',
                orderId: orderResponse._id
              });
            }
            this.order = orderResponse.clone();
            if(this.subTotal === 0){
              this.$q.notify({message: 'Order Created', color: 'positive'});
              this.$emit('order', this.order);
            }
            console.log('order created', this.linkReady, orderResponse);
            this.$q.loading.hide();
            // console.log('system order patched with order id ', res)
            console.log(this.transResponse);
          }).catch(err => {
            this.$q.loading.hide();
            this.$errNotify('Error creating order ' + err.message);
          });
      },
      openNewWindow(url){
        console.log('open new window', url);
        window.open(url, '_blank');
      }
    }
  };
</script>

<style lang="scss" scoped>

  .init-transaction-card {
    width: 60%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .init-transaction-form {
    padding: 10px;
  }
</style>
