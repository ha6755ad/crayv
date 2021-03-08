<template>
  <q-page>
    <div class="header_col_layout">
      <div></div>

      <div v-for="(day, index) in seven" :key="`day-header-${index}`">
        <div class="day_header q-pb-sm">
          <q-icon @click="subtractWeek" class="clicker_left pointer" v-if="index === 0" name="arrow_left"/>
          <div class="text-xs text-mb-xs" :style="{color: fontColor}">
            {{ dayName(day) }}
          </div>
          <div :class="`text-md text-mb-sm __dayNum ${isSameDate(day, new Date(), 'day') ? 'bg-nice text-white' : ''}`">
            {{ dayNum(day) }}
          </div>
          <q-icon @click="addWeek" class="clicker_right pointer" v-if="index === 6" name="arrow_right"/>
        </div>
      </div>
      <div/>
      <div class="__multi-day" v-for="(day, i) in seven" :key="`multi-${i}`">
        <template>
          <div v-for="(event, index) in multiDayEvents" :key="`multi-occurrence-${index}`">
            <div @click="() => {showDayEvents = true; dayBeingShown = day;}"
                 v-if="getDateFormat(event.start, 'D') <= getDateFormat(day, 'D') && getDateFormat(day, 'D') <= getDateFormat(event.end, 'D') && getDateFormat(day, 'M') === getDateFormat(event.start, 'M') && getDateFormat(day, 'YYYY') === getDateFormat(event.start, 'YYYY')"
                 class="pointer q-ml-xs"
                 style="margin-bottom: 3px; border-radius: 5px;overflow: hidden;"
                 :style="{'font-size': '0.8em','background': event.eventColor.hexa,'height': '15px'}">
              <span class="text-white text-weight-bold q-ml-xs">{{event.name}}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="table_col_layout">
      <div class="row_layout">
        <div v-for="(hour, index) in hourFormat" :key="index" :style="sideTime" class="text-right">
          <!--          hour display-->
          <div
            :style="{position: 'absolute', top: '0', left: '0', color: fontColor, transform: 'translateY(-50%)', whiteSpace: 'nowrap'}"
            class="text-xxxs text-mb-xxxs text-right text-weight-medium q-mt-xs">
            {{ hour }}
          </div>
          <!--        <div :style="sideGap" class="side_gap"></div>-->
        </div>
      </div>
      <div v-for="(day, index) in seven" :key="`day-col-${index}`" class="row_layout">
        <template v-for="hour in hours">
          <div :key="`box-${hour}`" class="box-outline"
               @click.stop="createEvent(day, hour)">
          </div>
          <div v-for="(event, index) in getCalendarItem(getDateFormat(day, 'D'), hour)"
               :key="`calendar-item-${hour + ' ' + index}`"
               :style="{'background': event.eventColor.hexa, 'grid-row': rowStart(hour) + '/ span ' + getRow(event), transform: translate(event), width: '90%', position: 'absolute', zIndex: 20, height: '100%', right: 0}">
            <calendar-item
              :group-in="groupIn"
              :eventIn="event"
              :boxHeight="boxHeight"
              :hour="hour"
              :startHour="lget(hours, [0], 5)"
              @open="openEvent"
              @edit="editEvent(event, index)"
            ></calendar-item>
          </div>
        </template>
      </div>

    </div>
    <q-dialog v-model="showDayEvents">
      <q-card style="border-right: 13px solid #c7c7c7;max-height: 370px;overflow: scroll;">
        <div class="bg-primary flex justify-end" style="width: 340px;">
        <div class="bg-white" style="height: 90%; width: 90%;">
        <q-card-section class="text-weight-light" style="font-size: 16px;">
           <q-icon class="text-secondary" name="event"></q-icon>Multi-Day Events for {{getDateFormat(dayBeingShown, 'MMMM DD')}}
        </q-card-section>
          <div v-for="(event,index) in multiDayEvents" :key="index" style="height: 90%; width: 90%;">
            <div @click="$emit('open', event)" v-if="getDateFormat(event.start, 'D') <= getDateFormat(dayBeingShown, 'D') && getDateFormat(dayBeingShown, 'D') <= getDateFormat(event.end, 'D') && getDateFormat(dayBeingShown, 'M') === getDateFormat(event.start, 'M') && getDateFormat(dayBeingShown, 'M') === getDateFormat(event.start, 'M')" class="q-ma-xs pointer eventItem q-ml-sm" style="width: 95%;height: 30px;display: grid;grid-template-columns: 3fr 4fr 1fr; border-bottom: 1px solid #dadfea;">
              <div class="text-weight-medium" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{event.name}}</div>
              <div>
                <span>{{getDateFormat(event.start, 'h:mm a')}} - {{getDateFormat(event.end, 'h:mm a')}}</span>
              </div>
              <div>
              <q-btn icon="mdi-pencil-box" round flat size="sm" style="color: black;"
                     v-if="isAdmin(groupIn) || lget(eventIn, 'createdBy', '*') === lget(user, '_id', null)"
                     @click.stop="editEvent(event, index)"/>
              </div>
            </div>

        </div>
        </div>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  // import moment from 'moment';
  import CalendarItem from './CalendarItem';


  const {date} = require('quasar');
  // eslint-disable-next-line no-unused-vars
  const {formatDate, subtractFromDate, addToDate, daysInMonth, getDayOfWeek} = date;

  export default {
    name: 'GridWeek',
    components: {CalendarItem},
    props: {
      groupIn: Object,
      bgColor: {
        type: String,
        default: '#ffffff'
      },
      lineColor: {
        type: String,
        default: '#424242'
      },
      boxHeight: {
        type: Number,
        default: 50
      },
      tableHeight: {
        type: Number,
        default: 600
      },
      fontColor: {
        type: String,
        default: '#607D8B'
      },
      dateContext: {
        type: Date,
        required: true
      },
      eventColor: {
        type: String,
        default: 'rgba(24, 255, 255, .5)'
      },
      blockedColor: {
        type: String,
        default: '#B0BEC5'
      },
      // events should come as arrays of objects to be scheduled or blocked as moment objects ex:
      //     [{
      //       name: 'event name',
      //       start: {
      //        date: moment(),
      //        time: moment().format('h:mm a')
      //          },
      //       end: {
      //        date: moment().ad(1, 'hours'),
      //        time: moment().add(1, 'hours').format('h:mm a')
      //          },
      //       color: 'primary'
      //     }]
      // events: {
      //   type: Array,
      //   default: function () {
      //     return []
      //   }
      // },
      eventIn: Object,
      eventsIn: {
        type: Array,
        default: () => {
          return [];
        }
      }
    },
    data() {
      return {
        refDate: new Date(),
        showDayEvents: false,
        dayBeingShown: '',
      };
    },
    watch: {
      dateContext: {
        deep: true,
        immediate: true,
        handler(newVal) {
          console.log('new date', newVal);
          this.getSunday(newVal);
        }
      }
    },
    computed: {
      ...mapState('eventstore', {
      // events: 'events'
      }),
      calLayout() {
        return {
          fontFamily: 'sans-serif',
          // width: 100 / 7 + '%',
          backgroundColor: this.bgColor,
          // borderStyle: 'solid',
          // borderWidth: '1px',
          // borderColor: this.lineColor,
          display: 'grid',
          // flexDirection: 'column',
          position: 'relative',


        };
      },
      sideTime() {
        return {
          height: this.boxHeight + 'px',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          // backgroundColor: this.bgColor,
          justifyContent: 'flex-end',
          position: 'relative',
        };
      },
      sideGap() {
        return {
          marginRight: -this.boxHeight / 12 + 'px',
        // backgroundColor: this.bgColor,
        };
      },
      // check
      seven() {
        let days = [];
        console.log('refdate', this.refDate);
        for (let i = 0; i < 7; i++) {
          let d = addToDate(this.refDate, {days: i});
          // let d = moment(this.refDate).add(i, 'days');

          days.push(d);
        }
        return days;
      },
      hours() {
        let list = [];
        for (let i = 0; i < 24; i++) {
          i < 20 ? list.push(i + 5) : list.push(i - 19);
        }
        return list;
      },
      hourFormat() {
        let list = [];
        for (let i = 0; i < this.hours.length; i++) {
          // list.push(formatDate(this.hours[i], 'h A'));
          list.push(formatDate(date.buildDate({hours: this.hours[i]}), 'h A'));
        // list.push(moment(this.hours[i], 'h').format('h A'));
        }

        return list;
      },
      // check
      year() {
        return formatDate(this.refDate, 'YY');
      // return this.refDate.format('Y');
      },
      // check
      month() {
        return formatDate(this.refDate, 'M');
      // return this.refDate.format('MMMM');
      },
      // check
      numberDaysInMonth() {
        return daysInMonth(this.refDate);
      },
      // check
      currentDate() {
        return Date.now();
      },
      multiDayEvents(){
        let list = [];
        this.eventsIn.forEach(e => {
          let startDay = date.formatDate(e.start, 'd');
          let endDay = date.formatDate(e.end, 'd');
          if (e.start && startDay !== endDay) {
            // console.log('getting evt', formatDate(e.start, 'D'), formatDate(e.start, 'H'));
            let evt = e.clone();
            evt.metaDate = {
              end: e.end,
              start: e.start,
              name: e.name,
              color: e.color,
              year: formatDate(e.start, 'YY'),
              month: formatDate(e.start, 'M'),
              day: formatDate(e.start, 'D'),
              hour: parseInt(formatDate(e.start, 'H')),
              minute: formatDate(e.start, 'm'),
            };
            list.push(evt);
          }
        });
        return list.sort(function(event1, event2){
          if(formatDate(event1.start, 'HH') < formatDate(event2.start, 'HH')){
            return -1;
          }
          if(formatDate(event1.start, 'HH') > formatDate(event2.start, 'HH')){
            return 1;
          }
          return 0;
        });
      },
      eventList() {
        let list = [];
        this.eventsIn.forEach(e => {
          let startDay = date.formatDate(e.start, 'd');
          let endDay = date.formatDate(e.end, 'd');
          if (e.start && startDay === endDay) {
            // console.log('getting evt', formatDate(e.start, 'D'), formatDate(e.start, 'H'));
            let evt = e.clone();
            evt.metaDate = {
              end: e.end,
              start: e.start,
              name: e.name,
              color: e.color,
              year: formatDate(e.start, 'YY'),
              month: formatDate(e.start, 'M'),
              day: formatDate(e.start, 'D'),
              hour: parseInt(formatDate(e.start, 'H')),
              minute: formatDate(e.start, 'm'),
            };
            if (startDay === endDay) {
              list.push(evt);
            }
          }
        });
        return list;
      }
    //   let events = [];
    //   for (let i = 0; i < this.events.length; i++) {
    //     let days = 0;
    //     let hours = 0;
    //     let minutes = 0;
    //     let sh = this.events[i].start ? moment(this.events[i].start).format('H') : 0;
    //     console.log('event sh', i, sh);
    //     let diff = this.events[i].start && this.events[i].end ? moment(this.events[i].end).diff(this.events[i].start, 'minutes', true) : 60;
    //     console.log('event diff', i, diff);
    //     let hrs = diff / 60;
    //     if ((23 - sh) + hrs > 23) {
    //       days = Math.max(Math.floor(diff / 1440), 2);
    //     } else {
    //       hours = Math.floor(hrs);
    //       minutes = diff - (hours * 60)
    //     }
    //     events.push({...this.events[i], ...{days: days, hours: hours, minutes: minutes}})
    //   }
    //   return events
    // }
    },
    methods: {
      ...mapActions('eventstore', {
        dialogToggle: 'dialogToggle'
      }),
      openEvent(item) {
        this.$emit('open', item);
      },
      translate(event) {
        let min = parseInt(formatDate(event.start, 'mm'));
        let percentage = min / 60;
        return `translateY(${50 * percentage}px)`;
      },
      rowStart(hour) {
        //sense when you've hit 24th hour and keep going to account for starting hour not usually being 1
        let startHour = this.lget(this.hours, [0], 5);
        if (hour - startHour < 0) {
          return 24 - hour + 1;
        } else {
          // console.log('getting start 2', hour, startHour);
          return hour - startHour + 1;
        }
      },
      getRow(event) {
        // let end = parseInt(formatDate(this.eventIn.end, 'HH'));
        // let start = parseInt(formatDate(this.eventIn.start, 'HH'));
        let result = date.getDateDiff(event.end, event.start, 'hours');
        // let rowStart = this.lget(this.hours, [0], 5);
        // console.log('got height', result, rowStart);
        // return Math.abs(result) * 50;
        return Math.abs(result);
      },
      getCalendarItem(day, hour) {
        let list = [];
        this.eventList.forEach(evt => {
          if (this.lget(evt, 'metaDate.month', null) === this.month && this.lget(evt, 'metaDate.year', null) === this.year && this.lget(evt, 'metaDate.day', null) === day && this.lget(evt, 'metaDate.hour', null) === hour) {
            // console.log('got one', evt.metaDate);
            list.push(evt);
          }
        });
        return list;
      },
      getSunday(val) {
        let d = getDayOfWeek(val);
        if (d === 7) {
          return this.refDate;
        } else {
          // this.refDate is sunday
          this.refDate = subtractFromDate(val, {days: d});
        }
      },
      // check
      dayNum(day) {
        return formatDate(day, 'D');
      // return moment(day).format('D');
      },
      // check
      dayName(day) {
        return formatDate(day, 'ddd');
      // return moment(day).format('ddd');
      },
      createEvent(day, hour) {
        this.dialogToggle;
        this.$emit('createEvent', day, hour);
      },
      editEvent(value, index) {
        this.$emit('editEvent', value, index);
      },
      // check
      addWeek() {
        this.refDate = addToDate(this.refDate, {days: 7});
        setTimeout(() => this.$emit('refDate', this.refDate), 300);
      // return this.refDate = Object.assign({}, moment(this.refDate).add(1, 'weeks'));
      },
      // check
      subtractWeek() {
        setTimeout(() => this.$emit('refDate', this.refDate), 300);
        // return this.refDate = Object.assign({}, moment(this.refDate).subtract(1, 'weeks'));
        return this.refDate = subtractFromDate(this.refDate, {days: 7});
      }
    }
  };
