<template>
  <div style="display: flex; justify-content: center; width: 100%; flex-wrap: wrap">
    <div class="calendar_header">
      <q-btn :size="$q.screen.lt.md ? 'xs' : ''" @click="resetView" outline>Today</q-btn>

      <!--                MONTH SLIDER-->
      <div class="month_header q-pl-md">

        <q-btn round flat size="sm" @click="subtractMonth">
          <q-icon name="mdi-chevron-left" :size="pixs/25 + 'px'"/>
        </q-btn>

        <q-btn round flat size="sm" @click="addMonth">
          <q-icon :size="pixs/25 + 'px'" name="mdi-chevron-right"/>
        </q-btn>

        <div class="text-md text-mb-md q-px-md"> {{month + ' ' + year}} </div>

      </div>

      <q-space/>
      <q-btn round flat @click="openMenu = !openMenu" color="primary" icon="mdi-view-grid">
        <q-menu>
          <q-list>
            <q-item v-for="(type, index) in types" :key="index" >
              <q-item-label style="cursor:pointer;" @click="changeType(type)">
                {{type.name}}
              </q-item-label>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
    <div style="width: 100%; min-height: 600px; position: relative; padding: 0 1% 0 1%; display: flex; flex-wrap: nowrap">
      <div style="width: 100%">
      <component :is="currComponent"
                 :labelColor="labelColor"
                 :bgColor="bgColor"
                 :pix="pixs"
                 :dateContext="dateContext"
                 @createEvent="createEvent"
                 @editEvent="editEvent"
                 :eventsIn="eventsIn"
                 @refDate="refDate"
                 :groupIn="groupIn"
                 @open="openEvent"
      ></component>
      </div>
      <div style="width: 40px; height: 100%"></div>
      <!--      <div class="pop_up" v-if="eventDialog">-->
      <!--        <EventCreate @close="closeEventPopup"-->
      <!--                    @menuPreview="menuPreview = !menuPreview"-->
      <!--                    :model_start="model_start"-->
      <!--                    :model_end="model_end"-->
      <!--                    :eventIn="eventIn"-->
      <!--                    @saved="closeAfterSave"-->
      <!--        ></EventCreate>-->
      <!--      </div>-->
    </div>
    <q-dialog v-model="eventCreate" :maximized="$q.screen.lt.sm" @input="val => !val ? editing = null : ''">
      <q-card style="width: 800px; max-width: 100vw">
        <q-btn size="sm" style="z-index: 100; position: fixed; top: 5px; right: 5px; background: rgba(0,0,0,.4)" round flat class="text-white" icon="mdi-close" @click="eventCreate = false"/>
        <EventForm @closeDialog="eventCreate = false,editing = null" :event-in="editing" :starts="event_starts" :ends="event_ends"/>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Month from './Month';
  import Day from './Day';
  import EventForm from '../events/forms/EventForm';
  import List from '../events/grid/EventGrid';
  import GridWeek from './GridWeek';

  import {date} from 'quasar';

  const {daysInMonth, formatDate, subtractFromDate, addToDate, startOfDate, buildDate, adjustDate} = date;

  export default {
    name: 'Calendar',
    components: {
      // EventCreate,
      Month,
      Day,
      List,
      EventForm,
      // Grid,
      // GridShop,
      GridWeek
    },
    props: {
      groupIn: Object,
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
        default: 1.2
      },
      bgColor: {
        type: String,
        default: '#ffffff'
      },
      eventColor: {
        type: String,
        default: '#26C6DA'
      },
      blockedColor: {
        type: String,
        default: '#B0BEC5'
      },
      // events should come as arrays of hours to be scheduled or blocked as moment objects
      eventsIn: {
        type: Array
      }
    },
    data() {
      return {
        editing: null,
        event_starts: '',
        event_ends: '',
        eventCreate: false,
        openMenu: false,
        menuPreview: false,
        // model_start: new Date(),
        // model_end: moment().add(1, 'hours'),
        eventIn: {},
        selectedDate: null,
        colorDate: [],
        today: new Date(),
        time: '12:00 am',
        windowWidth: null,
        highlightColor: '',
        currComponent: GridWeek,
        dateContext: new Date(),
        types: [
          {
            name: 'Week',
            num: 4,
            component: GridWeek
          },
          {
            name: 'Month',
            num: 1,
            component: Month
          },
          {
            name: 'Day',
            num: 2,
            component: Day
          },
          {
            name: 'List',
            num: 3,
            component: List
          },
        // {
        //   name: 'Grid Event Shop',
        //   num: 3,
        //   component: GridShop
        // },
        // {
        //   name: 'Grid Event Explore',
        //   num: 3,
        //   component: Grid
        // },
        ]
      };
    },
    mounted() {
    // this.loadEvents();
    // this.setActionNav();
    },
    beforeDestroy() {
      this.unsetActionNav();
    },
    computed: {
      // ...mapFields({
      //   action_nav_component: 'action_nav_component'
      // }),
      ...mapGetters('events', {
        findEvents: 'find',
        getEvent: 'get'
      }),
      ...mapGetters('communities', {getCommunity: 'get'}),
      stateCommunity(){
        return this.getCommunity(this.$route.params.id);
      },
      width() {
        return this.windowWidth / this.ratio;
      },
      altSize() {
        return this.windowWidth > 1000 ? this.windowWidth / this.ratio : this.windowWidth > 600 ? this.windowWidth * 1.5 / this.ratio : this.windowWidth * 1.75 / this.ratio;
      },
      pixs() {
        return this.pix;
      },
      toolbarWidth() {
        // if(this.windowWidth > this.pixs * 1.55) {
        //     return this.pixs * 1.5 + 'px'
        // } else {
        return this.pixs + 'px';
      // }
      },
      // check ????
      // return moment(this.pickedDate + this.time, 'ddd-MMM-DD-YYYY:hh:mm a').format('ddd-MMM-DD-YYYY:hh:mm a');
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
      // check returns 2020
      year() {
        return formatDate(this.dateContext, 'YYYY');
      },
      //check returns July
      month() {
        return formatDate(this.dateContext,'MMMM');
      },
      // check returns 31
      numberDaysInMonth() {
        return daysInMonth(this.dateContext);
      },
      // check returns 02
      currentDate() {
        return formatDate(this.dateContext, 'DD');
      },
      //check Wednesday
      firstDayOfMonth() {
        let firstDay = startOfDate(this.dateContext, 'month');
        return formatDate(firstDay, 'dddd');
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
          this.dateList.some(a => a.isSameDate(day)) ? list.push(day) : '';
        }
        return list;
      }
    },
    methods: {
      openEvent(item){
        this.$emit('open', item);
      },
      test(){
        let testDate = Date.now();
        testDate = addToDate(testDate, {days: 7});
        console.log(testDate);
      },
      // ...mapActions('eventstore', {
      //   loadEvents: 'loadEvents'
      // }),
      // ...mapActions('events', {
      //   loadEvents: 'find'
      // }),
      setActionNav() {
      // if (this.$route.name === 'calendar') this.action_nav_component = 'GlobalEventCalendar';
      },
      unsetActionNav() {
        this.action_nav_component = '';
      },

      createEvent(day, hour) {
        // console.log('is nonformatted good', day, isValid(hour), hour);
        let startDate = adjustDate(day, { hours: hour, minutes: 0 });
        let endDate = addToDate(startDate, {hours: 1});
        // console.log('endhour', startDate, endDate);
        this.model_start = startDate;
        // console.log('this is model start', this.model_start);
        this.model_end = endDate;
        // console.log('this is model_end', this.model_end);
        this.event_starts = this.model_start;
        this.event_ends = this.model_end;
        // console.log('tracking problem', isValid(this.event_starts));
        this.eventCreate = true;
      },
      editEvent(value) {
        // eslint-disable-next-line no-console
        this.event_starts = value.starts;
        this.event_ends = value.ends;
        console.log('editing event', value);
        this.editing = value;
        this.eventCreate = true;
      // this.eventIn = Object.assign({}, value);
      // this.model_start = Object.assign({}, value.starts);
      // this.model_end = Object.assign({}, value.ends);
      // this.dialogToggle();
      },
      refDate(value) {
        // console.log('refDate', value)
        this.dateContext = value;
      },
      closeEventPopup() {
        // console.log('click outside')
        let c = confirm('Are you sure you want to close without saving?');
        // eslint-disable-next-line no-console
        if (c) {
          this.dialogToggle();
          this.eventIn = Object.assign({}, {});
        }
      },
      closeAfterSave() {
        this.dialogToggle();
        this.eventIn = Object.assign({}, {});
      },

      changeType(type) {
        console.log(type);
        this.currComponent = type.component;
      },
      resetView() {
        this.dateContext = new Date();
      },
      setTime() {
        // console.log(this.sTime, this.sDate);
        this.sDateChange(this.selectedDate);
        this.time = this.sTime;
        this.$emit('setDT', this.DT);

      },
      // if single returns Thu-JUL 02-2020
      //       this.selectedDate = moment(this.year + '-' + this.month + '-' + date, 'YYYY-MMMM-DD').format('ddd-MMM-DD-YYYY');
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
      // check returns next month
      addMonth() {
        this.dateContext = addToDate(this.dateContext, {month: 1});
      },
      // check returns previous month
      subtractMonth() {
        this.dateContext = subtractFromDate(this.dateContext, {month: 1});
      },
    }
  };
</script>
<style scoped>
.month_header {
  display: flex;
  align-items: center;
  color: #101010;
}

.calendar_header {
  height: 80px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: 2%;
  padding-right: 2%;
  z-index: 2;
}

.event_drawer {
  position: fixed;
  background-color: white;
  top: 0;
  bottom: 0;
  right: 65%;
  left: 0;
  width: 35%;
  z-index: 6;
  overflow-y: scroll;
  box-shadow: -3px 0px 40px 4px #111111;
  transition: width 0.3s ease-out;
}

.pop_up {
  position: fixed;
  top: 15%;
  left: 50%;
  margin-left: -300px;
  bottom: 10%;
  width: 600px;
  max-width: 100%;
  max-height: 100vh;
  border-radius: 10px;
  box-shadow: 0px 0px 25px 5px #9E9E9E;
  z-index: 21;
}

@media (max-width: 650px){
  .pop_up {
    top: 30px;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
  }
}

</style>
