<template>
  <div class="q-my-sm">
    <currency-picker
      flat
      :size-in="sizeIn"
      color="secondary"
      :value="value"
      @input="newInput"
      emit-value
      multiple
    ></currency-picker>
    <div v-if="value" class="text-xxxs text-xxxs text-weight-light">
      Click to see exchange rate vs {{ $getCurrencyName(currencyIn) }}
    </div>


    <div v-if="value" class="row q-px-sm q-pb-sm items-center">
      <div v-for="(curr, i) in value" :key="`curr-${i}`">
        <q-btn size="sm" @click="setExchangeRates(curr)" color="dark" class="q-ma-xs" dense flat icon-right="mdi-menu-down"
                        :icon="$getCurrencyIcon(curr)">
          <q-menu>
            <q-card>
              <q-list dense separator>
                <q-item dense>
                  <q-item-section avatar>
                    <q-icon color="secondary"
                            :name="$getCurrencyIcon(currencyIn)"></q-icon>
                  </q-item-section>
                  <q-item-section>
                    <div class="text-xxs text-mb-xxs text-weight-light">
                      {{
                        $dollarString(getConversion(currencyIn, 100), '', 2)
                      }}
                      {{ $getCurrencyName(currencyIn) }}
                    </div>
                  </q-item-section>
                </q-item>
                <q-item dense>
                  <q-item-section avatar>
                    <q-icon color="primary" :name="$getCurrencyIcon(curr)"></q-icon>
                  </q-item-section>
                  <q-item-section>
                    <div class="text-xxs text-mb-xxs text-weight-medium">is
                      {{ $dollarString(getConversion(curr, 100), '', 2) }}
                      {{ $getCurrencyName(curr) }}
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </q-menu>
        </q-btn>
        <q-separator vertical v-if="i < value.length - 1"></q-separator>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import CurrencyPicker from 'components/common/atoms/pickers/CurrencyPicker';
  import axios from 'axios';

  export default {
    mixins: [],
    components: { CurrencyPicker },
    props: {
      sizeIn: String,
      currencyIn: { type: String, default: 'usd' },
      value: Array,
      emitValue: Boolean,
      optionsIn: Array
    },
    data() {
      return {
        rates: {},
        selected: [],
        optionValue: false
      };
    },
    computed: {
      ...mapState('currency', { national_currencies: 'national_currencies' }),
      options() {
        return this.optionsIn ? this.optionsIn : this.national_currencies.map(a => a.value);
      },
      axiosFeathers() {
        return axios.create({
          baseURL: process.env.VUE_APP_FEATHERS_URL,
          headers: {
            ContentType: 'application/x-www-form-urlencoded',
            Accept: 'application/json',
            // Authorization: 'Bearer ' + this.$store.state.auth.accessToken
          }
        });
      }
    },
    methods: {
      newInput(val) {
        console.log('new input', val);
        this.$emit('input', val);
      },
      getConversion(curr, amt) {
        console.log('gget cconver', curr, amt);
        let multiple = 1;
        let source = this.lget(this.rates, 'source', 'z');
        if (source) {
          // console.log('get conversion', source, curr, amt, this.rates, this.lget(this.rates, ['data', (source + curr).toUpperCase()]))
          if (curr.toUpperCase() !== source.toUpperCase()) {
            multiple = this.lget(this.rates, ['data', (source + curr).toUpperCase()]);
          }
          console.log('return multiple', amt, multiple);
          return amt * multiple;
        } else return 100;
      },
      async setExchangeRates(val) {
        let currency = val ? val : 'usd';
        if (this.lget(this.rates, 'source', '*') !== currency.toUpperCase()) {
          if (val) {
            await this.axiosFeathers.post('currency-exchange', {
              base: currency,
              symbols: []
            })
              .then(res => {
                console.log('currency rates', res);
                this.rates = res.data;
              })
              .catch(err => {
                console.log('currency load error', err);
                this.$quickNotify(err.message);
              });
          }
        }
      },
    }
  };
</script>

<style scoped>

</style>
