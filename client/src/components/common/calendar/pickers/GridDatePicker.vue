<template>
  <div :class="header ? 'picker_grid main_date_picker' : 'main_date_picker'" :style="{boxShadow: '0 0 5px' + labelColor}">
    <div v-if="header" class="date_toolbar" :style="{backgroundColor: labelColor}">
      <div class="top_icons">
        <q-btn icon="mdi-refresh" size="xs" round flat @click="clearDates"/>
        <q-btn size="xs" round flat icon="mdi-home" @click="resetView"/>
      </div>
      <p class="title_date"
         v-html="sanitize(displayDate)">
      </p>
    </div>

<!--    MAIN BODY -->
    <div class="main_container">
        <div style="position: absolute; top: 1px; left: 3px; text-transform: uppercase; font-size: .7rem; font-weight: 600;">{{isEnd ? 'end - ' + shortDisplay : 'start - ' + shortDisplay}}</div>
        <!--          TOP MONTH PICKER -->
        <div class="calendar-header">
          <q-icon :style="{ fontSize: '25px', color: labelColor }" @click="subtractMonth" name="mdi-arrow-left"/>

          <h3 :style="{ fontSize: '1.3rem', color: labelColor, cursor: 'pointer' }"
              @click="moYr = !moYr">{{month + ' ' + year}}</h3>

          <q-icon :style="{ fontSize: '25px', color: labelColor }" @click="addMonth" name="mdi-arrow-right"/>
          <q-icon style="position: absolute; top: 2px; right: 2px;" @click="$emit('close')" name="mdi-close"/>
        </div>

