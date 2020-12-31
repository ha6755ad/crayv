<template>
  <q-card flat>
  <q-form style="width: 100%;" @submit.prevent="save">
                  <span class="text-light q-my-md spanBanner">
          Bank Information
        </span>
    <bank-picker v-model="bank"></bank-picker>
    <q-select class="q-ma-md"
              v-model="external_accounts.country"
              :options="countries"
              outlined
              map-options
              emit-value
              option-value="id"
              option-label="name"
              label="Country"
              :rules="[notEmptyRule]"
    >
      <template v-slot:prepend>
        <q-icon name="flag" class="icon1"/>
      </template>
    </q-select>
    <q-input v-model="external_accounts.account_holder_name"
             class="q-ma-md"
             outlined
             label="Account Holder"
             :rules="[notEmptyRule]"
    >
      <template v-slot:prepend>
        <q-icon name="perm_identity" class="icon2"/>
      </template>
    </q-input>
    <q-input v-model="external_accounts.routing_number"
             hide-bottom-space
             class="q-ma-md"
             outlined
             label="Routing Number"
             :rules="[notEmptyRule]"
    >
      <template v-slot:prepend>
        <q-icon name="receipt" class="icon3"/>
      </template>
    </q-input>

<!--    SEARCH ROUTING NUMBERS-->
    <div style="transform: translateY(-80%)" class="pointer q-px-lg text-0-8 text-italic text-blue-12">See a list of routing numbers for this institution
      <q-menu>
        <q-item>
          <q-input dense v-model="routing_search" label="Search Routing Numbers">
            <template v-slot:prepend>
              <q-icon name="mdi-magnify"/>
            </template>
          </q-input>
        </q-item>
        <q-item v-for="(route, i) in filteredRoutingNumbers" :key="`route-${i}`" clickable @click="external_accounts.routing_number = route">
          <q-item-section :class="`text-${external_accounts.routing_number === route ? 'primary' : 'grey-10'}`">
            <q-item-label>{{route}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-menu>
    </div>
    <q-input v-model="external_accounts.account_number"
             class="q-ma-md"
             outlined
             label="Account Number"
             :rules="[notEmptyRule]"
    >
      <template v-slot:prepend>
        <q-icon name="list_alt" class="icon4"/>
      </template>
    </q-input>

    <div class="row q-px-md text-0-9 text-weight-light">Account Type</div>
    <div class="row items-center">
      <q-radio v-model="external_accounts.account_holder_type" val="individual" label="Personal"/>
      <q-radio v-model="external_accounts.account_holder_type" val="company" label="Business"/>
    </div>

    <div class="row items-center">
    <q-checkbox label="Set as default account?" v-model="external_accounts.default_for_currency" />
    <q-space/>
    <q-btn size="sm" class="q-mr-md" color="indigo" type="submit">Save & Continue</q-btn>
    </div>
  </q-form>
  </q-card>
</template>

<script>
  import { mapGetters } from 'vuex';
  import BankPicker from 'components/common/pickers/BankPicker';
  export default {
    name: 'BankForm',
    components: { BankPicker },
    props: {
      countries: {
        type: Array,
        default: function(){
          return [
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
          ];
        }
      }
    },
    mounted(){
      setTimeout(() => {
        this.external_accounts.account_holder_name = this.person.name;
      }, 300);
    },
    data() {
      return {
        bank: {},
        routing_search: '',
        routing_numbers: [],
        external_accounts: {
          bank_name: '',
          account_holder_type: 'individual',
          object: 'bank_account',
          currency: 'usd',
          country: 'US',
          account_holder_name: '',
          routing_number: '',
          account_number: '',
          default_for_currency: false
        }
      };
    },
    watch: {
      bank: {
        immediate: true,
        handler(newVal){
          if(newVal && newVal.name){
            this.external_accounts.bank_name = this.$lget(newVal, 'NAME', '');
            let routing = this.$lget(newVal, 'routing_numbers', []);
            if(routing?.length === 1) this.external_accounts.routing_number = routing;
            else if(routing?.length) this.routing_numbers = routing;
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters('people', { getPerson: 'get' }),
      person() {
        return this.$lget(this.user, '_fastjoin.hasPerson', this.getPerson(this.user.hasPerson));
      },
      filteredRoutingNumbers(){
        return this.routing_numbers.filter(a => {
          return a.indexOf(this.routing_search) > -1;
        });
      }
    },
    methods: {
      save() {
        this.$emit('saveBank', {bank_account: this.external_accounts});
      }
    }
  };
</script>

<style scoped>
  .spanBanner {
    color: #162341;
    font-size: 27px;
    padding: 4px;
    white-space: nowrap;
    border-radius: 4px;
    display: flex;
    width: 60%;
    justify-content: center;
  }

  .icon1 {
    color: #D7263D;
  }

  .icon2 {
    color: #F46036;
  }

  .icon3 {
    color: #2D93AD;
  }

  .icon4 {
    color: #1B998B;
  }

  .icon5 {
    color: #C5D86D;
  }
</style>
