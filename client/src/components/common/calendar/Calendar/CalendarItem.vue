<template>
  <!--  <div class="pseudo_slot">-->
  <div @click.stop="$emit('open', eventIn)" class="pointer" style="position: relative; width: 100%; height: 100%">
    <!--    <template v-if="timeTest">-->
    <!--      <div :style="slotStyle" :class="!outlined ? 'slot full' : 'slot outlined'" @click.stop="editEvent(eventIn)">-->
    <!--        <div>-->
    <!--          <p class="caption" :style="{color: outlined ? 'var(&#45;&#45;q-color-secondary)' : 'white'}">{{eventIn.name}}</p>-->
    <!--        </div>-->
    <!--        <div class="crayv_text">{{vendorMessage + ' ' + lineup.length + ' Menu Items'}}</div>-->
    <!--      </div>-->
    <!--    </template>-->
    <template>
      <div :class="`start_line text-white`">
        <div class="t-r row items-center">
          <q-btn icon="mdi-pencil-box" round flat size="xs"
                 v-if="isAdmin(groupIn) || lget(eventIn, 'createdBy', '*') === lget(user, '_id', null)"
                 @click.stop="$emit('edit')"/>
        </div>
        <div class="text-weight-bold text-xs text-mb-xs">
          <v-clamp :max-lines="2" :autoresize="true">
            {{ lget(eventIn, 'name', 'Untitled') }}
          </v-clamp>
        </div>
        <q-tooltip>{{ lget(eventIn, 'name', 'Untitled') }}</q-tooltip>
      </div>
    </template>
  </div>
  <!--  </div>-->
</template>

<script>
  import {mapState} from 'vuex';
  // import moment from 'moment';
  const { date } = require('quasar');
  // eslint-disable-next-line no-unused-vars
  const { formatDate, subtractFromDate, addToDate, daysInMonth, getDayOfWeek, getDateDiff } = date;
  import VClamp from 'vue-clamp';

  export default {
    name: 'CalendarItem',
    components: { VClamp },
    data() {
      return {
      // detailDialog: false
      };
    },
    props: {
      groupIn: Object,
      startHour: Number,
      hour: Number,
      outlined: Boolean,
      eventIn: {
        type: Object,
        default: function () {
          return {
            color: '#2196F3',
            name: 'NoName Event',
            minutes: 0,
            hours: 1,
            days: 0
          };
        }
      },
      lineup: {
        type: Array,
        default: function () {
          return [];
        }
      },
      boxHeight: {
        type: Number,
        default: 50
      },
    // topTime: {
    //   type: [Number, String],
    //   default: 5
    // }
    },
    watch: {
      days: {
        immediate: true,
        handler(newVal) {
          return newVal > 0 ? this.allDay : '';
        }
      }
    },
    computed: {
      ...mapState('auth', { user: 'user' }),
      vendorMessage() {
        // let v = this.lineup.vendors.length;
        // return v === 1 ? v + ' vendor' : v + ' vendors'
        return 'Vendor Count';
      },
      detailDialog() {
        return this.$route.params.eventId;
      },
      // check
      marginTopCalc() {
        let minute = formatDate(this.eventIn.starts, 'm');
        // let minute = moment(this.eventIn.starts).format('mm');
        let margin = minute < 60 ? (minute / 60) * this.boxHeight : 0;
        return margin;
      },
      slotHeight() {
        return 100;
        // let min = this.minutes < 60 ? this.minutes / 60 : 0;
        // return this.hours === 0 && this.days === 0 ? min * 100 : this.days === 0 ? min * 100 + this.hours * 100 : 10;
      },

      // how many calendar days the event extends through
      //check
      days() {
        if (!this.eventIn.starts || !this.eventIn.ends) {
          return 0;
        } else {
          let s = this.eventIn.starts;
          let h = parseInt(formatDate(s, 'HH'));
          // let h = parseInt(moment(s).format('H'));
          let min = getDateDiff(this.eventIn.ends, this.eventIn.starts, 'minutes');
          // let min = moment(this.eventIn.ends).diff(this.eventIn.starts, 'minutes', true);
          let hrs = min / 60;
          // console.log('hrs', hrs, min, h);
          return Math.floor((h + hrs) / 24) || 0;
        }
      },
      // return the hours an actual event block should cover. If the event is multiple days it should be 0
      // check
      hours() {
        if (!this.eventIn.ends || !this.eventIn.ends) {
          return 0;
        } else if (this.days === 0) {
          let min = getDateDiff(this.eventIn.ends, this.eventIn.starts, 'minutes');
          // let min = moment(this.eventIn.ends).diff(this.eventIn.starts, 'minutes', true);
          console.log('getting hours', min);
          return Math.floor(min / 60);
        } else {
          return 0;
        }
      },
      //check
      minutes() {
        if (!this.eventIn.ends || !this.eventIn.ends) {
          return 0;
        } else if (this.days === 0) {
          // get end minutes 'mm'
          let em = formatDate(this.eventIn.ends, 'm');
          // let em = moment(this.eventIn.ends).format('mm');
          // get start minutes 'mm'
          let sm = formatDate(this.eventIn.starts, 'm');
          // let sm = moment(this.eventIn.starts).format('mm');
          // get difference accounting for that fact that 15 can be 30 ahead or behind 45 depending on the hour, but the end mm can never be less than the start mm unless its in the next hour
          let test = em > sm ? em - sm : 60 - Math.abs(em - sm) || 0;
          return test !== 60 ? test : 0;
        } else {
          return 0;
        }
      },
      timeTest() {
        return this.hours > 0 || this.days > 0 || this.minutes > 1;
      },
      slotStyle() {
        return {
          height: this.slotHeight + '%',
          marginTop: this.marginTopCalc + 'px'
        };
      }
    },
    methods: {
      editEvent() {
        this.$emit('edit');
      },
      allDay() {
        this.$emit('allDay', this.event);
      }
    }
  };
