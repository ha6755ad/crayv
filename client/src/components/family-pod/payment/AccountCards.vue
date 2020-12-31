<template>
  <q-card flat>
    <q-card-section>
      <div class="row text-xxs text-mb-xs text-weight-light">Credit Cards
        <q-space/>
        <q-btn size="sm" label="add new" icon="mdi-plus" flat @click="addDialog = true"/>
      </div>
    </q-card-section>
    <template v-if="paymentItems.length">
      <q-list separator>
        <q-item v-for="(item, i) in paymentItems" :key="`item-${i}`" clickable @click="$emit('cardClick', item)">
          <q-item-section side>
            <div class="__mini_card text-0-8">
              <div>...{{ lget(item, 'card.last4') }}</div>
              <div class="text-0-7">ex: {{
                  lget(item, 'card.exp_month') + '/' + lget(item,
                    'card.exp_year')
                }}
              </div>
            </div>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ lget(item, 'billing_details.name', 'No Name') }}</q-item-label>
            <!--            <q-item-label caption>{{isSetup(item) ? 'Active' : 'Not Active'}}</q-item-label>-->
          </q-item-section>
          <q-item-section side>
            <div class="row items-center jusitfy-end">
              <q-btn flat @click.stop="$emit('cardClick', item)" size="xs" :label="activeCardIn.id ===
            item.id ? 'active' : 'make active'" :color="activeCardIn.id ===
            item.id ? 'primary' : 'grey-8'"
                     v-if="activeCardIn"/>
              <q-btn flat round icon="mdi-dots-vertical">
                <q-menu>
                  <q-list denses separator>
                    <!--                  <q-item clickable @click="setupStatus(item)">-->
                    <!--                    <q-item-section avatar>-->
                    <!--                      <q-icon :name="isSetup(item) ? 'mdi-cancel' : 'mdi-check-underline-circle-outline'"/>-->
                    <!--                    </q-item-section>-->
                    <!--                    <q-item-section>-->
                    <!--                      <q-item-label>{{isSetup(item) ? 'De-activate' : 'activate'}}</q-item-label>-->
                    <!--                    </q-item-section>-->
                    <!--                  </q-item>-->
                    <q-item clickable @click="removeStripeCard(item)">
                      <q-item-section avatar>
                        <q-icon name="mdi-delete"></q-icon>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Remove Card</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </template>
    <template v-else>
      <div class="text-center row text-italic text-0-9">No payment methods added</div>
    </template>
    <q-dialog v-model="addDialog">
      <q-card class="bg-transparent" flat>
        <credit-card-form @addCard="createStripeCard"/>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import CreditCardForm from './creditCardForm';

  export default {
    name: 'AccountCards',
    components: { CreditCardForm },
    props: {
      activeCardIn: Object
    },
    data() {
      return {
        addDialog: false,
        setupIntent: null
      };
    },
    watch: {
      customerId: {
        immediate: true,
        async handler(newVal, oldVal) {
          if (newVal && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            console.log('got new id', newVal);
            await this.loadIntents();
          }
        }
      },
      paymentItems: {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal?.length && !oldVal?.length) {
            this.$emit('cardClick', this.$arrayFilterZero(newVal));
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters('stripe-payment-method', { findMethods: 'find' }),
      ...mapGetters('stripe-customer', { getCustomer: 'get' }),
      ...mapGetters('stripe-setup-intent', { findPaymentIntents: 'find' }),
      stateIntents() {
        return this.findPaymentIntents({
          query: {
            customer: this.customerId
          }
        }).data;
      },
      person() {
        return this.user;
      },
      customerId() {
        return this.$lget(this.person, 'settings.customer.stripe_id', false);
      },
      customer() {
        if (this.customerId) {
          return this.getCustomer(this.customerId);
        } else return null;
      },
      paymentItems() {
        return this.findMethods({
          query: {
            customer: this.customerId,
            type: 'card'
          }
        }).data;
      },
    },
    methods: {
      ...mapActions('stripe-setup-intent', {
        createIntent: 'create',
        loadSIntents: 'find',
        cancelIntent: 'patch'
      }),
      ...mapActions('stripe-payment-method', { createMethod: 'create', loadMethods: 'find', removeCard: 'remove' }),
      loadIntents() {
        this.loadSIntents({
          query: {
            customer: this.customerId
          },
          disableSoftDelete: true
        })
          .then(res => {
            console.log('loaded setup intents', res, this.customerId);
            this.loadPaymentMethods();
          })
          .catch(err => {
            console.log('error loading setup intents', err);
          });
      },
      async loadPaymentMethods() {
        await this.loadMethods({
          query: {
            customer: this.customerId,
            type: 'card'
          },
          disableSoftDelete: true
        })
          .then(res => {
            console.log('loaded methods', res);
          }).catch(err => {
            console.log('error loading  methods', err);
          });
      },
      async removeStripeCard(card) {
        this.$q.dialog({
          cancel: true,
          title: 'Remove Card?',
          message: 'Are you sure you want to remove this card? This cannot be undone. You can also de-activate a card - which can be undone.'
        }).onOk(() => {
          this.removeCard([card.id, { disableSoftDelete: true }]);
        });
      },
      startIntent(newCard) {
        this.$q.loading.show({
          message: 'Confirming Card...'
        });
        console.log('setting up intent', newCard);
        let intent = {
          confirm: true,
          customer: this.customerId,
          payment_method: newCard.id,
        };
        console.log('creating setup intent', intent);
        this.createIntent(intent)
          .then(intentRes => {
            this.loadPaymentMethods();
            this.$q.loading.hide();
            // console.log('CreateCharge >> methods >> startPaymentIntent >> if true >> this.createPaymentIntent >> then >> intentRes', intentRes)
            this.setupIntent = Object.assign({}, intentRes);
          // this.createOrder();
          }).catch(err => {
            this.$q.loading.hide();
            console.log('error setting up payment intent', err);
          });
      },
      async createStripeCard(payload) {
        console.log('got submit event', payload);
        let card = {
          exp_month: payload.card.exp_month,
          exp_year: payload.card.exp_year,
          number: payload.card.number,
          cvc: payload.card.cvc
        };

        let address = this.$getStripeAddressObj(this.person);
        let email = this.lget(this.person, 'email', 'no@email');
        let name = this.lget(payload, 'card.name', null);
        let phone = this.lget(this.person, 'phone.number.e164');

        let billing_details = {};
        if (address) billing_details.address = address;
        if (email) billing_details.email = email;
        if (name) billing_details.name = name;
        if (phone) billing_details.phone = phone;

        await this.createMethod({
          type: 'card',
          billing_details: Object.keys(billing_details).length > 0 ? billing_details : null,
          card: card
        }).then(cardRes => {
          this.addDialog = false;
          this.startIntent(cardRes);
          this.$emit('newCard', cardRes);
          console.log('card created', cardRes);
        }).catch(err => {
          this.$errNotify(err.message);
          console.log('error creating card', err);
        });

      }
    }
  };
</script>

<style scoped lang="scss">
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
