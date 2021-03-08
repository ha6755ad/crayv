<template>
  <div class="container">
    <div>
      <!--    DIALOG HEADER-->
      <div class="header">
        Event Schedule
      </div>

      <!--      DAY HEADER AND CONTAINER-->
      <div v-for="(day, index) in dayList" :key="index" v-show="dayIndex === index" >
        <div style="display: flex; align-items: center; cursor:pointer;">
          <div style="font-weight: 600; font-size: 1rem">{{day.weekday + ', ' + day.month + '-' +
            day.date}}</div>
          <div class="row q-mb-md">
          <q-icon class="q-mt-md q-ml-md pointer" size="15px" @click="minusIndex()" v-if="multiDay" name="mdi-arrow-left"/>
          <q-icon class="q-mt-md q-ml-md pointer" size="15px" @click="addIndex()" v-if="multiDay" name="mdi-arrow-right"/>
          </div>
        </div>

        <!--        PLACEHOLDER CALENDAR ITEM-->
        <div style="height: 100%; width: 100%; position: relative; margin-left: 10%;" v-if="createDialog">

          <!--        CREATE SCHEDULE ITEM BOX-->
          <div class="edit_box" v-if="createDialog">
            <q-btn style="position: absolute; top: -10px; right: -10px" round flat @click="createDialog = !createDialog" icon="mdi-close"/>
            <EditScheduleBox
              :uuid-in="loc_uuid"
              :eventIn="eventModel"
              :dateList="dateList"
              @input="saveItem"
            ></EditScheduleBox>
          </div>
        </div>
<!--          CREATE PLACEHOLDER-->
        <div class="time_grid"
             :style="slotStyle(day.hours)"
        >
          <div class="time_slot" :style="{borderTopStyle: idx === 0 ? 'solid' : 'none'}"
               v-for="(hour, idx) in day.hours" :key="idx" @click.stop="createItem(day.obj, idx)">
            <p>{{returnHours(index, hour)}}</p>
            <div class="item_wrap"  v-if="createDialog && createIndex === idx && editIndex < 0">
              <calendar-item
                outlined
                :eventIn="placeholder"
                :boxHeight="boxHeight"
                :title_on="false"
              >
              </calendar-item>
            </div>
            <!--        GENUINE CALENDAR ITEMS-->
            <div class="item_wrap" v-for="(event, index) in eventBlocks(day, hour)" :key="index">
              <calendar-item
                :eventIn="event"
                :boxHeight="boxHeight"
                @edit="editScheduleItem(event, index)"
              ></calendar-item>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="height: 12px; width: 100%; background: rgba(0,0,0,.6); color: white; display: grid; align-items: center; text-align: center; border-radius: 3px; font-size: 12px"><div style="transform: translate(0, -2px)">Event End</div></div>
  </div>
</template>

