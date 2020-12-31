<template>
  <div class="rules_row q-py-lg">
    <div
      :style="{fontSize: fontSize + 'px', width: width + 'px', alignSelf: stack ? 'start' : 'center', height: '100%'}">
      <q-select placeholder="No Repeat"
                dense
                @change="newRule"
                v-model="returnRule"
                :options="repeatFrequencies"
                option-label="name"
                filled>
      </q-select>
    </div>

    <!--      DAILY-->

    <div class="btns q-ma-md">
      <template v-if="returnRule.code === 1">
        <!--        <v-btn v-for="(day, index) in allDays" :key="index" @click="toggleDay(day)" small icon :color="colorDay(day)">-->
        <!--          {{dayDisplay(day)}}-->
        <!--        </v-btn>-->
      </template>

      <!--        WEEKLY-->

      <div v-if="returnRule.code === 2" class="week_mod">
        <div class="text-uppercase text-xxxs text-mb-xxs row items-center">

          <span>Every
            <span class="week_btn" :style="{color: '#1E88E5', fontSize: '1rem', fontWeight: 600, cursor: 'pointer'}"
            >{{weekInterval}}
              <q-menu style="width: 40px">
                <q-card style="max-height: 200px; width: 50px" flat>
                  <q-list>
                    <q-item clickable v-for="num in 12" :key="num" @click="weekInterval = num">
                      <q-item-section>
                        <q-item-label>{{num}}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </q-menu>
            </span>

            {{monthInterval > 1 ? 'months' : 'month'}}&nbsp; on
          </span>
        </div>

        <div style="display: flex" class="q-px-md">
          <q-btn v-for="(day, index) in allDays" :key="index" @click="toggleWeekday(day)" size="sm" round flat
                 :style="{ color: colorWeekday(day) }">
            {{dayDisplay(day)}}
          </q-btn>
        </div>
      </div>

      <!--        MONTHLY-->

      <div v-if="returnRule.code === 3" class="week_mod">
        <div class="text-uppercase text-xxxs text-mb-xxs row items-center">

          <span>Every
            <span class="week_btn" :style="{color: '#1E88E5', fontSize: '1rem', fontWeight: 600, cursor: 'pointer'}"
                 >{{monthInterval}}
              <q-menu style="width: 40px">
                <q-card style="max-height: 200px; width: 50px" flat>
                  <q-list>
                    <q-item clickable v-for="num in 12" :key="num" @click="monthInterval = num">
                      <q-item-section>
                        <q-item-label>{{num}}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </q-menu>
            </span>
            {{monthInterval > 1 ? 'months' : 'month'}}&nbsp; on
          </span>
        </div>
        <div class="text-uppercase text-xxxs text-mb-xxs row items-center q-px-md" style="color: #1E88E5">
          <div style="display: flex; align-items: center">
            The&nbsp;
            <div class="week_btn" style="color: #1E88E5; text-transform: none">
              <span class="q-px-xs text-xxs text-mb-xs text-weight-bold pointer">{{dayST(monthDay)}}</span>
              <q-menu style="width: 40px">
                <q-card style="max-height: 200px; width: 70px" flat>
                  <q-list>
                    <q-item clickable v-for="day in 28" :key="day" @click="monthDay = day">
                      <q-item-section>
                        <q-item-label>{{dayST(day)}}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable @click="monthDay = 'last'">
                      <q-item-section>
                        <q-item-label>last</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </q-menu>
            </div>
              &nbsp;day of the month
          </div>
        </div>
      </div>
      <!--        ENDS-->

      <template v-if="returnRule && returnRule.code !== 0">
        <!--        <div class="start_end">-->
        <!--          <p>Starting</p>-->
        <!--          <v-btn text class="mt-n4">{{startDisplay(starter)}}</v-btn>-->
        <!--        </div>-->
        <div class="start_end q-px-md">
          <p class="text-xxxs text-mb-xxs">Ending</p>
          <q-icon style="margin-top: -20px; color: #e0e0e0" size="25px" @click="setEnd(starter)" v-if="!end" name="mdi-infinity"/>
          <in-line-date @input="setEnd" :starter="starter" :value="end ? end : ''" v-if="end"
                        :button="true"></in-line-date>
          <q-btn style="position: absolute; bottom: 20px; right: 10px" size="xs" v-if="end" color="red"
                  @click="resetEnd" name="mdi-close"/>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import InLineDate from './inLineDate';

  export default {
    components: {InLineDate},
    props: {
      fontSize: {
        type: Number,
        default: 15
      },
      stack: Boolean,
      width: {
        type: Number,
        default: 150
      },
      starter: {
        type: [String, Date],
        default: function () {
          return new Date();
        }
      }
    },
    data() {
      return {
        weekInterval: 1,
        monthInterval: 1,
        returnRule: null,
        start: {
          date: moment(),
          time: moment().format('h:mm a')
        },
        end: null,
        time: moment().format('h:mm a'),
        daySet: [0, 1, 2, 3, 4, 5, 6],
        weekDay: [moment().format('d')],
        monthDay: moment().format('D'),
        allDays: [0, 1, 2, 3, 4, 5, 6],
      };
    },
    created() {
      this.returnRule = Object.assign({}, this.repeatFrequencies[0]);
    },
    watch: {
      starter: {
        deep: true,
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.start = newVal;
            this.monthDay = moment(newVal.start).format('D');
          }
        }
      }
    },
    computed: {
      yearOut() {
        return moment(this.starter ? this.starter : this.starter).add(1, 'years');
      },
      repeatFrequencies() {
        return [
          {
            name: 'No Repeat',
            code: 0,
            time: null,
            day: null,
            month: null,
            start: this.start,
            end: this.end,
            interval: null
          },
          {
            name: 'Daily',
            code: 1,
            time: this.time,
            day: this.daySet,
            month: null,
            start: this.start,
            end: this.end,
            interval: null
          },
          {
            name: 'Weekly',
            code: 2,
            time: this.time,
            day: this.weekDay,
            month: null,
            start: this.start,
            end: this.end,
            interval: this.weekInterval,
          },
          {
            name: 'Monthly',
            code: 3,
            time: this.time,
            day: this.monthDay,
            month: null,
            start: this.start,
            end: this.end,
            interval: this.monthInterval,
          },
          {
            name: 'Annually',
            code: 4,
            time: this.time,
            day: this.weekDay,
            month: this.month,
            start: this.start,
            end: this.end,
            skip: null,
          },


        ];
      }
    },
    methods: {
      dayST(day) {
        return moment(day, 'D').format('Do');
      },
      newRule() {
        this.$emit('input', this.returnRule);
      },
      resetEnd() {
        this.end = null;
        this.$emit('input', this.returnRule);
      },
      setEnd(value) {
        this.end = value;
        this.$emit('input', this.returnRule);
      },
      toggleDay(day) {
        let idx = this.daySet.indexOf(day);
        this.daySet.includes(day) ? this.daySet.splice(idx, 1) : this.daySet.push(day);
        this.$emit('input', this.returnRule);
      },
      toggleWeekday(day) {
        this.weekDay.includes(day) ? this.weekDay.splice(this.weekDay.indexOf(day), 1) : this.weekDay.push(day);
        this.$emit('input', this.returnRule);
      },
      colorWeekday(day) {
        return this.weekDay.includes(day) ? 'light-blue' : 'grey lighten-1';
      },
      colorDay(day) {
        return this.daySet.includes(day) ? 'light-blue' : 'grey lighten-2';
      },
      startDisplay(day) {
        return moment(day).format('ll');
      },
      dayDisplay(day) {
        return moment(day, 'd').format('dd');
      }
    }
  };
</script>

<style scoped>
  .start_end {
    font-weight: 400;
    font-size: .75rem;
    color: #757575;
    text-transform: uppercase;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding-top: 7px;
    position: relative;
  }

  .rules_row {
    margin-top: -15px;
    display: flex;
    width: 100%;
    align-items: center;
    height: 100%;
    /*border-style: solid;*/
    /*border-width: 1px;*/
    /*border-color: black;*/
  }

  .btns {
    display: flex;
    align-items: flex-start;
    height: 100%;
    /*border-style: solid;*/
    /*border-width: 1px;*/
    /*border-color: black;*/
  }

  .week_btn {
    transform: none;
    height: 30px;
    width: 30px;
    border-radius: 4px;
    color: $dark;
  }

  .week_btn:hover {
    transform: scale(1.1);
  }

  .week_mod {
    margin-left: -10px;
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: center;
  }

</style>
