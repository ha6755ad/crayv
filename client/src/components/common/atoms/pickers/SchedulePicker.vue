<template>
  <q-card style="height: 100%; width: 100%" flat dark>

    <div class="q-pa-md" v-if="!hideBlackout">
      <div class="text-xxs text-mb-xxs text-weight-medium">
        <div class="flex items-center">
          <div>Unavailable Dates</div>
          <q-btn-dropdown size="sm" flat dense color="white" push icon="mdi-plus" class="q-mx-lg">

            <vue-ctk-date-time-picker
              no-button-now
              :noButton="false"
              inline
              @input="newBlackout"
              only-date
            ></vue-ctk-date-time-picker>

          </q-btn-dropdown>
        </div>
      </div>
      <div class="row items-center">
        <template v-for="(date, i) in blackoutList">
        <div v-if="lget(form, 'blackoutDates[0]')" :key="`date-${i}`">
          <date-chip
            size-in="35px"
            hide-text
            dark
            :value="$buildDate(date)"
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
              <div class="q-pa-sm">{{ time }}</div>
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
  import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
  import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

  export default {
    name: 'SchedulePicker',
    components: { DateChip, VueCtkDateTimePicker },
    props: {
      value: Object,
      hideBlackout: Boolean
    },
    mounted() {
      if (!this.value) this.$lset(this.form, 'days', this.templateAvailability);
    },
    data() {
      return {
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
      blackoutList(){
        return this.lget(this.form, 'blackoutDates', []).sort((a, b) => {
          return this.$buildDate(a) - this.$buildDate(b);
        });
      },
      year(){
        return new Date().getFullYear();
      },
      intervals() {
        return [60, 30, 15, 10, 5];
      },
      times() {
        let list = [];
        for (let i = 0; i < 24; i++) {
          let intervals = this.interval ? 60 / this.interval : 1;
          for (let int = 0; int < intervals; int++) {
            let minutes = int * this.interval;
            i < 20 ? list.push(this.getDateFormat(this.genDateHour((i + 5), minutes), 'h:mm a')) : list.push(this.getDateFormat(this.genDateHour((i - 19), minutes), 'h:mm a'));
          }
        }
        return list;
      },
    },
    methods: {
      colorTime(day, time) {
        if (this.lget(this.form, 'days', []).length > 0) {
          let days = this.lget(this.form, 'days', []).map(a => a.name);
          let idx = days.indexOf(day.name);
          return this.lget(this.form, ['days', idx, 'times'], []).includes(time) || this.lget(this.form, ['days', idx, 'times'], []).includes('*');
        } else return false;
      },
      pushTime(time, index) {
        // eslint-disable-next-line no-console
        // console.log('pushing time', time, index)
        if (this.lget(this.form, 'days', []).length && this.lget(this.form, ['days', index, 'times'], []).includes(time)) {
          this.form.days[index].times.splice(this.lget(this.form, ['days', index, 'times'], []).indexOf(time), 1);
        } else if (this.form && this.form.days) {
          this.lget(this.form, ['days', index, 'times'], []).push(time);
        } else {
          this.$lset(this.form, 'days', this.templateAvailability);
          this.lget(this.form, ['days', index, 'times'], []).push(time);
        }
        this.$emit('input', this.form);
      },
      copyPrev(index) {
        if (this.lget(this.form, 'days', []).length > 0) {
          let ind = index - 1;
          this.$lset(this.form, ['days', index, 'times'], JSON.parse(JSON.stringify(this.lget(this.form, ['days', ind, 'times'], []))));
          this.$emit('input', this.form);
        }
      },
      newBlackout(val) {
        let date = new Date(val);
        let dateObj = { month: parseInt(this.getDateFormat(date, 'MM')), date: parseInt(this.getDateFormat(date, 'DD')) };
        let list = this.lget(this.form, 'blackoutDates', []);
        console.log('blackout', dateObj);
        let idxs = [];
        list.forEach((day, i) => {
          let dayMatch = this.lget(day, 'date') === this.lget(dateObj, 'date');
          let monthMatch = this.lget(day, 'month') === this.lget(dateObj, 'month');
          // TODO: add year workflow for non recurring dates
          if( dayMatch && monthMatch ) idxs.push(i);
        });
        if(idxs && idxs.length) {
          this.$quickNotify(`${dateObj.month}/${dateObj.date} already selected`);
        } else this.form.blackoutDates.unshift(dateObj);
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