<script>
  import moment from 'moment';
  import CalendarItem from '../Calendar/CalendarItem';
  import EditScheduleBox from './forms/EditScheduleBox';
  import {date} from 'quasar';

  export default {
    name: 'EventSchedule',
    components: {EditScheduleBox, CalendarItem},
    props: {
      boxHeight: {
        type: Number,
        default: 80
      },
      model_start: {
        type: [Date, String],
        default: new Date()
      },
      model_end: {
        type: [Date, String],
        default: date.addToDate(new Date(), {hours: 1})
      },
      // events should come as arrays of objects to be scheduled or blocked as moment objects ex:
      //     [{
      //       name: 'event name',
      //       start: moment(),
      //       end: moment().add(1, 'hours'),
      //       color: '#2196F3'
      //     }]
      events: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      return {
        editIndex: -1,
        editObj: {
          name: ''
        },
        createIndex: 0,
        dayIndex: 0,
        name: 'Untitled',
        createDialog: false,
        loc_uuid: '',
        eventModel: {
          name: 'Untitled',
          description: '',
          starts: new Date(),
          ends: date.addToDate(new Date(), {hours: 1}),
        },
        color: '#2196F3',
        description: '',
      };
    },
    computed: {
      getUUID() {
        return this.uuid();
      },
      // format dayList to pass into inlineDate dropdown
      dateList() {
        return this.dayList.map(a => a.obj);
      },
      // GENERATE TEMPORARY EVENT BLOCK
      placeholder() {
        let days = 0;
        let hours = 1;
        let minutes = 0;
        let sh = moment(this.eventModel.starts.date).format('H');
        let diff = moment(this.eventModel.ends.date).diff(this.eventModel.starts.date, 'minutes', true);
        let hrs = diff / 60;
        if ((23 - sh) + hrs > 23) {
          days = Math.max(Math.floor(diff / 1440), 2);
        } else {
          hours = Math.floor(hrs);
          minutes = diff - (hours * 60);
        }
        return {...this.form, ...{days: days, hours: hours, minutes: minutes}};
      },

      // FOR CREATING NEW OR EDITING SCHEDULE EVENTS
      form() {
        return {
          uuid: this.loc_uuid,
          name: this.eventModel.name,
          description: this.eventModel.description,
          starts: this.eventModel.starts,
          ends: this.eventModel.ends,
          lineup: {},
          invites: {},
          settings: {}
        };
      },
      // PRODUCE DAY LABELING PROPERTIES, HOURS OF EVENT IN A GIVEN DAY, AND PRODUCING DAYLIST
      timeFrame() {
        let sd = moment(this.model_start).format('MMM-D-YYYY h:mm a');
        // let st = this.model_start.time;
        let ed = moment(this.model_end).format('MMM-D-YYYY h:mm a');
        // let et = this.model_end.time;
        let a = moment(sd, 'MMM-D-YYYY h:mm a');
        let b = moment(ed, 'MMM-D-YYYY h:mm a');
        let d = b.diff(a, 'minutes', true);
        let days = Math.floor(d / 1440);
        let hours = Math.floor((d - (days * 1440)) / 60);
        let minutes = Math.floor(d - (days * 1440 + hours * 60));
        return {
          obj: a,
          date: moment(a).format('D'),
          weekday: moment(a).format('ddd'),
          month: moment(a).format('MMM'),
          startHour: moment(a).format('h:mm a'),
          days: days,
          hours: hours,
          minutes: minutes
        };
      },
      // DETERMINE IF DAY SCROLLING AND MULTI DAY CALCULATIONS ARE NEEDED
      multiDay() {
        return this.timeFrame.days > 0 ? true : false;
      },

      // GET FIRST, MIDDLE, AND FINAL EVENT DAYS WITH THEIR HOURS
      dayList() {
        let list = [];
        let start = this.timeFrame.obj;
        let endhrs = 24 - (24 - moment(start).format('H'));
        for (let i = 0; i <= this.timeFrame.days; i++) {
          if (i === 0) {
            // console.log('pushing first')
            // PUSH FIRST AT INDEX 0
            list.push({
              obj: moment(start),
              date: moment(start).format('D'),
              weekday: moment(start).format('ddd'),
              month: moment(start).format('MMM'),
              startHour: moment(start).format('h:mm a'),
              // endHour: '11:00pm',
              hours: 24 - moment(start).format('H')
            });
          } else if (i === this.timeFrame.days && i !== 0) {
            // PUSH LAST AT FINAL INDEX
            list.push({
              obj: moment(start).add(i, 'days'),
              date: moment(start).add(i, 'days').format('D'),
              weekday: moment(start).add(i, 'days').format('ddd'),
              month: moment(start).add(i, 'days').format('MMM'),
              startHour: '12:00am',
              // endHour: moment('12:00am', 'h:mm a').add(this.timeFrame.hours, 'hours').format('h:mm a'),
              hours: this.timeFrame.hours + endhrs
            });
          } else {
            // ELSE PUSH MIDDLE
            list.push({
              obj: moment(start).add(i, 'days'),
              date: moment(start).add(i, 'days').format('D'),
              weekday: moment(start).add(i, 'days').format('ddd'),
              month: moment(start).add(i, 'days').format('MMM'),
              startHour: '12:00am',
              hours: 24
            });
          }
        }
        return this.timeFrame.days > 0 ? list : [this.timeFrame];
      },

      // PROVIDE EVENT BLOCK PROPERTIES FOR SIZING AND PLACEMENT
      eventStruct() {
        let events = [];
        for (let i = 0; i < this.events.length; i++) {
          let days = 0;
          let hours = 0;
          let minutes = 0;
          let sh = moment(this.events[i].starts).format('H');
          let diff = moment(this.events[i].ends).diff(this.events[i].starts, 'minutes', true);
          let hrs = diff / 60;
          if ((23 - sh) + hrs > 23) {
            days = Math.max(Math.floor(diff / 1440), 2);
          } else {
            hours = Math.floor(hrs);
            minutes = diff - (hours * 60);
          }
          events.push({...this.events[i], ...{days: days, hours: hours, minutes: minutes}});
        }
        return events;
      },
      eventItems() {
        return this.events;
      }
    },
    methods: {
      editScheduleItem(value, index) {
        this.editIndex = index;
        this.createDialog = !this.createDialog;
        this.eventModel = Object.assign({}, value);
      },
      slotStyle(hours) {
        // console.log('repeat(' + hours + ', ' + this.boxHeight + 'px)')
        return {
          gridTemplateRows: 'repeat(' + hours + ', ' + this.boxHeight + 'px)'
        };
      },
      // CREATE NEW SCHEDULE ITEM
      createItem(day, idx) {
        this.editIndex = -1;
        this.loc_uuid = this.getUUID;
        // console.log('creating item', day, idx, this.loc_uuid)
        this.createDialog = !this.createDialog;
        this.createIndex = idx;
        this.eventModel = Object.assign({}, {
          name: 'Untitled',
          description: '',
          starts: date.addToDate(day, {hours: idx}),
          ends: date.addToDate(day, {hours: idx + 1}),
        });
      },
      saveItem(value) {
        this.$emit('scheduleItem', value);
        this.createIndex = 0;
        this.editIndex = -1;
        setTimeout(() => this.createDialog = false, 300);
      },
      // GET HOUR SLOTS FOR EACH DAY
      returnHours(index, hour) {
        let a = this.dayList[index].startHour;
        // console.log('returnHours', moment(a, 'h:mm a').add(hour - 1, 'hours').format('h:mma'))
        return moment(a, 'h:mm a').add(hour - 1, 'hours').format('h:mma');
      },

      // FORWARD / BACK 1 DAY
      minusIndex() {
        this.dayIndex > 0 ? this.dayIndex-- : alert('That\'s the first day of the event');
      },
      addIndex() {
        this.dayIndex < this.timeFrame.days ? this.dayIndex++ : alert('That\'s the last day of the event');
      },

      // GENERATE EVENT BLOCKS IN TIME SLOTS
      // eventBlocks(day, hour) {
      //   let d = moment(day).format('dddd');
      //   let h = moment(hour, 'h').format('h:mm a');
      //   let date = moment(d + ' ' + h, 'dddd h:mm a');
      //   let di = date._i
      //   let eventList = this.eventStruct.filter(a => a.start._i === di);
      //   return eventList
      // },
      eventBlocks(day, hour) {
        // let d = moment(day).format('ll');
        let h = moment(day.obj).add(hour - 1, 'hours').format('H');
        // console.log('hour', h)
        let eventList = [];
        for (let i = 0; i < this.eventItems.length; i++) {
          let start = this.eventItems[i].starts && this.eventItems[i].starts.date ? this.eventItems[i].starts.date : moment('01/01/1970', 'MM/DD/YYYY');
          // console.log('start', moment(start).format('H'))
          if (moment(start).isSame(moment(day.obj), 'date') && moment(start).format('H') === h) {
            // console.log('got one!', this.eventItems[i]);
            eventList.push(this.eventItems[i]);
          }
        }
        // eslint-disable-next-line no-console
        // eventList.length ? console.log('eventBlocks', eventList) : '';
        return eventList.length > 0 ? eventList : '';
      },
    }


  };
