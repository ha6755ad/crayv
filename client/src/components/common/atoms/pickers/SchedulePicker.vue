<template>
  <q-card style="height: 100%; width: 100%" flat :dark="dark">

    <div class="q-pa-md" v-if="!hideBlackout">
      <div class="text-xxs text-mb-xxs text-weight-medium">
        <div class="flex items-center">
          <div>Unavailable Dates</div>
          <q-btn size="sm" dense :color="dark ? 'white' : 'dark'" push icon="mdi-plus" class="q-mx-lg" @click="blackoutDialog = true">
            <q-dialog @close="addingBlackout = defaultBlackout()" v-model="blackoutDialog" :maximized="$q.screen.lt.sm">
              <q-card :dark="dark" class="q-pa-md" style="width: 800px; max-width: 100%">
                <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="blackoutDialog = false"/>

                <div class="text-xs text-mb-xs text-weight-bold q-mb-lg">Choose Date Range</div>

                <inline-picker
                  require-save
                  :dark="dark"
                  v-model="addingBlackout"
                  @input="newBlackout"
                ></inline-picker>

              </q-card>
            </q-dialog>
          </q-btn>
        </div>
      </div>
      <div class="row items-center">
        <template v-for="(range, i) in blackoutList">
          <div class="flex items-center relative-position q-pa-sm" v-if="lget(form, 'blackoutDates[0]')" :key="`date-${i}`">
            <q-chip
              @click="editBlackout(range, i)"
              icon="mdi-calendar"
              dark
              removable
              @remove="form.blackoutDates.splice(i , 1)"
              :label="range.recurrence ? $recurrenceString(range.recurrence) : getDateFormat(range.start, 'MMM-DD h:mm a') + ' - ' + getDateFormat(range.end, 'MMM-DD h:mm a')"
            >
            </q-chip>
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
            <q-separator :dark="dark" v-if="i < intervals.length - 1" vertical></q-separator>
          </div>
        </div>
      </div>
    </div>

    <div class="row no-wrap" style="overflow-x: scroll">

      <!--                DATE HEADER -->

      <div v-for="(day, index) in Object.keys(templateAvailability)" :key="day" class="days">

        <q-btn :label="day" flat/>

        <q-card :dark="dark">
          <q-btn-dropdown icon="mdi-content-copy" size="sm" round flat>
            <q-tooltip>Copy previous day</q-tooltip>
            <q-list dense separator>
              <q-item>
              <q-item-section>
                <q-item-label class="text-weight-bolder">Copy from</q-item-label>
              </q-item-section>
              </q-item>
              <q-item v-for="d in Object.keys(templateAvailability)" :key="d" clickable @click="copy(d, day)">
                <q-item-section>
                  <q-item-label class="text-uppercase">{{ d }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn class="q-mx-sm"
                 :icon="lget(form, ['days', day, 'all']) ? 'mdi-minus-box' : 'mdi-checkbox-marked'"
                 size="sm" @click="selectAll(index)" round flat>
            <q-tooltip>{{
                lget(form, ['days', day, 'all']) ? 'Deselect All' : 'Select All'
              }}
            </q-tooltip>
          </q-btn>

          <!--                                TIMES-->

          <div class="timeList">
            <div class="times" :style="colorTime(day, time) ? {color: 'mediumseagreen'} : ''" v-for="time in times"
                 :key="time" @click="pushTime(time, day)">
              <div class="q-pa-sm">{{ parseDateHour(time) }}</div>
              <q-icon v-if="colorTime(day, time)" name="mdi-checkbox-marked-circle-outline"
                      style="color: mediumseagreen"/>
            </div>
          </div>

        </q-card>
      </div>
    </div>
  </q-card>
</template>

<script>

  import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
  import InlinePicker from 'components/common/atoms/dates/InlinePicker';

  const defaultBlackout = () => {
    return { start: new Date(), end: new Date(), recurrence: undefined };
  };

  export default {
    name: 'SchedulePicker',
    components: { InlinePicker },
    props: {
      dark: Boolean,
      value: Object,
      hideBlackout: Boolean
    },
    mounted() {
      if (!this.value) this.$lset(this.form, 'days', this.templateAvailability);
    },
    data() {
      return {
        blackoutDialog: false,
        addingBlackout: defaultBlackout(),
        interval: 60,
        form: {
          days: {},
          blackoutDates: []
        },
        templateAvailability: {
          sunday: {
            times: [],
          },
          monday: {
            times: [],
          },
          tuesday: {
            times: [],
          },
          wednesday: {
            times: [],
          },
          thursday: {
            times: [],
          },
          friday: {
            times: [],
          },
          saturday: {
            times: []
          }
        }
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            Object.assign(this.form, Object.assign({}, newVal));
          }
        }
      }
    },
    computed: {
      blackoutList() {
        let list = JSON.parse(JSON.stringify(this.lget(this.form, 'blackoutDates', [])));
        return list.sort((a, b) => {
          return a - b;
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
        if (this.lget(this.form, 'days')) {
          return this.lget(this.form, ['days', day, 'times'], []).includes(time) || this.lget(this.form, ['days', day, 'all']);
        } else return false;
      },
      pushTime(time, day, add, loop, save) {
        // eslint-disable-next-line no-console
        console.log('pushtime', time, day, add, save);
        let idx = this.lget(this.form, ['days', day, 'times'], []).indexOf(time);
        if (this.lget(this.form, 'days') && idx > -1) {
          if (!add) {
            this.form.days[day].times.splice(idx, 1);
            if (this.interval === 60 && !loop) {
              this.pushTime(time + 15, day, false, true);
              this.pushTime(time + 30, day, false, true);
              this.pushTime(time + 45, day, false, true, true);
            }
            if (this.interval === 30 && !loop) {
              this.pushTime(time + 15, day, false, true);
              this.pushTime(time - 15, day, false, true, true);
            }
          }
        } else {
          if (!this.lget(this.form, ['days', day])) {
            this.form.days = Object.assign({}, this.templateAvailability);
            this.form.days[day].times.push(time);
          } else if (this.lget(this.form, ['days', day, 'times'])) {
            this.form.days[day].times.push(time);
          } else {
            this.$lset(this.form, ['days', day, 'times'], [time]);
          }
          //handle adding all intervals within the hour when hiding smaller intervals. The 'add' variable is because we don't want to remove sub-intervals if they are already added when adding a larger interval
          if (this.interval === 60 && !loop) {
            this.pushTime(time + 15, day, true, true);
            this.pushTime(time + 30, day, true, true);
            this.pushTime(time + 45, day, true, true, true);
          }
          if (this.interval === 30 && !loop) {
            this.pushTime(time + 15, day, true, true);
            this.pushTime(time - 15, day, true, true, true);
          }
        }
        if (this.interval === 15 || save) this.$emit('input', this.form);

      },
      copy(from, to) {
        this.$lset(this.form, ['days', to, 'times'], this.lget(this.form, ['days', from, 'times']));
        this.$emit('input', this.form);
      },
      newBlackout(val) {

        this.form.blackoutDates.unshift({ start: val.start, end: val.end, recurrence: val.recurrence });
        this.addingBlackout = defaultBlackout();
      },
      editBlackout(val){
        this.addingBlackout = Object.assign({}, val);
        this.blackoutDialog = true;
      },
      selectAll(index) {
        this.$lset(this.form, ['days', index, 'all'], !this.lget(this.form, ['days', index, 'all']));
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