</script>

<style scoped>
/*.start_line {*/
/*  cursor: pointer;*/
/*  position: absolute;*/
/*  border-radius: 3px;*/
/*  width: 100%;*/
/*  height: 100%;*/
/*  display: grid;*/
/*  opacity: 0.7;*/
/*  align-items: center;*/
/*  text-align: center;*/
/*  font-size: 12px;*/
/*  color: white;*/
/*  z-index: 20;*/
/*  transition: transform .2s;*/
/*}*/

/*.start_line:hover {*/
/*  transform: scale(1.06);*/
/*}*/

/*.slot {*/
/*  width: 100%;*/
/*  top: 0;*/
/*  left: 0;*/
/*  border-radius: 5px;*/
/*  position: absolute;*/
/*  margin-left: 1%;*/
/*  z-index: 18;*/
/*}*/

.full {
  background-color: rgba(104, 164, 235, .8);
}

.outlined {
  background-color: transparent;
  border-style: solid;
  border-width: 2px;
  border-color: rgba(104, 164, 235, .8);
}

.slot:hover {
  z-index: 19;
  box-shadow: 1px 1px 3px #9E9E9E;
}

.pseudo_slot {
  height: 100%;
  width: 100%;
  /*padding: 0%;*/
  display: flex;
  padding-bottom: 1%;
  padding-right: 8%;
}

.crayv {
  position: absolute;
  height: 25px;
  width: 25px;
  overflow: hidden;
  bottom: 2px;
  right: 2px;
  transform: scale(1);
  /*filter: brightness(1000%);*/
}

.crayv img {
  height: 100%;
}

.crayv_text {
  display: none;
  padding: 6px;
  background-color: rgba(255, 69, 119, .7);
  border-radius: 5px;
  top: -30px;
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
  color: white;
  text-transform: uppercase;
  font-size: 10px;
  font-weight: 600;
  right: 0;
}

.crayv:hover {
  transform: scale(2);
  filter: none;
  transition: transform .3s ease-out;
}

.crayv:hover ~ .crayv_text {
  display: inline;
}


</style>
