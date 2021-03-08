<template>
  <div id="calendar-width-dummy" style="width: 100%; margin: 10px">
    <div style="display: flex; justify-content: center; width: 100%;">
        <div>
<!--                HEADER-->
<!--        <div :style="{width: width + 10 + 'px', height: altSize / 15 + 'px',  boxShadow: '2px 2px 6px black', backgroundColor: labelColor, borderRadius: pixs/30 + 'px', display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', justifySelf: 'center'}">-->
<!--            <p :style="{fontSize: pixs/20 + 'px', color: 'white', marginLeft: pixs/20 + 'px'}">{{year}}</p>-->
<!--            <div :style="{marginLeft: pixs/2.3 + 'px'}">-->
<!--            </div>-->
<!--        </div>-->
<!--                MAIN BODY -->
        <div :style="{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}">

<!--                    DAY HEADER-->

                <div :style="{display: 'flex', flexWrap: 'nowrap', flexDirection: 'row', marginLeft: pixs/90 +'px', alignContent: 'flex-end'}">
                    <div v-for="day in days" :key="day.letter"
                         :style="{ width: windowWidth/7.05 + 'px', height: windowWidth/15 + 'px', lineHeight: pixs/7 + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center'}">
                        <p :style="{ fontSize: fontSize * 1.25 + 'px', color: fontColor, margin: 0}">{{day.letter}}</p>
                    </div>
                </div>

                <div style="margin-bottom: 15px">
<!--                    PRIOR-->
                <div :style="{display: 'flex', flexWrap: 'wrap', flexDirection: 'row'}">
                    <DateBox :pixs="pixs" :width="windowWidth" :colorDate="colorDate" :days="priorMonthDays" v-for="(date, index) in priorMonthDays" :key="`prior-${index}`" :id="date" :day="getDate(date.date)" :events="date.events" :groupIn="groupIn">
                    </DateBox>
<!--                    DATES-->
                    <DateBox @edit="editEvent" @open="openEvent"  @selectDate="createEvent" :pixs="pixs" :width="windowWidth" :colorDate="colorDate" :days="currMonthDays" v-for="(date,index) in currMonthDays" :key="`current-${index}`" :id="date" :day="getDate(date.date)" :events="date.events" :groupIn="groupIn">
                    </DateBox>
