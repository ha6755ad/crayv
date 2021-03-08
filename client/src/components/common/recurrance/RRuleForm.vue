<template>
  <q-card :dark="dark" flat class="bg-transparent">

    <div class="row justify-end" v-if="form.FREQ && !ruleSet">
      <q-btn :color="dark ? 'white' : 'dark'" label="save rule" size="sm" flat icon="mdi-content-save" @click="saveRule"/>
    </div>

    <template v-if="ruleSet && !noDisplay">
      <q-card-section>
        <!--        <div class="text-xs text-mb-xs text-weight-medium">{{recurrenceDisplay(form)}}</div>-->
        <div :class="`text-uppercase text-xs text-mb-xs text-italic text-${color}`" :style="outlined ? `padding: 2px 8px; border-radius: 4px; border: solid .4px var(--q-color-${outlineColor}` : ''">
          {{$recurrenceString(form)}}
        </div>
        <div class="row justify-end">
          <q-btn @click="ruleSet = false" color="ir-blue-grey-6" flat icon="mdi-repeat" label="reset"/>
        </div>
      </q-card-section>
    </template>
    <template v-else-if="!ruleSet || noDisplay">
      <!--    FREQUENCY-->
      <q-select :dark="dark" v-model="form.FREQ" label="Frequency" :options="frequency" emit-value dense
                @input="(val) => setDefaults(val)">
        <template v-slot:selected-item="scope">
          <q-chip :dark="dark" :label="getSelectItemLabel(scope.opt, frequency)" removable @remove="clearForm"
                  class="bg-light text-dark"/>
        </template>
      </q-select>

      <!--    INTERVAL-->
      <q-select :dark="dark" dense :options="interval" label="Interval" emit-value v-model="form.INTERVAL">
        <template v-slot:selected-item="scope">
          <q-chip :dark="dark" :label="getSelectItemLabel(scope.opt, interval)" removable @remove="form.INTERVAL = 1"
                  class="bg-light text-dark"/>
        </template>
      </q-select>

      <div class="q-px-md row" v-if="['YEARLY', 'MONTHLY'].includes(form.FREQ)">
        <q-checkbox v-model="byDate" label="By Date (1st, 2nd..)"/>
        <q-checkbox v-model="byDate" label="By Day (MON, TUE..)" :true-value="false" :false-value="true"/>
      </div>

      <!--    BYMONTH-->
      <template v-if="byMonth && byMonth.length">
        <q-select :dark="dark" multiple dense :options="byMonth" label="Month" emit-value v-model="form.BYMONTH">
          <template v-slot:selected-item="scope">
            <q-chip :dark="dark" :label="getSelectItemLabel(scope.opt, byMonth)" removable @remove="scope.removeAtIndex(scope.index)"
                    class="bg-light text-dark"/>
          </template>
        </q-select>
      </template>

      <!--    BYDAY-->
      <template v-if="byDay && byDay.length">
        <q-select :dark="dark" multiple dense :options="byDay" label="Day" emit-value v-model="form.BYDAY">
          <template v-slot:selected-item="scope">
            <q-chip :dark="dark" :label="getSelectItemLabel(scope.opt, byDay)" removable @remove="scope.removeAtIndex(scope.index)"
                    class="bg-light text-dark"/>
          </template>
        </q-select>
      </template>

      <!--    BYMONTHDAY-->
      <template v-if="byMonthDay && byMonthDay.length">
        <q-select :dark="dark" multiple dense :options="byMonthDay" label="Date" emit-value v-model="form.BYMONTHDAY">
          <template v-slot:selected-item="scope">
            <q-chip :dark="dark" :label="getSelectItemLabel(scope.opt, byMonthDay)" removable
                    @remove="scope.removeAtIndex(scope.index)"
                    class="bg-light text-dark"/>
          </template>
        </q-select>
      </template>

      <div class="row" v-if="!setOcc">
        <q-checkbox :dark="dark" label="Set End Date" v-model="setEnd"
                    @input="(val) => val ? form.COUNT = null : form.UNTIL = null"/>
      </div>
      <div class="row" v-if="!setEnd">
        <q-checkbox :dark="dark" label="Limit Occurrences" v-model="setOcc"
                    @input="(val) => val ? form.UNTIL = null : form.COUNT = null"/>
      </div>
      <template v-if="setEnd">
        <div class="q-ma-sm">
          <div class="text-xxs text-mb-xxs text-weight-light">End Date</div>
          <div class="row"></div>
          <div class="row">
            <q-btn flat icon="mdi-calendar"
                   :label="form.UNTIL ? getDateFormat(form.UNTIL, 'MM/DD/YYYY') : 'choose date'">
              <q-popup-proxy>
                <q-date v-model="form.UNTIL"/>
              </q-popup-proxy>
            </q-btn>
            <q-btn round flat icon="mdi-close" @click="form.UNTIL = null"/>
          </div>
        </div>
      </template>

      <template v-if="setOcc">
        <q-input v-if="setOcc" style="width: 200px" outlined type="number" dense label="Enter Limit"
                 v-model.number="form.COUNT"></q-input>
      </template>
    </template>
