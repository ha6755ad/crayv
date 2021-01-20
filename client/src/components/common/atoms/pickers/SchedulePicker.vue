<template>
  <q-card style="height: 100%; width: 100%" flat dark>

    <div class="q-pa-md" v-if="!hideBlackout">
      <div class="text-xxs text-mb-xxs text-weight-medium">
        <div class="flex items-center">
          <div>Unavailable Dates</div>
          <q-btn-dropdown size="sm" flat dense color="white" push icon="mdi-plus" class="q-mx-lg">

            <q-card dark class="q-pa-md">
              <div class="text-xs text-mb-xs text-weight-bold q-mb-lg">Choose Date Range</div>

              <inline-picker
                require-save
                dark
                v-model="addingBlackout"
                @input="newBlackout"
              ></inline-picker>

            </q-card>
          </q-btn-dropdown>
        </div>
      </div>
      <div class="row items-center">
        <template v-for="(range, i) in blackoutList">
          <div class="flex items-center" v-if="lget(form, 'blackoutDates[0]')" :key="`date-${i}`">
            <date-chip
              size-in="35px"
              hide-text
              dark
              :value="range.start"
            ></date-chip>
            <div class="text-md text-mb-md text-weight-bolder">-</div>
            <date-chip
              size-in="35px"
              hide-text
              dark
              :value="range.end"
              removable
              @remove="form.blackoutDates.splice(i, 1)"
            ></date-chip>
          </div>
        </template>
      </div>
    </div>

    <div class="row justify-end q-mb-md">
      <div>
        <div class="q-pa-sm text-xxs text-mb-xxs text-weight-medium">Show Interval (minutes)</div>
        <div class="row">
          <div class="flex items-center" v-for="(int, i) in intervals" :key="`int-${i}`">
            <q-btn :push="interval === int" :flat="interval !== int" :label="int" @click="interval = int"
                   :color="interval !== int ? 'grey-6' : 'nice'"></q-btn>
            <q-separator dark v-if="i < intervals.length - 1" vertical></q-separator>
          </div>
        </div>
      </div>
    </div>

    <div class="row no-wrap" style="overflow-x: scroll">

      <!--                DATE HEADER -->

      <div v-for="(day, index) in templateAvailability" :key="day.name" class="days">

        <q-btn :label="day.name" flat/>

        <q-card dark>
          <q-btn icon="mdi-content-copy" size="sm" round flat @click="copyPrev(index)">
            <q-tooltip>Copy previous day</q-tooltip>
          </q-btn>
          <q-btn class="q-mx-sm"
                 :icon="lget(form, ['days', index, 'times'], []).includes('*') ? 'mdi-minus-box' : 'mdi-checkbox-marked'"
                 size="sm" @click="selectAll(index)" round flat>
            <q-tooltip>{{
                lget(form, ['days', index, 'times'], []).includes('*') ? 'Deselect All' : 'Select All'
              }}
            </q-tooltip>
          </q-btn>

          <!--                                TIMES-->

          <div class="timeList">
            <div class="times" :style="colorTime(day, time) ? {color: '#a6f5a9'} : ''" v-for="time in times"
                 :key="time" @click="pushTime(time, index)">
              <div class="q-pa-sm">{{ parseDateHour(time) }}</div>
              <q-icon v-if="colorTime(day, time)" name="mdi-checkbox-marked-circle-outline"
                      style="color: #b5f5b7"/>
            </div>
          </div>

        </q-card>
      </div>
    </div>
  </q-card>
</template>