</script>

<style scoped>
.header_col_layout {
  display: grid;
  grid-template-columns: minmax(35px, 4vw) repeat(7, 1fr);
  grid-template-rows: auto;
  position: relative;
  background-color: white;
}

.table_col_layout {
  display: grid;
  grid-template-columns: minmax(35px, 4vw) repeat(7, 1fr);
  grid-template-rows:  minmax(1200px, 1fr);
  position: relative;
  background-color: white;
  /*box-shadow: 0 0 2px #9e9e9e;*/
}

.row_layout {
  display: grid;
  height: 100%;
  grid-template-rows: repeat(24, 50px);
  grid-template-columns: 1fr;
  position: relative;
  /*background-color: white;*/
}

/*.over_flow {*/
/*  position: absolute;*/
/*  bottom: 0;*/
/*  left: 0;*/
/*  right: 0;*/
/*  height: 30%;*/
/*  width: 100%;*/
/*  box-shadow: 0 1px 0.6px #9e9e9e;*/
/*}*/

.day_header {
  display: flex;
  width: 100%;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  position: relative;
}

.__multi-day {
  width: 100%;
  overflow-x: scroll;
  max-height: 60px;
  display: flex;
  flex-direction: column;
}


/*.side_gap {*/
/*  width: 45%;*/
/*  justify-self: flex-end;*/
/*  position: relative;*/
/*}*/

