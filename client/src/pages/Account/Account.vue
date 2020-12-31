<template>
  <div>
    <q-btn label="patchy" @click="patchy"/>
    <template>
      <q-card flat style="height: 100%; width: 100%">
        <q-card-section>
          <div class=" row text-sm text-mb-sm text-weight-light">Vendor Account
            <q-space/>
          </div>
          <q-btn @click="toggleDialog(null, 'account')">
            Create a Business Account
          </q-btn>
          <q-dialog v-model="account" @hide="toCompleteAccount = {}">
            <StripeForm @save="createAccount"
                        :stepAccount="toCompleteAccount"
                        @update="patchAccount"
                        @saveBank="createBankAccount"
                        @close="val => {this.toggleDialog(val,'account')}"

            />
          </q-dialog>
        </q-card-section>
        <q-separator/>
      </q-card>
    </template>
    <template v-if="vendor.stripe">
      <q-card class="row">
        <q-card-section v-for="account in stripeAccounts" :key="`parent${account.id}`" class="col-5">
          <div :key="`child${account.id}`" class="flex">
            Stripe Account:
            <span v-if="Number(account.completedStepsCount) === 4"
                  class="q-mx-md">{{account.id}}</span>
            <span v-else class="q-mx-md">Account Not Complete</span>
            <div v-if="Number(account.completedStepsCount) === 4" class="q-mx-md">
                <q-icon class="q-mr-xs icon icon__edit" size="1.2rem" name="edit" @click.stop="toggleDialog(account, 'stripeDetailsDialog')"></q-icon>
                <q-icon class="q-ml-xs icon icon__delete" size="1.2rem" name="delete" @click.stop="toggleDialog(account, 'removeAccountDialog')"></q-icon>
            </div>
          </div>
          <div v-if="Number(account.completedStepsCount) < 4">
            Steps left to complete:
            <span class="q-mx-sm">{{4 - Number(account.completedStepsCount)}}</span>
            <q-btn flat @click="finishSteps(account)">Finish</q-btn>
          </div>
        </q-card-section>
      </q-card>
      <q-dialog v-model="stripeDetailsDialog" maximized>
        <stripe-details :account="selectedStripeAccount"/>
      </q-dialog>
    </template>
  </div>
</template>

<script>
  import {mapState, mapGetters, mapActions} from 'vuex';
  import StripeForm from '../../components/stripe/StripeForm';
  import StripeDetails from '../../components/stripe/StripeDetails/StripeDetails';

  export default {
    name: 'Organization',
    components: {StripeDetails, StripeForm},
    data() {
      return {
        account: false,
        vendor: {},
        stripeDetailsDialog: false,
        selectedStripeAccount: {},
        toCompleteAccount: {},
        stripeAccounts: []

      };
    },
    mounted() {
      console.log('vendorContext', this.vendorContext);
      console.log('stripeAccounts', this.stripeAccounts);
    },
    watch: {
      vendorContext: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.vendor = this.vendorContext;
            this.stripeAccounts = this.vendor?.stripe?.accounts;
            this.toCompleteAccount = {};
            this.selectedStripeAccount = {};
          }
        }
      },
    },
    computed: {
      ...mapState('auth', {user: 'user'}),
      ...mapState({vendorContext: 'vendorContext'}),
      ...mapGetters('crayv-vendors', {findVendors: 'find'}),
      ...mapGetters('people', {getPerson: 'get'}),
      // person(){
      //   return this.getPerson(this.user.hasPerson.personId)
      // },
      stateVendors() {
        return this.findVendors({
          // query: {
          //   owner: this.person._id
          // }
        }).data;
      }
    },
    methods: {
      ...mapActions('stripe-account', {
        addAccount: 'create',
        updateAccount: 'update'
      }),
      ...mapActions('stripe-account', {getAccount: 'get'}),
      ...mapActions('vendor', {getVendor: 'get'}),
      ...mapActions('stripe-external-account', {addBank: 'create'}),
      ...mapActions('crayv-vendors', {getVendor: 'get'}),
      patchy(){
        this.stateVendors.forEach(v => {
          if(v.name === 'Fat Cats'){
            let ve = v.clone();
            ve.stripe.accounts = [];
            ve.save();
          }
        });
      },
      createAccount(val) {
        this.addAccount([val.account, {query: {vendor: this.vendor._id, steps: val.completedStep}}])
          .then(res => {
            console.log('going to get vendor again', this.vendor._id);
            this.getVendor(this.vendor._id)
              .then((vendor) => {
                console.log('this.vendor res', vendor);
                console.log('addAccount res', res);
                console.log('addAccount res', res.id);
                console.log('vendor.stripe.accounts.filter(item => item.id === res.id)[0]',vendor.stripe.accounts.filter(item => item.id === res.id)[0]);
                this.$store.dispatch('setVendorContext', vendor)
                  .then(() => {
                    this.toCompleteAccount.business_type = res.business_type;
                    this.toCompleteAccount = vendor.stripe.accounts.filter(item => item.id === res.id)[0];
                  });
              });
          })
          .catch(err => {
            console.error('addAccount error', err);
          });
      },
      patchAccount(val) {
        this.updateAccount([val.id, val.details, {query: {vendor: this.vendor._id, steps: val.completedStep}}])
          .then(res => {
            console.log('patchAccount res', res);
            if (val.completedStep) {
              this.getVendor(this.vendor._id)
                .then(res => {
                  console.log('this.getvendor res patchAccount', res);
                  this.$store.dispatch('setVendorContext', res);
                  this.toCompleteAccount = this.stripeAccounts.filter(item => item.id === res.id)[0];
                })
                .catch(err => {
                  console.log('Account >> methods >> patchAccount >> this.updateAccount >> then >> this.getVendor >> catch >> err', err);
                });
            }
          })
          .catch(err => {
            console.error('patchAccount error', err);
          });
      },
      createBankAccount(val) {
        let query = {vendor: this.vendor._id, steps: val.completedStep, account: val.id};
        this.addBank([val.details, {query: query}])
          .then(res => {
            console.log('Account >> methods >> createBankAccount >> this.addBank >> then >> res', res);
          })
          .catch(err => {
            console.log('Account >> methods >> createBankAccount >> this.addBank >> catch >> err', err);
          });
      },
      finishSteps(account) {
        this.getAccount(account.id)
          .then(res => {
            account.business_type = res.business_type;
            this.toCompleteAccount = account;
            this.toggleDialog(null, 'account');
          });
      },
      toggleDialog(account, dialog) {
        if (account) {
          this.toCompleteAccount = undefined;
          this.selectedStripeAccount = account;
        }
        this[dialog] = !this[dialog];
      }
    }
  };
</script>

<style scoped lang="scss">
  .icon {
    border-radius: 5px;
    padding: 3px;
    &:hover {
      background-color: rgb(240,240,240);
    }
  }
</style>