<!--        DAY ROW-->
        <div class="day_row">
          <div v-for="day in days" :key="day.letter"
               class="day_style" :style="{ color: textColor }">
            <p>{{day.letter}}</p>
          </div>

          <div v-for="(blank, index) in firstDayOfMonth" :key="blank[index]"
               class="day_blocks">
            <p>&nbsp;</p>
          </div>
          <div v-for="date in daysInMonth" :key="date" :id="date"
               class="day_blocks" :style="{ textAlign: 'center', cursor: 'pointer', backgroundColor: colorSelected(date), borderRadius: '50%',}">
            <p @click="start ? selectSDate(date) : selectEDate(date)" :key="date"
               :style="{ color: textColor }">{{date}}</p>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import {mapState, mapActions} from 'vuex';

  export default {
    components: {},
    props: {
      isEnd: Boolean,
      start: {
        type: Boolean,
        default: true
      },
      starter: {
        type: Object
      },
      header: {
        type: Boolean,
        default: true
      },
      pix: {
        type: Number,
        default: 400
      },
      labelColor: {
        type: String,
        default: '#000000'
      },
      selectSet: {
        type: String,
        default: 'single'
      // 'single', 'multi'
      },
      textColor: {
        type: String,
        default: '#424242'
      },
      v: {
        type: Object,
      },
      days: {
        type: Array,
        default: function () {
          return [
            {
              day: 'Sunday',
              letter: 'Su'
            },
            {
              day: 'Monday',
              letter: 'Mo'
            },
            {
              day: 'Tuesday',
              letter: 'Tu'
            },
            {
              day: 'Wednesday',
              letter: 'We'
            },
            {
              day: 'Thursday',
              letter: 'Th'
            },
            {
              day: 'Friday',
              letter: 'Fr'
            },
            {
              day: 'Saturday',
              letter: 'Sa'
            }
          ];
        },
        required: false
      }
    },
    data() {
      return {
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        moYr: false,
        timeOn: false,
        today: moment(),
        thisYear: moment().format('YYYY'),
        time: '12:00 am',
        timeStarter: null,
        windowWidth: null,
        highlightColor: '',
        dateContext: moment(),
      };
    },
    mounted() {
      window.addEventListener('resize', () => {
        this.windowWidth = window.innerWidth;
      });
    },
    watch: {
      starter: {
        deep: true,
        immediate: true,
        handler(newVal){
          // eslint-disable-next-line no-console
          moment(newVal).isValid() ? this.takeDate(newVal) : console.log('date brought into date picker was not valid');
        }
      }
    },
    computed: {
      ...mapState('eventstore', {
        sDate: 'sDate',
        sTime: 'sTime',
        eDate: 'eDate',
        eTime: 'eTime'
      }),
      toolbarWidth() {
        // if(this.windowWidth > this.pix * 1.55) {
        //     return this.pix * 1.5 + 'px'
        // } else {
        return this.pix + 'px';
      // }
      },
      returnDate() {
        return this.start ? this.sDate : this.eDate;
      },
      shortDisplay(){
        return this.start && this.sDate.length > 1 ? this.sDate.length + ' ' + 'dates' : this.start && moment(this.sDate[0]).isValid() ? moment(this.sDate[0]).format('MMM-DD') : moment(this.eDate._i).isValid() ? moment(this.eDate._i).format('MMM-DD') : 'Selec' || 'Select';
      },
      displayDate(){
        return this.start && this.sDate.length > 1 ? this.sDate.length + ' ' + 'dates' : this.start && moment(this.sDate[0]).isValid() ? moment(this.sDate[0]).format('ll') : moment(this.eDate._i).isValid() ? moment(this.eDate._i).format('ll') : 'Select Date' || 'Select Date';
      },
      returnTime() {
        return this.sDate.length < 2 && this.start ?
          moment(this.sTime, 'h:mm a') : this.sDate.length < 2 ? moment(this.eTime, 'h:mm a') :
            '';
      },
      // DT() {
      //     return this.start && this.sDate.length > 0 && this.sDate.length < 2 ? moment(this.sDate + ':' + this.sTime, 'ddd-MMM-DD-YYYY:hh:mm a').format('ddd-MMM-DD-YYYY:hh:mm a') : this.start ? this.sDate : this.eDate.length > 0 && this.eDate.length < 2 ? moment(this.eDate + ':' + this.eTime, 'ddd-MMM-DD-YYYY:hh:mm a').format('ddd-MMM-DD-YYYY:hh:mm a') : this.eDate
      // },
      year() {
        return this.dateContext.format('Y');
      },
      month() {
        return this.dateContext.format('MMMM');
      },
      daysInMonth() {
        return this.dateContext.daysInMonth();
      },
      currentDate() {
        return this.dateContext.get('date');
      },
      firstDayOfMonth() {
        let firstDay = moment(this.dateContext).subtract((this.currentDate - 1), 'days');
        return firstDay.weekday();
      },
      initialDate() {
        return this.today.get('date');
      },
      initialMonth() {
        return this.today.format('MMMM');
      },
      initialYear() {
        return this.today.format('Y');
      },
    },
    methods: {
      ...mapActions('eventstore', {
        sDateChange: 'sDateChange',
        eDateChange: 'eDateChange',
        addSDate: 'addSDate',
        clearSTime: 'clearSTime',
        clearETime: 'clearETime',
        removeSDate: 'removeSDate',
        clearDates: 'clearDates'
      }),
      setMonth(month) {
        this.dateContext = moment(this.year + '-' + month, 'Y-MMMM');
      },
      timeToggle(){
        this.timeOn = !this.timeOn;
        this.$emit('timeSet');
        return this.start ? this.clearSTime : this.clearETime;
      },
      setYear(year) {
        this.dateContext = moment(year + '-' + this.month, 'Y-MMMM');
      },
      resetView() {
        this.dateContext = moment();
      },
      setTime(value) {
        // console.log(this.sTime, this.sDate);
        this.$emit('timeSet', value);
      },
      colorSelected(date) {
        let list = this.sDate.length ? this.sDate.map(a => a._i) : [];
        let elist = this.eDate._i ? this.eDate._i : '';
        let colorOn = moment(this.year + '-' + this.month + '-' + date).format('YYYY-MMMM-D');
        if (list.includes(colorOn) && this.start) {
          return '#B9F6CA';
        } else {
          if(elist === (colorOn) && !this.start) {
            return '#FF4081';
          }
        }
      },

      // DATES PASSED TO DATECHIP
      selectEDate(date) {
        let newDate = moment(this.year + '-' + this.month + '-' + date);
        // console.log('selectingEDate', newDate)
        this.eDateChange(newDate);
        this.$emit('setDT', this.returnDate);
      },
      selectSDate(date){
        let newDate = moment(this.year + '-' + this.month + '-' + date);
        // console.log('selectingSDate', newDate)
        let list = this.sDate.map(a => a._i);
        this.selectSet === 'single' ? this.sDateChange(newDate) : list.includes(newDate._i) ? this.removeSDate(newDate, 1) : this.addSDate(newDate);
        this.$emit('setDT', this.returnDate);
      },
      takeDate(date){
        this.start ? this.takeInSDate(date) : this.takeInEDate(date);
        this.takeInTime(date);
      },
      takeInTime(time){
        this.timeToggle;
        // console.log('taking in time', time)
        this.timeStarter = time;
      },
      takeInSDate(date){
        let newDate = moment(date);
        // console.log('taking SDate', newDate)
        let list = this.sDate.map(a => a._i);
        this.selectSet === 'single' ? this.sDateChange(newDate) : list.includes(newDate._i) ? this.removeSDate(newDate, 1) : this.addSDate(newDate);
      // this.$emit('setDT', this.returnDate);
      },
      takeInEDate(date) {
        let newDate = moment(date);
        // console.log('taking EDate', newDate)
        this.eDateChange(newDate);
        this.$emit('setDT', this.returnDate);
      },
      addMonth() {
        this.dateContext = moment(this.dateContext).add(1, 'month');
      },
      subtractMonth() {
        this.dateContext = moment(this.dateContext).subtract(1, 'month');
      },
    }
  };
</script>
<style scoped>
  .main_date_picker {
    height: 100%;
    width: 100%;
    position: relative;
  }
  .picker_grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 20fr 80fr
  }
  .calendar-header {
    justify-self: center;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .date_toolbar {
    width: 100%;
    height: 22%;
    position: relative;
    border-radius: 3.2%;
    display: flex;
    justify-content: flex-start;
    align-items: center
  }
  .top_icons {position: absolute; top: 59%; left: 80%; display: flex; align-items: flex-end;}
  .title_date {font-size: 1.3rem; color: white; margin-left: 5%; position: absolute}

  .main_container {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 20fr 80fr;
  }

  .day_row {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: 12fr repeat(auto-fill, auto);
  }
  .day_style {
    width: 100%;
    height: 100%;
    text-align: center;
    font-size: .5rem;
  }
  .day_blocks {
    width: 100%;
    font-size: .5rem;
  }

</style>
