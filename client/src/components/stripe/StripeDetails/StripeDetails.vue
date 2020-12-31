<template>
  <div id="StripeDetails">
    <div v-if="account">
      <q-card class="details">
        <q-card-section class="row details__section">
          <div>
            <div class="text-h4">Type:
              <q-btn @click="test" />
              <q-input readonly class="q-ml-sm text-h6" :value="stripeAccount.business_type"/>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="row details__section">
          <BusinessProfileDetails :profile="stateAccount" @businessProfile="update"/>
        </q-card-section>
        <q-card-section class="row details__section">
          <IndividualDetails :info="info" @addressform="update"
                             v-if="stripeAccount.business_type === 'individual'"/>
          <CompanyDetails :info="info" @companyInfo="update" v-if="businessType === 'company'"/>
        </q-card-section>
        <q-card-section class="row details__section">
          <CardDetails @add="toggle('creditCardDialog')" :cards="cards"/>
          <q-separator vertical class="q-mx-md"/>
          <BankDetails :accounts="bankAccounts" @defaultCurr="defaultCurr" @add="toggle('bankAccountDialog')"/>
        </q-card-section>
      </q-card>
    </div>
    <div v-else>
      <q-spinner size="3em"/>
    </div>
    <q-dialog v-model="creditCardDialog">
      <credit-card-form @addCard="newExternalAccount"/>
    </q-dialog>
    <q-dialog v-model="bankAccountDialog">
      <q-card style="min-width: 500px">
        <BankForm @saveBank="newExternalAccount" :countries="countries"/>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapState} from 'vuex';
  import BusinessProfileDetails from './DetailCards/BusinessProfileDetails';
  // import AddressDetails from './DetailCards/AddressDetails';
  import BankDetails from './DetailCards/BankDetails';
  import CardDetails from './DetailCards/CardDetails';
  import IndividualDetails from './DetailCards/IndividualDetails';
  import CompanyDetails from './DetailCards/CompanyDetails';
  import CreditCardForm from '../../common/substance/creditCardForm';
  import BankForm from '../StripeFormTypes/BankForm';


  export default {
    name: 'StripeDetails',
    components: {
      CreditCardForm,
      BusinessProfileDetails,
      BankDetails,
      BankForm,
      CardDetails,
      IndividualDetails,
      // AddressDetails,
      CompanyDetails
    },
    props: {
      account: Object
    },
    data() {
      return {
        stripeAccount: {},
        creditCardDialog: false,
        bankAccountDialog: false,
        countries: [
          {name: 'Australia', id: 'AU'},
          {name: 'Austria', id: 'AT'},
          {name: 'Belgium', id: 'BE'},
          {name: 'Canada', id: 'CA'},
          {name: 'Denmark', id: 'DK'},
          {name: 'Finland', id: 'FI'},
          {name: 'France', id: 'FR'},
          {name: 'Germany', id: 'DE'},
          {name: 'Hong Kong', id: 'HK'},
          {name: 'Ireland', id: 'IE'},
          {name: 'Italy', id: 'IT'},
          {name: 'Japan', id: 'JP'},
          {name: 'Luxembourg', id: 'LU'},
          {name: 'Netherlands', id: 'NL'},
          {name: 'New Zealand', id: 'NZ'},
          {name: 'Norway', id: 'NO'},
          {name: 'Portugal', id: 'PT'},
          {name: 'Singapore', id: 'SG'},
          {name: 'Spain', id: 'ES'},
          {name: 'Sweden', id: 'SE'},
          {name: 'Switzerland', id: 'CH'},
          {name: 'United Kingdom', id: 'GB'},
          {name: 'United States', id: 'US'},
        ],
      };
    },
    mounted() {
      this.getStripeAccount()
        .then((res) => {
          console.log('StripeDetails >> mounted >> this.getStripeAccount >> then >> res', res);
          this.stripeAccount = this.stateAccount.clone();
          console.log('account, mounted', this.account);
          console.log('stripeAccount, mounted', this.stripeAccount);
        })
        .catch(err => {
          console.error('StripeDetails >> mounted >> this.getStripeAccount >> catch >> err', err);
        });

    },
    watch: {
      stateAccount: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal) {
            this.stripeAccount = newVal;
          }
        }
      }
    },
    computed: {
      ...mapGetters('stripe-account', {accountGetter: 'get'}),
      ...mapState({vendorContext: 'vendorContext'}),
      ...mapGetters('stripe-external-account', {getBankInfo: 'get'}),
      stateAccount() {
        if (this.account) {
          return this.accountGetter(this.account.id);
        } else {
          return {};
        }
      },
      businessType() {
        if (this.stripeAccount.business_type === 'individual') {
          return 'individual';
        } else {
          return 'company';
        }
      },
      cards() {
        if (this.stripeAccount.external_accounts) {
          return this.stripeAccount.external_accounts.data.filter(item => item.object === 'card');
        } else {
          return [];
        }
      },
      bankAccounts() {
        if (this.stripeAccount.external_accounts) {
          return this.stripeAccount.external_accounts.data.filter(item => item.object === 'bank_account');
        } else {
          return [];
        }
      },
      info() {
        if (this.businessType === 'individual') {
          console.log('account', this.account);
          if (this.stripeAccount.individual) {
            return this.stripeAccount.individual;
          } else {
            return undefined;
          }
        } else {
          if (this.stripeAccount.company) {
            return this.stripeAccount.company;
          } else {
            return undefined;
          }
        }
      }
    },
    methods: {
      ...mapActions('stripe-account', {getAccount: 'get', updateAccount: 'update'}),
      ...mapActions('stripe-external-account', {addExternal: 'create', updateExternal: 'update'}),
      getStripeAccount() {
        return this.getAccount(this.account.id);
      },
      newExternalAccount(val) {
        let query = {account: this.account.id};
        console.log('val 1', val);
        if (val.bank_account && !this.bankAccounts.length) {
          query.default_for_currency = true;
        } else {
          query.default_for_currency = true;
          console.log('iuts hitting the seconds one');
        }
        console.log('account', this.account);
        console.log('add card', val);
        // let payload = {card: {...val, currency: 'usd'}}
        this.addExternal([val, {query: query}])
          .then(res => {
            console.log('StripeDetails >> newCard >> this.addcard >> then >> res', res);
            console.log('StripeDetails >> newCard >> this.addcard >> then >> res', res);
          })
          .catch(err => {
            console.log('StripeDetails >> newCard >> this.addcard >> catch >> err', err);
          });
      },
      toggle(val) {
        this[val] = !this[val];
      },
      update(val) {
        console.log('this is the business profile test', val);
        let query = {vendor: this.vendorContext._id};
        this.updateAccount([this.stripeAccount.id, val, {query}])
          .then(() => {
            this.getStripeAccount();
          });
        console.log('it worked');
      },
      defaultCurr(val) {
        console.log('val', val);
        let payload = val.details;
        let query = {account: this.stripeAccount.id};
        this.updateExternal([val.id, payload, {query}])
          .then(() => {
            this.getStripeAccount();
          });
      },
      test(){
        console.log('this is the object', this.stripeAccount);
      }
    }
  };
</script>

<style scoped lang="scss">
  #StripeDetails {
    width: 75vw;

    .details {
      padding: 4px;

      &__section {
        border: 1px solid grey;
        margin: 25px 0;
      }
    }
  }
</style>