/*.side_gap:after {*/
/*  content: '';*/
/*  width: 65%;*/
/*  border-bottom-style: solid;*/
/*  border-bottom-color: rgba(66, 66, 66, .3);*/
/*  border-bottom-width: .5px;*/
/*  position: absolute;*/
/*  bottom: -.35px;*/
/*  left: 20%;*/
/*}*/
.__dayNum {
  border-radius: 50%;
  height: 5vw; width: 5vw;
  max-height: 50px; max-width: 50px;
  display: grid;
  align-items: center;
  justify-items: center;
}

.box-outline {
  box-shadow: 0 0 1px #9E9E9E;
  place-self: start stretch;
  width: 100%;
  height: 100%;
  z-index: 2;
  background-color: transparent;
  cursor: pointer;
  position: relative;
  overflow: visible;
}

.box-outline:hover {
  position: relative;
  z-index: 10 !important;
  background-color: #E1F5FE !important;
  transition: background-color .7s ease-out;
}

.clicker_right {
  font-size: 32px;
  color: #424242;
  position: absolute;
  top: 40%;
  right: -10px;
  transform: translateX(50%);
}

.clicker_left {
  font-size: 32px;
  color: #424242;
  position: absolute;
  top: 40%;
  left: -10px;
  transform: translateX(-50%);
}

.clicker_left:hover {
  transform: scale(1.6);
  transition: .5s ease-in-out;
}

.clicker_right:hover {
  transform: scale(1.6);
  transition: .5s ease-in-out;
}

.eventItem:hover{
  transform: scale(1.10);
  transition: .5s ease-in-out;
  background: #f2fbff;
  box-shadow: 6px 6px 12px 0px rgba(0,0,0,0.75);
  color: #21bcff;
  border-radius: 5px;
}
</style>