<!--    <q-btn label="patch" @click="setRul"/>-->
  </q-card>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {date} from 'quasar';
  // eslint-disable-next-line no-unused-vars

  const { daysInMonth, adjustDate, formatDate } = date;
  import common from '../../../store/schemas/common';
  const days = [
    { label: 'Monday', value: 'MO' },
    { label: 'Tuesday', value: 'TU' },
    { label: 'Wednesday', value: 'WE' },
    { label: 'Thursday', value: 'TH' },
    { label: 'Friday', value: 'FR' },
    { label: 'Saturday', value: 'SA' },
    { label: 'Sunday', value: 'SU' }
  ];

  const months = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ];

  export default {
    name: 'RRuleForm',
    props: {
      color: {
        type: String,
        default: 'dark'
      },
      outlineColor: {
        type: String,
        default: 'dark'
      },
      dark: Boolean,
      outlined: Boolean,
      noDisplay: Boolean,
      value: Object,
      // TO FILTER AVAILABLE FREQUENCIES
      frequencies: {
        type: Array,
        default: () => {
          return ['YEARLY', 'MONTHLY', 'WEEKLY', 'DAILY', 'HOURLY'];
        }
      }
    },
    mounted() {
      if (!this.value) this.form = Object.assign({}, common.RRULE);
    },
    data() {
      return {
        ruleSet: false,
        setOcc: false,
        setEnd: false,
        byDate: true,
        form: {}
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal) {
          if (newVal && newVal.FREQ) {
            this.ruleSet = true;
            this.form = Object.assign({}, { ...common.RRULE, ...this.value });
          }
        }
      }
    },
    computed: {
      ...mapGetters('communities', { getCommunity: 'get' }),
      community() {
        return this.$route.params.id ? this.getCommunity(this.$route.params.id) : null;
      },
      months() {
        return months;
      },
      byMonthNames() {
        if (this.form.BYMONTH) {
          let str = '';
          this.form.BYMONTH.forEach((a, i) => {
            if (i < this.form.BYMONTH.length - 1) str += months[a - 1].label + ' & ';
            else str += months[a - 1].label;
          });
          return str;
        } else return '';
      },
      frequency() {
        return [
          {
            label: 'Yearly',
            value: 'YEARLY',
            per: 'year',
            intCount: 10
          },
          {
            label: 'Monthly',
            value: 'MONTHLY',
            per: 'month',
            intCount: 23
          },
          {
            label: 'Weekly',
            value: 'WEEKLY',
            per: 'week',
            intCount: 26
          },
          {
            label: 'Daily',
            value: 'DAILY',
            per: 'day',
            intCount: 30
          },
          {
            label: 'Hourly',
            value: 'HOURLY',
            per: 'hour',
            intCount: 23
          },
          {
            label: 'Minutely',
            value: 'MINUTELY',
            per: 'minute',
            intCount: 59
          }
        ].filter(a => this.frequencies.includes(a.value));
      },
      currFrequency() {
        let rule = this.frequency.filter(a => a.value === this.form.FREQ);
        if (rule) return rule[0];
        else return null;
      },
      interval() {
        if (this.currFrequency) {
          let list = [{ label: 'every ' + this.currFrequency.per, value: 1 }];
          for (let i = 2; i <= this.currFrequency.intCount; i++) {
            list.push({ label: `every ${this.ordinalSuffixOf(i)} ${this.currFrequency.per}`, value: i });
          }
          return list;
        } else return [];
      },
      byMonth() {
        if (this.form.FREQ === 'YEARLY') {
          return months;
        } else return [];
      },
      byMonthDay() {
        if (this.byDate && ['MONTHLY', 'YEARLY'].includes(this.form.FREQ) && (this.form.BYMONTH || this.form.FREQ === 'MONTHLY')) {
          let list = [];
          let DIM = 31;
          if (this.form.BYMONTH && this.form.BYMONTH.length) {
            this.form.BYMONTH.forEach(m => {
              DIM = Math.min(daysInMonth(adjustDate(new Date(), { month: m })), DIM);
            });

          }
          for (let i = 1; i < DIM; i++) {
            list.push({ label: this.ordinalSuffixOf(i) + ' day', value: i });
          }
          return list;
        } else return [];
      },
      byDay() {
        if (this.form.FREQ === 'WEEKLY') {
          return days;
        } else if ((this.form.BYMONTH || this.form.FREQ === 'MONTHLY') && !this.byDate) {
          let list = [];
          for (let i = 0; i < days.length; i++) {
            list.push({ label: this.ordinalSuffixOf(1) + ' ' + days[i].label, value: '1' + days[i].value });
            list.push({ label: this.ordinalSuffixOf(2) + ' ' + days[i].label, value: '2' + days[i].value });
            list.push({ label: this.ordinalSuffixOf(3) + ' ' + days[i].label, value: '3' + days[i].value });
            list.push({ label: this.ordinalSuffixOf(4) + ' ' + days[i].label, value: '4' + days[i].value });
            list.push({ label: this.ordinalSuffixOf(5) + ' ' + days[i].label, value: '5' + days[i].value });
            list.push({ label: 'Last ' + days[i].label, value: '-1' + days[i].value });
          }
          return list;
        } else return [];
      }
    },
    methods: {
      setRul() {
        let r = this.form;
        let c = this.community.clone();
        c.governance.votingRules.recurrence = r;
        c.save()
          .then(res => console.log('res', res));
      },
      recurrenceDisplay(rule) {
        let str = `Set to repeat ${this.getSelectItemLabel(rule.FREQ, this.frequency)} \xB7 ${this.getSelectItemLabel(rule.INTERVAL, this.interval)} \xB7 ${rule.BYMONTH ? 'in ' + this.byMonthNames : ''} \xB7 on ${rule.BYMONTHDAY ? 'the ' + this.displayDayList(rule.BYMONTHDAY, this.byMonthDay) : rule.BYDAY ? this.displayDayList(rule.BYDAY, this.byDay) : ''}`;
        this.$emit('display', str);
        return str;
      },
      displayDayList(names, dataSet) {
        let list = names;
        // console.log('displayDayList', names, dataSet);
        let str = '';
        list.forEach((a, i) => {
          // console.log('got a', a, this.getSelectItemLabel(a, dataSet));
          if (i < list.length - 1) str += this.getSelectItemLabel(a, dataSet) + ' & ';
          else str += this.getSelectItemLabel(a, dataSet);
        });
        // console.log('dayliststr', str);
        return str;
      },
      saveRule() {
        console.log('saving rule', this.form);
        this.ruleSet = true;
        this.$emit('display', this.recurrenceDisplay(this.form));
        this.$emit('input', this.form);
        this.$q.notify({ message: 'Rule Set', color: 'positive', icon: 'mdi-repeat' });
      },
      clearForm() {
        // console.log('claring form', this.form, common.RRULE);
        this.form = Object.assign({}, common.RRULE);
        this.$emit('input', null);
      },
      setDefaults(freq) {
        let today = new Date();
        this.form.INTERVAL = 1;
        this.byDate = true;
        if (freq === 'YEARLY') {
          this.form.BYMINUTE = [];
          this.form.BYHOUR = [];
          this.form.BYDAY = [];
          this.form.BYMONTH = [Number(formatDate(today, 'M'))];
          this.form.BYMONTHDAY = [Number(formatDate(today, 'D'))];
        } else if (freq === 'MONTHLY') {
          this.form.BYYEARDAY = [];
          this.form.BYMINUTE = [];
          this.form.BYHOUR = [];
          this.form.BYDAY = [];
          this.form.BYMONTH = [];
          this.form.BYMONTHDAY = [Number(formatDate(today, 'D'))];
        } else if (freq === 'WEEKLY') {
          this.form.BYYEARDAY = [];
          this.form.BYMINUTE = [];
          this.form.BYHOUR = [];
          this.form.BYMONTH = [];
          this.form.BYMONTHDAY = [];
          this.form.BYDAY = [(formatDate(today, 'dd').toUpperCase())];
        } else if (freq === 'DAILY') {
          this.form.BYYEARDAY = [];
          this.form.BYHOUR = [(formatDate(today, 'h'))];
          this.form.BYMONTH = [];
          this.form.BYMONTHDAY = [];
          this.form.BYDAY = [];
          this.form.BYMINUTE = [];
        } else if (freq === 'MINUTELY') {
          this.form.BYYEARDAY = [];
          this.form.BYHOUR = [];
          this.form.BYMONTH = [];
          this.form.BYMONTHDAY = [];
          this.form.BYDAY = [];
          this.form.BYMINUTE = [1];
          this.form.INTERVAL = 30;
        }
      }
    }
  };
</script>
