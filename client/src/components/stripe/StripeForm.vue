<template>
  <div style="width: 100%;border-radius: 15px;" class="bg-indigo-7 flex justify-center items-center">
    <div style="width: 100%;display: flex; justify-content: center;align-items: center;">
      <q-stepper
        v-model="step"
        vertical
        color="indigo"
        animated
        style="width: 95%;border-radius: 15px;"
      >
        <q-step
          :name="1"
          title="Step 1"
          caption="Select Business Type"
          icon="settings"
          color="indigo"
          :done="step > 1"
          done-icon="check"
          done-color="green"
        >
               <span class="text-light q-my-md spanBanner">
          Business Type
        </span>
          <q-form @submit="saveStepOne">
            <q-input
              clearable
              :rules="[notEmptyRule, emailRule]"
              outlined
              class="q-ma-md"
              v-model="account.email"
              label="Email">
              <template v-slot:prepend>
                <q-icon name="email" class="icon1"/>
              </template>
            </q-input>
            <q-select
              clearable
              :rules="[notEmptyRule]"
              class="q-ma-md"
              v-model="account.country"
              :options="countries"
              outlined
              map-options
              emit-value
              option-value="id"
              option-label="name"
              label="Country">
              <template v-slot:prepend>
                <q-icon name="flag" class="icon2"/>
              </template>
            </q-select>
            <q-select
              clearable
              :rules="[notEmptyRule]"
              class="q-ma-md"
              outlined
              map-options
              emit-value
              option-value="id"
              option-label="name"
              :options="business_type"
              v-model="account.business_type"
              label="Business Type">
              <template v-slot:prepend>
                <q-icon name="store" class="icon3"/>
              </template>
            </q-select>
            <span class="text-light q-my-md spanBanner">
                    Terms of Service
              </span>
            <q-card-section>
              <q-checkbox color="blue" v-model="tos"/>
              <span style="font-size: 1.05rem;">By registering your account, you agree to our <a
                style="text-decoration: none;color: blue;font-weight: bold;" target="blank"
                href="https://stripe.com/legal">Services Agreement</a> and the <a
                style="text-decoration: none;color: blue;font-weight: bold;" target="blank"
                href="https://stripe.com/connect-account/legal">Stripe Connected Account Agreement</a>.</span>
            </q-card-section>
            <q-btn :disable="!tos" type="submit" color="indigo" label="Save & Continue"/>
          </q-form>
        </q-step>
        <q-step
          :name="2"
          title="Step 2"
          caption="Business Profile"
          icon="create_new_folder"
          :done="step > 2"
          color="red"
          active-color="indigo"
          done-icon="check"
          done-color="green"
        >
          <BusinessProfile :states="states" :countries="countries" @save="saveStep"/>
        </q-step>
        <q-step
          :name="3"
          title="Step 3"
          caption="Basic Information"
          icon="create_new_folder"
          :done="step > 3"
          color="red"
          active-color="indigo"
          done-icon="check"
          done-color="green"
        >
          <Individual @save="saveStep" :states="states" :countries="countries"
                      v-if="account.business_type === 'individual'"/>
          <Business @save="saveStep" :states="states"
                    :countries="countries"
                    v-if="account.business_type !== 'individual'"/>
        </q-step>
        <q-step
          :name="4"
          title="Step 4"
          :done="step > 4"
          caption="Banking Information"
          icon="account_balance"
          color="red"
          active-color="indigo"
          done-icon="check"
          done-color="green"
        >
          <BankForm @saveBank="newBank" :countries="countries"/>
        </q-step>
        <q-step
          :name="5"
          title="Step 5"
          caption="Completed"
          icon="history_edu"
          color="red"
          active-color="indigo"
          done-icon="check"
          done-color="green"
        >
          <div>You're Done!!!</div>
          <q-btn @click.stop="$emit('close', stepAccount)">Close</q-btn>
        </q-step>
      </q-stepper>
    </div>
  </div>
</template>

