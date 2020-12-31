<template>
  <q-card flat>
    <q-card-section>
      <div class="row text-xxs text-mb-xs text-weight-light">Bank Accounts
        <q-space/>
        <q-btn size="sm" label="add new" icon="mdi-plus" flat @click="addDialog = true"/>
      </div>
    </q-card-section>
    <template v-if="bankSources && bankSources.length">
      <q-list separator>
        <q-item v-for="(item, i) in bankSources" :key="`item-${i}`">
          <q-item-section side>
            <div class="__mini_card text-0-8">
              <div>...put last 4 bank here</div>
              <div class="text-0-7">bank name:
              </div>
            </div>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{lget(item, 'owner.name', 'No Name')}}</q-item-label>
            <q-item-label caption>{{lget(item, 'status', 'no status')}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round icon="mdi-dots-vertical">
              <q-menu>
                <q-list denses separator>
                  <q-item clickable @click="setupStatus(item)">
                    <q-item-section avatar>
                      <q-icon/>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{'activate'}}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="removeSource(item)">
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
          </q-item-section>
        </q-item>
      </q-list>
    </template>
    <template v-else>
      <div class="text-center row text-italic text-0-9">No payment methods added</div>
    </template>
    <q-dialog v-model="addDialog">
      <q-card flat style="width: 500px; max-width: 90vw">
        <q-card-section>
<!--          <bank-form @saveBank="addBankSource"></bank-form>-->
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  // import BankForm from 'components/stripe/StripeFormTypes/BankForm';

  export default {
    name: 'AccountCards',
    // components: { BankForm },
    props: {},
    data() {
      return {
        addDialog: false
      };
    },
    watch: {
      customerId: {
        immediate: true,
        async handler(newVal, oldVal) {
          if (newVal && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            console.log('got new id', newVal);
            this.loadCustomer(newVal);
          // await this.loadBankSources(newVal)
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters('stripe-customer', { getCustomer: 'get' }),
      person() {
        return this.user;
      },
      customerId() {
        return this.lget(this.person, 'settings.customer.stripe_id', false);
      },
      customer() {
        return null;
      // return this.getCustomer(this.customerId);
      },
      bankSources() {
        let sources = this.lget(this.customer, 'sources.data', null);
        return sources?.length? sources.filter(s => s.object === 'bank_account') : [];
      }
    },
    methods: {
      ...mapActions('stripe-source', { createSource: 'create', loadSources: 'find', removeSource: 'remove' }),
      ...mapActions('stripe-customer', { loadCustomer: 'get', patchCustomer: 'patch' }),
      async addBankSource(bank) {
        let bank_source = {
          customer: this.customerId,
          type: 'ach_debit',
          owner: {
            name: this.lget(bank, 'bank_account.account_holder_name', this.person.name),
            email: this.lget(this.user, 'email')
          },
          ach_debit: {
            account_number: this.lget(bank, 'bank_account.account_number'),
            routing_number: this.lget(bank, 'bank_account.routing_number'),
            bank_name: this.lget(bank, 'bank_account.bank_name', '')
          }
        };
        await this.createSource(bank_source)
          .then(res => {
            this.$q.notify({ message: 'Bank Account Added', color: 'positive' });
            console.log('bank source created', res, bank);
          }).catch(err => {
            this.$errNotify(err.message);
            console.error('error creating bank source', err);
          });
      },
      setupStatus(source) {
        // TODO: change status
        console.log('setup status', source);
      },
      removeSource(source) {
        // TODO: remove source
        console.log('remove source', source);
      },
    // loadBankSources() {
    //   return this.loadSources({
    //     query: {
    //       customer: this.customerId,
    //       type: { $in: ['ach_debit', 'ach_credit_transfer'] }
    //     },
    //     disableSoftDelete: true
    //   })
    // }
    }
  };
</script>

<style scoped lang="scss">
  .__mini_card {
    border-radius: 4px;
    background: #020e26;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 5px;
  }
</style>
