<template>
  <q-card flat style="width: 100%">
    <q-card-section>
      <div class="text-xs text-mb-xs text-weight-light">Make Payment</div>
    </q-card-section>
    <q-card-section>
      <div class="col-12 q-mb-md">
        <q-list>
          <q-separator/>
          <q-expansion-item v-model="expansionCards" dense-toggle>
            <template v-slot:header>
              <q-item-section>
                <q-item-label>Your Payment Method</q-item-label>
                <q-item-label caption v-if="lget(paymentIntent, '_id', null)">Card for {{lget(activeCard,'billing_details.name', 'No Name')
                  }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <template v-if="subTotal === 0 || !lget(paymentIntent, 'id', null)">
                  <q-btn flat size="sm" :label="subTotal > 0 ? 'Select Payment Method' : 'No Charges'" :disable="subTotal === 0"/>
                </template>
                <template v-else>
                <div class="__mini_card text-xxxs text-mb-xxxs">
                  <div>...{{lget(activeCard, 'card.last4')
                    }}
                  </div>
                  <div class="text-0-7">ex: {{lget(activeCard, 'card.exp_month', '00') + '/' +
                    lget(activeCard, 'card.exp_year', '0000')}}
                  </div>
                </div>
                </template>
              </q-item-section>
            </template>
            <q-card flat>
              <account-cards @newCard="startPaymentIntent" @cardClick="handleCardClick"
                             :active-card-in="activeCard"></account-cards>
            </q-card>
          </q-expansion-item>
          <q-separator/>
        </q-list>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row justify-end" style="width: 100%">
        <table class="text-xs text-mb-xs text-right" style="width: 60%; min-width: 250px">
          <thead style="width: 100%">
          <tr style="width: 100%;" class="__title_row text-weight-light">
            <td>Charges</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>SubTotal: {{$dollarString(subTotal, $getCurrencySymbol(null, lget(cartIn, 'currency')), 2)}}</td>
          </tr>
          <tr>
            <td>Taxes: {{$dollarString(taxTotal, $getCurrencySymbol(null, lget(cartIn, 'currency')), 2)}}</td>
          </tr>
          <tr>
            <td>Total: {{$dollarString(taxTotal + subTotal, $getCurrencySymbol(null, lget(cartIn, 'currency')), 2)}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row justify-end">
        <q-btn :label="subTotal > 0 ? 'pay' : 'confirm order'" class="glossy bg-primary text-light" @click="createOrder"/>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
  import { models } from 'feathers-vuex';
  import { mapActions, mapGetters, mapState } from 'vuex';
  import AccountCards from '../../family-pod/payment/AccountCards';

  export default {
    name: 'CreateCharge',
    components: {
      AccountCards,
    },
    props: {
      cartIn: Object,
      linesIn: Array,
    },
    mounted () {
      this.subTotal = this.$getCartSubTotal(this.cartIn);
      this.taxTotal = this.lget(this.cartIn, 'taxTotal', 0);
    },
    data () {
      return {
        subTotal: 0,
        taxTotal: 0,
        paymentIntent: null,
        paymentIndex: 0,
        guaranteeDialog: false,
        order: new models.api.CrayvOrders().clone(),
        activeCard: null,
        expansionCards: false
      };
    },
    watch: {
      paymentItems: {
        immediate: true,
        handler (newVal) {
          if (newVal?.length > 0 && this.subTotal > 0) {
            console.log('loading intents');
            this.loadIntents();
          }
        }
      },
    },
    computed: {
      ...mapState('auth', { user: 'user' }),
      ...mapGetters('stripe-payment-method', { findMethods: 'find' }),
      ...mapGetters('stripe-customer', { getCustomer: 'get' }),
      ...mapGetters('stripe-payment-intent', { findPaymentIntents: 'find' }),
      person () {
        return this.user;
      },
      customerId () {
        return this.lget(this.person, 'settings.customer.stripe_id', false);
      },
      customer () {
        if (this.customerId) {
          return this.getCustomer(this.customerId);
        } else {
          return null;
        }
      },
    },
    methods: {
      ...mapActions('stripe-setup-intent', {
        createIntent: 'create',
        loadSIntents: 'find',
        cancelIntent: 'patch'
      }),
      ...mapActions('stripe-payment-intent-confirm', {
        confirmIntent: 'create',
      }),
      ...mapActions('stripe-charge', { createStripeCharge: 'create' }),
      ...mapActions('stripe-payment-intent', {
        createPaymentIntent: 'create',
        updatePaymentIntent: 'update',
        loadPaymentIntent: 'find'
      }),
      async handleCardClick (item) {
        this.activeCard = item;
        if (this.paymentIntent) {
          await this.updatePaymentIntent([this.paymentIntent.id, { payment_method: item.id }])
            .then(res => {
              // console.log('payment intent updated', res)
              this.paymentIntent = res.clone();
              this.expansionCards = false;
            }).catch(err => {
              console.log('error updating payment intent', err);
            });
        } else {
          this.startPaymentIntent(item);
        }
      },
      startPaymentIntent (newCard) {
        if (!this.lget(this.paymentIntent, 'id') && this.subTotal > 0) {
          this.$q.loading.show({
            message: 'Preparing Order...'
          });
          // console.log('card', newCard)
          let email = this.$getDefaultProfileEmail(this.person);
          let intent = {
            amount: (this.subTotal + this.taxTotal) * 100,
            currency: 'usd',
            customer: this.customerId,
            payment_method: newCard.id,
            receipt_email: email ? email : this.user.email
          };
          console.log('creating payment intent', intent);
          this.createPaymentIntent(intent)
            .then(intentRes => {
              this.$q.loading.hide();
              // console.log('CreateCharge >> methods >> startPaymentIntent >> if true >> this.createPaymentIntent >> then >> intentRes', intentRes)
              this.paymentIntent = Object.assign({}, intentRes);
            // this.createOrder();
            }).catch(err => {
              this.$q.loading.hide();
              console.log('error setting up payment intent', err);
            });
        }
      },
      async createOrder(){
        console.log('create order', this.linesIn);
        let list = [];
        this.linesIn.forEach(line => {
          if(line.group_order) this.order.group_order = line.group_order;
          list.push(this.$createProductOrder(this.lget(line, 'fullProduct', null), this.lget(line, 'product.quantity', 0), {}, this.lget(line, 'product.event')));
        });
        this.order.products = list;
        console.log('pushed lines', list, this.order);
        // TODO: handle group orders
        let obj = {
          person: this.user._id,
          subtotal: this.subTotal,
          tax: this.taxTotal,
          cart: this.cartIn._id,
          status: this.subTotal > 0 ? 'pending' : 'complete',
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
            let contestId = this.lget(this.$route, 'query.contest');
            if(contestId) {
              this.$store.dispatch('network-credit/create', {
                contestId: contestId,
                conversionType: 'buy',
                orderId: orderResponse._id
              });
            }
            this.createCharge();
            this.order = orderResponse.clone();
            if(this.subTotal === 0){
              this.$q.notify({message: 'Order Created', color: 'positive'});
              this.$emit('order', this.order);
            }
            console.log('order created', orderResponse);
            this.$q.loading.hide();
            // console.log('system order patched with order id ', res)
            this.expansionCards = false;
          }).catch(err => {
            this.$q.loading.hide();
            this.$errNotify('Error creating order ' + err.message);
          });
      },
      async createCharge () {
        // console.log('do i have a payment intent', this.paymentIntent)
        if (this.paymentIntent) {
          this.$q.loading.show({
            message: 'Processing Order...'
          });
          await this.confirmIntent({ id: this.paymentIntent.id })
            .then(async res => {
              console.log('confirm intent', res);
              this.$successNotify('Payment Confirmed');
              this.$q.loading.hide();
              this.order.status = 'complete';
              this.order.confirmation = {id: res.id};
              await this.order.save()
                .then(res => {
                  console.log('order saved', res);
                  setTimeout(() => {
                    this.$router.push({ path: '/orders', query: this.$route.query });
                  }, 2000);
                  this.$emit('order', res);
                })
                .catch(err => {
                  this.$errNotify('Error updating your order - please contact us');
                  console.log('error updating order after payment intent', err);
                });
            })
            .catch(err => {
              console.log('Error confirming payment intent', err);
            });
          // } else if(this.subTotal === 0){
          //   this.createOrder();
        } else {
          this.$q.notify({
            message: 'Please select a payment method first', color: 'info'
          });
        }
      },
      loadIntents () {
        console.log('CreateCharge >> methods >> loadIntents >> starting to load intents');
        this.loadSIntents({
          query: {
            customer: this.customerId
          },
          disableSoftDelete: true
        })
          .then(() => {
            // console.log('CreateCharge >> methods >> loadIntents >> this.loadSIntents >> then >> res', res)
            this.loadPaymentIntent({
              query: {
                customer: this.customerId
              },
              disableSoftDelete: true
            })
              .then(() => {
                // console.log('CreateCharge >> methods >> loadIntents >> this.loadSIntents >> then >> this.loadPaymentIntent >> then >> res', res)
                // TODO: handle loading in existing intent
                this.startPaymentIntent();
              })
              .catch(err => {
                console.log('CreateCharge >> methods >> loadIntents >> this.loadSIntents >> then >> this.loadPaymentIntent >> catch >> err', err);
              });
          })
          .catch(err => {
            console.log('CreateCharge >> methods >> loadIntents >> this.loadSIntents >> catch >> err', err);
          });
      },
    }
  };
</script>

<style scoped lang="scss">
  .__title_row {
    td {
      border-bottom: solid .5px rgba(0, 0, 0, .4)
    }
  }

  .__mini_card {
    border-radius: 4px;
    border: solid 1px #020e26;
    background: white;
    color: #101010;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 5px 8px;
  }
</style>