<script>

  import DateChip from 'components/common/atoms/dates/DateChip';
  import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
  import InlinePicker from 'components/common/atoms/dates/InlinePicker';

  const defaultBlackout = () => {
    return { start: new Date(), end: new Date() };
  };

  export default {
    name: 'SchedulePicker',
    components: { InlinePicker, DateChip },
    props: {
      value: Object,
      hideBlackout: Boolean
    },
    mounted() {
      if (!this.value) this.$lset(this.form, 'days', this.templateAvailability);
    },
    data() {
      return {
        addingBlackout: defaultBlackout(),
        interval: 60,
        form: {
          days: [],
          blackoutDates: []
        },
        templateAvailability: [
          {
            name: 'Sunday',
            times: []
          },
          {
            name: 'Monday',
            times: []
          },
          {
            name: 'Tuesday',
            times: []
          },
          {
            name: 'Wednesday',
            times: []
          },
          {
            name: 'Thursday',
            times: []
          },
          {
            name: 'Friday',
            times: []
          },
          {
            name: 'Saturday',
            times: []
          }
        ],
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.form = Object.assign({}, newVal);
          }
        }
      }
    },
    computed: {
      blackoutList() {
        return this.lget(this.form, 'blackoutDates', []).sort((a, b) => {
          return this.$buildDate(a) - this.$buildDate(b);
        });
      },
      year() {
        return new Date().getFullYear();
      },
      intervals() {
        //before changing these, see that pushTime function is using these fixed intervals for logic
        return [60, 30, 15];
      },
      times() {
        let list = [];
        for (let i = 0; i < 24; i++) {
          let intervals = this.interval ? 60 / this.interval : 1;
          for (let int = 0; int < intervals; int++) {
            let minutes = int * this.interval;
            i < 20 ? list.push(parseInt(this.getDateFormat(this.genDateHour((i + 5), minutes), 'Hmm'))) : list.push(parseInt(this.getDateFormat(this.genDateHour((i - 19), minutes), 'Hmm')));
          }
        }
        return list;
      },
    },
    methods: {
      colorTime(day, time) {
        if (this.lget(this.form, 'days[0]')) {
          let days = this.lget(this.form, 'days', []).map(a => a.name);
          let idx = days.indexOf(day.name);
          return this.lget(this.form, ['days', idx, 'times'], []).includes(time) || this.lget(this.form, ['days', idx, 'times'], []).includes('*');
        } else return false;
      },
      pushTime(time, index, add, loop, save) {
        // eslint-disable-next-line no-console
        console.log('pushtime', time, index, add, save);
        let idx = this.lget(this.form, ['days', index, 'times'], []).indexOf(time);
        if (this.lget(this.form, 'days[0]') && idx > -1) {
          if (!add) {
            this.form.days[index].times.splice(idx, 1);
            if (this.interval === 60 && !loop) {
              this.pushTime(time + 15, index, false, true);
              this.pushTime(time + 30, index, false, true);
              this.pushTime(time + 45, index, false, true, true);
            }
            if (this.interval === 30 && !loop) {
              this.pushTime(time + 15, index, false, true);
              this.pushTime(time - 15, index, false, true, true);
            }
          }
        } else {
          if (!this.lget(this.form, 'days[0].name')) {
            this.form.days = JSON.parse(JSON.stringify(this.templateAvailability));
            this.form.days[index].times.push(time);
          } else if (this.lget(this.form, ['days', index, 'times'])) {
            this.form.days[index].times.push(time);
          } else {
            this.$lset(this.form, ['days', index, 'times'], [time]);
          }
          //handle adding all intervals within the hour when hiding smaller intervals. The 'add' variable is because we don't want to remove sub-intervals if they are already added when adding a larger interval
          if (this.interval === 60 && !loop) {
            this.pushTime(time + 15, index, true, true);
            this.pushTime(time + 30, index, true, true);
            this.pushTime(time + 45, index, true, true, true);
          }
          if (this.interval === 30 && !loop) {
            this.pushTime(time + 15, index, true, true);
            this.pushTime(time - 15, index, true, true, true);
          }
        }
        if (this.interval === 15 || save) this.$emit('input', this.form);
        console.log('set time', this.form.days[index].times);

      },
      copyPrev(index) {
        if (this.lget(this.form, 'days', []).length > 0) {
          let ind = index - 1;
          this.$lset(this.form, ['days', index, 'times'], JSON.parse(JSON.stringify(this.lget(this.form, ['days', ind, 'times'], []))));
          this.$emit('input', this.form);
        }
      },
      newBlackout(val) {
        this.form.blackoutDates.unshift(val);
        this.addingBlackout = defaultBlackout();
      },
      selectAll(index) {
        let val = ['*'];
        if (this.lget(this.form, ['days', index, 'times'], []).includes('*')) val = [];
        this.$lset(this.form, ['days', index, 'times'], val);
      }
    }
  };
</script>

<style scoped lang="scss">
  .days {
    width: 14%;
    min-width: 100px;

  }

  .timeList {
    cursor: pointer;
    margin: auto;
    margin-top: 10px;
  }

  .times {
    display: flex;
    justify-content: space-around;
    text-align: center;
    align-items: center;
    border-style: solid;
    border-color: #EEEEEE;
    border-width: 1px;
  }
</style>