<!--                    NEXT-->
                    <DateBox :pixs="pixs" :width="windowWidth" :colorDate="colorDate" :days="nextMonthDays" v-for="(date,index) in nextMonthDays" :key="`after-${index}`" :id="date" :day="getDate(date.date)" :events="date.events">
                    </DateBox>
                </div>
            </div>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
  // import moment from 'moment';
  import {mapState, mapActions} from 'vuex';
  import DateBox from './DateBox';
  const {date} = require('quasar');
  // eslint-disable-next-line no-unused-vars
  const {daysInMonth, formatDate, subtractFromDate, addToDate, startOfDate, endOfDate, buildDate, getDateDiff, adjustDate} = date;

  export default {
    name: 'Month',
    components: {DateBox},
    props: {
      pix: {
        type: Number,
      },
      labelColor: {
        type: String,
        default: '#000000'
      },
      selectSet: {
        type: String,
        default: 'single'
      },
      dates: {
        type: Array,
      },
      ratio: {
        type: Number,
        default: 1.05
      },
      bgColor: {
        type: String,
        default: '#ffffff'
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
        isMobile: false,
        selectedDate: null,
        colorDate: [],
        today: new Date(),
        time: '12:00 am',
        windowWidth: null,
        highlightColor: '',
        days: [
          {
            day: 'Sunday',
            letter: 'Sun'
          },
          {
            day: 'Monday',
            letter: 'Mon'
          },
          {
            day: 'Tuesday',
            letter: 'Tue'
          },
          {
            day: 'Wednesday',
            letter: 'Wed'
          },
          {
            day: 'Thursday',
            letter: 'Thu'
          },
          {
            day: 'Friday',
            letter: 'Fri'
          },
          {
            day: 'Saturday',
            letter: 'Sat'
          }
        ]
      };
    },
    mounted() {
      window.addEventListener('resize', () => {
        /* this.windowWidth = window.innerWidth */
        this.windowWidth = document.getElementById('calendar-width-dummy').offsetWidth - 10;
      });
      this.windowWidth = document.getElementById('calendar-width-dummy').offsetWidth - 10;
      /* this.windowWidth = window.innerWidth */
    },

    created(){
      window.addEventListener('resize', this.makeMobile);
    },
    computed: {
      ...mapState('eventstore', {
        sDate: 'sDate',
        sTime: 'sTime'
      }),
      fontSize(){
        return Math.max(this.width/70, 15);
      },
      width() {
        return this.windowWidth / this.ratio;
      },
      altSize(){
        return this.windowWidth > 1000 ? this.windowWidth / this.ratio : this.windowWidth > 600 ? this.windowWidth * 1.5 / this.ratio : this.windowWidth * 1.75 / this.ratio;
      },
      pixs(){
        return this.pix;
      },
      toolbarWidth(){
        // if(this.windowWidth > this.pixs * 1.55) {
        //     return this.pixs * 1.5 + 'px'
        // } else {
        return this.pixs + 'px';
        // }
      },
      DT() {
        if (this.selectedDate !== null) {
          return this.pickedDate + formatDate(this.time, 'h:mm a');
        } else {
          return this.today._d;
        }
      },
      pickedDate() {
        return formatDate(this.selectedDate, 'ddd-MMM-DD-YYYY');
      },
      year() {
        return formatDate(this.dateContext, 'YYYY');
      },
      month() {
        return formatDate(this.dateContext,'MMMM');
      },
      numberDaysInMonth() {
        return daysInMonth(this.dateContext);
      },
      currMonthDays() {
        let list = [];
        let context = startOfDate(this.dateContext, 'month');
        // list.push(context);
        let filteredEvents = this.eventsIn.filter(e => formatDate(e.starts, 'MMMM') === this.month);
        let daysWithEvents = filteredEvents.reduce((acc, cur) => {
          let start = Number(formatDate(cur.starts, 'D'));
          let range = getDateDiff(cur.ends, cur.starts, 'days') + start;
          for(let i = start;i <= range;i++){
            if(i > this.numberDaysInMonth){
              break;
            }else {
              if (acc[i]) {
                acc[i].push(cur);
              } else {
                acc[i] = [cur];
              }
            }
          }
          return acc;
        }, {});
        let currentday;
        for (let i = 1; i <= this.numberDaysInMonth; i++){
          if(Number(formatDate(context, 'D')) === 1 && !list.length){
            currentday = {date: context,events: daysWithEvents[i] ? daysWithEvents[i] : []};
          }else {
            context = addToDate(context, {days: 1});
            currentday = {date: context,events: daysWithEvents[i] ? daysWithEvents[i] : []};
          }
          list[i - 1] = currentday;
        }
        // list.shift();
        return list;
      },
      currentDate() {
        return formatDate(this.dateContext, 'DD');
      },
      firstDayOfMonth() {
        let firstDay = startOfDate(this.dateContext, 'month');
        return formatDate(firstDay, 'D');
      },
      lastDayOfMonth(){
        let lastDay = endOfDate(this.dateContext, 'month');
        // let lastDay = moment(this.dateContext).add(this.numberDaysInMonth - this.currentDate, 'days');
        return formatDate(lastDay, 'D');
      },
      priorMonthDays(){
        let list = [];
        let days = [];
        let monthStart = startOfDate(this.dateContext, 'month');
        for(let i = 1;i < 3; i++){
          let previousDays = {date: date.subtractFromDate(monthStart, {days: i})};
          days.push(formatDate(previousDays.date, 'D'));
          list.push(previousDays);
        }
        let month = formatDate(date.subtractFromDate(monthStart, {days: 1}), 'MMMM');
        let filteredEvents = this.eventsIn.filter(e => formatDate(e.starts, 'MMMM') === month && formatDate(e.starts, 'D') === days[0]);

        console.log(filteredEvents);
        list = list.reverse();
        return list;
      },
      nextMonthDays(){
        let list = [];
        let monthEnd = endOfDate(this.dateContext, 'month');
        for(let i = 1; i < 3; i++){
          let nextMonthDays = {date: date.addToDate(monthEnd, {days: i})};
          list.push(nextMonthDays);
        }
        return list;
      },
      initialDate() {
        return formatDate(this.today, 'D');
      },
      initialMonth() {
        return formatDate(this.dateContext, 'MMMM');
      },
      initialYear() {
        return formatDate(this.dateContext, 'Y');
      },
      dateList() {
        let list = [];
        for (let i = 0; i < this.dates; i++) {
          list.push(this.dates[i]);
        }
        return list;
      },
      matchList() {
        let list = [];
        for (let i = 0; i < this.numberDaysInMonth; i++) {
          let year = Number(this.year);
          let month = Number(formatDate(this.month, 'M'));
          let day = buildDate({year: year, month: month, date: this.numberDaysInMonth[i]});
          this.dateList.some(a => a.date.isSameDate(day)) ? list.push(day) : '';
        }
        return list;
      }
    },
    methods: {
      ...mapActions('eventstore', {
        sDateChange: 'sDateChange'
      }),
      ...mapActions('productstore', {
        deletepGroup: 'deletepGroup'
      }),
      ...mapActions('eventstore', {
        dialogToggle: 'dialogToggle'
      }),
      getDate(day){
        return formatDate(day, 'D');
      },
      createEvent(day){
        let numberToDate = adjustDate(this.dateContext, { date: day,});
        this.dialogToggle;
        this.$emit('createEvent', numberToDate, 6);
      },
      editEvent(value) {
        this.$emit('editEvent', value);
      },
      // makeMobile(){
      //   if(this.window.innerWidth < 760){
      //     this.isMobile = true;
      //   } else {
      //     this.isMobile = false;
      //   }
      // },
      setTime(){
        // console.log(this.sTime, this.sDate);
        this.sDateChange(this.selectedDate);
        this.time = this.sTime;
        this.$emit('setDT', this.DT);

      },
      openEvent(item){
        this.$emit('open', item);
      },
      selectDate(date) {
        if (this.selectSet === 'single') {
          this.colorDate = date;
          this.selectedDate = formatDate(this.today, 'ddd-MMM-DD-YYYY');
        } else {
          this.colorDate.push(date);
          this.selectedDate.push(formatDate(this.today, 'ddd-MMM-DD-YYYY'));
        }
        this.setTime();
      },
      // addMonth() {
      //     this.dateContext = moment(this.dateContext).add(1, 'month');
      // },
      // subtractMonth() {
      //     this.dateContext = moment(this.dateContext).subtract(1, 'month');
      // },
    }
  };
</script>
<style scoped>
    /*.calendar-header {*/
    /*    display: flex;*/
    /*    justify-content: space-around;*/
    /*}*/
    /*.row_layout {*/
    /*  display: grid;*/
    /*  height: 100%;*/
    /*  grid-template-rows: 80px repeat(24, 50px);*/
    /*  grid-template-columns: 1fr;*/
    /*  position: relative;*/
    /*  !*background-color: white;*!*/
    /*}*/
</style>
