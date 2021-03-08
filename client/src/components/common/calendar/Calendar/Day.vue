<template>
  <div :style="{height: '100%', overflowY: 'scroll', marginTop: '15px'}">
    <div :style="{width: '100%', display: 'flex', position: 'relative'}">
      <div :style="{width: boxHeight  + 'px', display: 'flex', flexDirection: 'column'}">
        <div :style="{height: boxHeight * 1.42 + 'px', marginBottom: '-10px'}"></div>
        <div
          :style="{height: this.boxHeight / 2 + 'px', marginBottom: -this.boxHeight / 12 + 'px', backgroundColor: this.bgColor, marginTop: -this.boxHeight / 4 + 'px'}"></div>
        <div v-for="(hour, index) in hourFormat" :key="index" :style="sideTime">
          <p :style="{position: 'absolute', top: '-5px', left: '0', color: fontColor}" class="caption">
            {{hour}}</p>
          <div :style="sideGap"></div>
        </div>
      </div>
      <div class="columns" :style="colStyle">
        <div :style="{height: boxHeight * 1.42 + 'px', display: 'flex', flexDirection: 'column', marginBottom: '-10px'}">
          <div style="display: flex; flex-direction: row; align-items: center">
            <q-icon style="cursor: pointer;" class="clicker_left" :style="{ fontSize: '20px', color: fontColor, zIndex: 2, marginRight: '10px'}"
                    @click="subtractDay" name="mdi-chevron-left"/>
            <div style="z-index: 3;justify-content: center;text-align: center;" :style="{display: 'flex', flexDirection: 'column',}">
              <div class="text-lg text-mb-lg">
                {{dayName(refDate)}}</div>
              <div class="text-md text-mb-md">
                {{dayNum(refDate)}}</div>
            </div>
            <q-icon class="clicker_right" style="cursor: pointer;" :style="{ fontSize: '20px', color: fontColor, zIndex: 2, marginRight: '10px'}"
                    @click="addDay" name="mdi-chevron-right"/>
          </div>
        </div>
        <div :style="topSlot"></div>
        <template v-for="hour in hours">
        <div :key="`box-${hour}`" class="pointer" :style="hourSlots" @click="createEvent(refDate, hour)">
          <div v-for="(event, index) in getCalendarItem(getDateFormat(refDate, 'D'), hour)"
               :key="`calendar-item-${hour + ' ' + index}`"
               class="firstDiv"
               :style="{'background': event.eventColor.hexa,width: '100%','border-radius': '3px'}">
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
        </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import CalendarItem from 'components/common/calendar/Calendar/CalendarItem';

  const {date} = require('quasar');
  // eslint-disable-next-line no-unused-vars
  const {daysInMonth, formatDate, subtractFromDate, addToDate, startOfDate, buildDate, getDayOfWeek} = date;


  export default {
    name: 'Day',
    components: {CalendarItem},
    props: {
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
      groupIn: Object,
      eventsIn: Array
    },
    data() {
      return {
        refDate: new Date(),
      };
    },
    watch: {
      dateContext: {
        deep: true,
        immediate: true,
        handler(newVal) {
          // console.log('new date', newVal)
          this.getSunday(newVal);
        }
      }
    },
    computed: {
      eventList() {
        let list = [];
        this.eventsIn.forEach(e => {
          let startDay = formatDate(e.starts, 'd');
          let startMonth = formatDate(e.starts, 'M');
          if (e.starts && startDay === formatDate(this.refDate, 'd') && formatDate(this.refDate, 'M') === startMonth) {
            // console.log('getting evt', formatDate(e.starts, 'D'), formatDate(e.starts, 'H'));
            let evt = e.clone();
            evt.metaDate = {
              hour: parseInt(formatDate(e.starts, 'H')),
              day: parseInt(formatDate(e.starts, 'D'))

            };
            list.push(evt);
          }
        });
        return list;
      },
      colStyle() {
        return {
          fontFamily: 'sans-serif',
          width: 100 + '%',
          backgroundColor: this.bgColor,
          // borderStyle: 'solid',
          // borderWidth: '1px',
          // borderColor: this.lineColor,
          display: 'flex',
          flexDirection: 'column',
        };
      },
      topSlot() {
        return {
          height: this.boxHeight / 2 + 'px',
          boxShadow: '0px 2px 1px #9E9E9E',
          marginBottom: -this.boxHeight / 12 + 'px',
          marginTop: -this.boxHeight / 4 + 'px'
        };
      },
      hourSlots() {
        return {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          boxShadow: '0px 0px 1px #9E9E9E',
          width: '100%',
          height: this.boxHeight + 'px',
          backgroundColor: this.bgColor,
          zIndex: 1
        };
      },
      sideTime() {
        return {
          height: this.boxHeight + 'px',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: this.bgColor,
          justifyContent: 'flex-end',
          position: 'relative',
        };
      },
      sideGap() {
        return {
          width: '45%',
          justifySelf: 'flex-end',
          boxShadow: '2px 0px 1px #9E9E9E',
          // zIndex: 0,
          marginRight: -this.boxHeight / 12 + 'px',
          backgroundColor: this.bgColor,
        };
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
          list.push(formatDate(date.buildDate({hours: this.hours[i]}), 'h A'));
        }
        return list;
      },
      year() {
        return formatDate(this.refDate, 'Y');
      },
      month() {
        return formatDate(this.refDate, 'MMMM');
      },
      numberDaysInMonth() {
        return daysInMonth(this.refDate);
      },
      currentDate() {
        return formatDate(Date.now(), 'DD');
      },
    },
    methods: {
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
        // let ends = parseInt(formatDate(this.eventIn.ends, 'HH'));
        // let starts = parseInt(formatDate(this.eventIn.starts, 'HH'));
        let result = date.getDateDiff(event.ends, event.starts, 'hours');
        // let rowStart = this.lget(this.hours, [0], 5);
        // console.log('got height', result, rowStart);
        // return Math.abs(result) * 50;
        return Math.abs(result);
      },
      openEvent(item) {
        this.$emit('open', item);
      },
      editEvent(value, index) {
        this.$emit('editEvent', value, index);
      },
      getCalendarItem(day, hour) {
        let list = [];
        this.eventList.forEach(evt => {
          console.log(evt);
          if(evt.metaDate.hour === hour && evt.metaDate.day === Number(day)){
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
          // This date is Sunday
          this.refDate = subtractFromDate(val, {days: d});
        }
      },
      dayNum(day) {
        return formatDate(day, 'DD');
      },
      dayName(day) {
        return formatDate(day, 'ddd');
      },
      createEvent(day, hour) {
        this.$emit('createEvent', day, hour);
      },
      addDay() {
        return this.refDate = addToDate(this.refDate, {days: 1});
      },
      subtractDay() {
        return this.refDate = subtractFromDate(this.refDate, {days: 1});
      }
    }
  };
</script>

<style scoped>
  .clicker_left:hover {
    transform: scale(1.6);
    transition: .5s ease-in-out;
  }

  .clicker_right:hover {
    transform: scale(1.6);
    transition: .5s ease-in-out;
  }


  .firstDiv:first-child {
    margin-left: 50px;
  }
</style>