<script>
  import Individual from './StripeFormTypes/Individual';
  import Business from './StripeFormTypes/Business';
  import BankForm from './StripeFormTypes/BankForm';
  import BusinessProfile from 'components/stripe/StripeFormTypes/BusinessProfile';

  export default {
    name: 'StripeForm',
    components: {Individual, Business, BankForm, BusinessProfile},
    props: {
      stepAccount: Object
    },
    data() {
      return {
        loading: false,
        tos: false,
        step: 1,
        account: {
          type: 'custom',
          country: '',
          business_type: '',
          email: '',
          requested_capabilities: ['card_payments', 'transfers'],
          tos_acceptance: {
            date: Math.floor(Date.now() / 1000),
            ip: null
          },
        },
        externalAccounts: {},
        business_type: [
          {
            name: 'Individual and sole proprietorships',
            id: 'individual'
          },
          {
            name: 'Company',
            id: 'company'
          },
          {
            name: 'Nonprofit Organization',
            id: 'non_profit'
          },
          {
            name: 'Government Entity (US only)',
            id: 'government_entity'
          }
        ],
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
        states: [
          {
            'name': 'Alabama',
            'id': 'AL'
          },
          {
            'name': 'Alaska',
            'id': 'AK'
          },
          {
            'name': 'American Samoa',
            'id': 'AS'
          },
          {
            'name': 'Arizona',
            'id': 'AZ'
          },
          {
            'name': 'Arkansas',
            'id': 'AR'
          },
          {
            'name': 'California',
            'id': 'CA'
          },
          {
            'name': 'Colorado',
            'id': 'CO'
          },
          {
            'name': 'Connecticut',
            'id': 'CT'
          },
          {
            'name': 'Delaware',
            'id': 'DE'
          },
          {
            'name': 'District Of Columbia',
            'id': 'DC'
          },
          {
            'name': 'Federated States Of Micronesia',
            'id': 'FM'
          },
          {
            'name': 'Florida',
            'id': 'FL'
          },
          {
            'name': 'Georgia',
            'id': 'GA'
          },
          {
            'name': 'Guam',
            'id': 'GU'
          },
          {
            'name': 'Hawaii',
            'id': 'HI'
          },
          {
            'name': 'Idaho',
            'id': 'ID'
          },
          {
            'name': 'Illinois',
            'id': 'IL'
          },
          {
            'name': 'Indiana',
            'id': 'IN'
          },
          {
            'name': 'Iowa',
            'id': 'IA'
          },
          {
            'name': 'Kansas',
            'id': 'KS'
          },
          {
            'name': 'Kentucky',
            'id': 'KY'
          },
          {
            'name': 'Louisiana',
            'id': 'LA'
          },
          {
            'name': 'Maine',
            'id': 'ME'
          },
          {
            'name': 'Marshall Islands',
            'id': 'MH'
          },
          {
            'name': 'Maryland',
            'id': 'MD'
          },
          {
            'name': 'Massachusetts',
            'id': 'MA'
          },
          {
            'name': 'Michigan',
            'id': 'MI'
          },
          {
            'name': 'Minnesota',
            'id': 'MN'
          },
          {
            'name': 'Mississippi',
            'id': 'MS'
          },
          {
            'name': 'Missouri',
            'id': 'MO'
          },
          {
            'name': 'Montana',
            'id': 'MT'
          },
          {
            'name': 'Nebraska',
            'id': 'NE'
          },
          {
            'name': 'Nevada',
            'id': 'NV'
          },
          {
            'name': 'New Hampshire',
            'id': 'NH'
          },
          {
            'name': 'New Jersey',
            'id': 'NJ'
          },
          {
            'name': 'New Mexico',
            'id': 'NM'
          },
          {
            'name': 'New York',
            'id': 'NY'
          },
          {
            'name': 'North Carolina',
            'id': 'NC'
          },
          {
            'name': 'North Dakota',
            'id': 'ND'
          },
          {
            'name': 'Northern Mariana Islands',
            'id': 'MP'
          },
          {
            'name': 'Ohio',
            'id': 'OH'
          },
          {
            'name': 'Oklahoma',
            'id': 'OK'
          },
          {
            'name': 'Oregon',
            'id': 'OR'
          },
          {
            'name': 'Palau',
            'id': 'PW'
          },
          {
            'name': 'Pennsylvania',
            'id': 'PA'
          },
          {
            'name': 'Puerto Rico',
            'id': 'PR'
          },
          {
            'name': 'Rhode Island',
            'id': 'RI'
          },
          {
            'name': 'South Carolina',
            'id': 'SC'
          },
          {
            'name': 'South Dakota',
            'id': 'SD'
          },
          {
            'name': 'Tennessee',
            'id': 'TN'
          },
          {
            'name': 'Texas',
            'id': 'TX'
          },
          {
            'name': 'Utah',
            'id': 'UT'
          },
          {
            'name': 'Vermont',
            'id': 'VT'
          },
          {
            'name': 'Virgin Islands',
            'id': 'VI'
          },
          {
            'name': 'Virginia',
            'id': 'VA'
          },
          {
            'name': 'Washington',
            'id': 'WA'
          },
          {
            'name': 'West Virginia',
            'id': 'WV'
          },
          {
            'name': 'Wisconsin',
            'id': 'WI'
          },
          {
            'name': 'Wyoming',
            'id': 'WY'
          }
        ]
      };
    },
    watch: {
      stepAccount: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (!this.$lisEmpty(newVal)) {
            console.log('in watcher', newVal);
            this.account.business_type = newVal.business_type;
            if (newVal.completedStepsCount === '4') {
              this.step = 5;
            } else {
              this.step = Number(newVal.completedStepsCount) + 1;
            }
            this.account = newVal;
            console.log('this.account.business_type', this.account.business_type);
            console.log('this.step', this.step);
          }
        }
      }
    },
    computed: {
      accountId() {
        if (this.stepAccount && this.stepAccount.id) {
          return this.stepAccount.id;
        } else {
          return undefined;
        }
      }
    },
    methods: {
      saveStepOne() {
        this.$emit('save', {account: this.account, completedStep: '1'});
        this.step = 2;
      },
      saveStep(val) {
        if (this.accountId) {
          this.$emit('update', {id: this.accountId, details: val, completedStep: String(this.step)});
          this.step++;
        } else {
          console.error('StripeForm >> methods >> saveStepTwo >> if >> else >> no id', {
            error: 'NO ID',
            message: 'There is no id to update on'
          });
        }
      },
      newBank(val) {
        if (this.accountId) {
          this.$emit('saveBank', {id: this.accountId, details: val, completedStep: String(this.step)});
          this.step++;
        } else {
          console.error('StripeForm >> methods >> saveStepTwo >> if >> else >> no id', {
            error: 'NO ID',
            message: 'There is no id to update on'
          });
        }
      }
    }
  };
</script>

<style scoped>
  .spanBanner {
    background: #C490D1;
    font-size: 27px;
    border-radius: 8px;
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