</script>

<style scoped>
  .header {
    min-height: 40px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    font-size: 1.2rem;
    font-weight: 700;
    z-index: 1;
  }

  .header p {
  }

  .container {
    width: 100%;
    max-height: 100%;
    overflow-y: scroll;
    padding: 5%;
    display: flex;
    flex-direction: column;
    /*border-style: solid;*/
    /*border-color: #9E9E9E;*/
    /*border-width: 0.5px;*/
    border-radius: 10px;
  }

  .time_grid {
    display: grid;
    grid-template-columns: 100fr;
    position: relative
  }

  .time_slot {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    position: relative;
    border-bottom-style: solid;
    border-bottom-color: #9E9E9E;
    border-bottom-width: 0.5px;
    border-top-color: #9E9E9E;
    border-top-width: 0.5px;
  }

  .time_slot p {
    position: absolute;
    top: 2px;
    left: 2px;
  }

  .item_wrap {
    height: 100%;
    width: 100%;
    position: relative;
    margin: 0% 1% 0% 1%;
  }

  .set_box {
    position: absolute;
    top: 5px;
    left: 10%;
    z-index: 20;
  }

  .edit_box {
    width: 600px;
    max-width: 100%;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 30;
    box-shadow: 0 0 10px #424242;
    background-color: white;
    border-radius: 5px;
    padding: 2%;
  }

</style>
