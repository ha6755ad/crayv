<template>
  <q-card flat style="width: 100%; height: 100%">
    <q-card-section>
      <div class="text-sm text-mb-sm text-weight-light">Payment Settings</div>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-lg">
        <template v-for="(item, i) in items">
          <div class="col-12 col-sm-6 col-md-4 col-lg-3" :key="`itm-${i}`">
            <q-card style="max-height: 600px; overflow-y: scroll">
              <q-card-section>
                <component :is="item.component" v-bind="item.attrs"></component>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
  import creditCardForm from 'components/family-pod/payment/creditCardForm';
  import AccountCards from './AccountCards';
  import {mapActions, mapGetters, mapState} from 'vuex';
  import BankAccounts from 'components/family-pod/payment/BankAccounts';
  import CreditList from 'components/family-pod/payment/CreditList';

  export default {
    name: 'PaymentDetails',
    components: { AccountCards, creditCardForm },
    data() {
      return {
        dialog: false,
        dialogModel: {}
      };
    },
    computed: {
      ...mapState('auth', { user: 'user' }),
      ...mapGetters('stripe-payment-method', { findMethods: 'find' }),
      ...mapGetters('stripe-customer', { getCustomer: 'get' }),
      person() {
        return this.user;
      },
      customerId() {
        return this.lget(this.person, 'settings.customer.stripe_id', false);
      },
      customer() {
        if (this.customerId) {
          return this.getCustomer(this.customerId);
        } else return null;
      },
      items() {
        return [
          {
            label: 'Credit Cards',
            component: AccountCards,
            attrs: { }
          },
          {
            label: 'Bank Accounts',
            component: BankAccounts
          },
          {
            label: 'Internal Credits',
            component: CreditList
          }
        ];
      }
    },
    methods: {
      ...mapActions('stripe-payment-method', {  }),
      ...mapActions('stripe-customer', { loadCustomer: 'get' }),
      async loadStripeCustomer(val) {
        console.log('loading customer', val);
        return await this.loadCustomer(val);
      }
    }
  };
</script>
