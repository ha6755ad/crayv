<template>
  <div :class="`inline_time ${textClass}`" :style="{color: color}">
    <div class="text-grey-8 text-uppercase text-0-7 text-weight-light q-mr-sm">{{ end ? 'end' : 'start' }}</div>
    <div :class="textClass">{{ hour }}
      <q-menu>
        <q-list>
          <q-item v-for="i in hours" :key="`hour-${i}`" clickable @click="emitChange(i, minute, ampm)">
            <div class="row justify-center items-center">{{ i }}</div>
          </q-item>
        </q-list>
      </q-menu>
    </div>
    :
    <div :class="textClass">{{ minute }}&nbsp;
      <q-menu>
        <q-list>
          <div class="bg-grey-8 text-white">
            <div style="width: 100%" class="row justify-around items-center text-0-7 text-weight-bold">
              <div class="text-center q-pa-xs pointer" @click="minInterval = 1">+1</div>
              <q-separator dark vertical/>
              <div @click="minInterval = 15" class="text-center q-pa-xs pointer">+15</div>
            </div>
          </div>
          <q-item v-for="min in mins" :key="`minute-${min}`" clickable @click="emitChange(hour, min, ampm)">
            <div class="row justify-center items-center">:{{ showMin(min) }}</div>
          </q-item>
        </q-list>
      </q-menu>
    </div>
    <div :class="textClass" @click="changeAmPm">{{ ampm }}</div>
  </div>
</template>

<script>
// import moment from 'moment';

  const { date } = require('quasar');
  const { formatDate, isValid, adjustDate, extractDate } = date;

  export default {
    props: {
      textColor: String,
      textClass: {
        type: String,
        default: 'text-xs text-mb-sm text-weight-medium pointer'
      },
      fontSize: {
        type: Number,
        default: 20
      },
      label: String,
      preIcon: String,
      startDate: Date,
      endDate: Date,
      end: {
        type: Boolean,
        default: false
      },
      time: {
        type: String,
        default: formatDate(new Date(), 'h:mm a')
      },
      width: {
        type: [Number, String],
        default: 60
      },
      endErrors: {
        type: Boolean,
        default: false
      },
      starter: {
        type: [Date, String],
        default: function () {
          return new Date();
        }
      },
      value: {
        type: [Date, String],
      },
      solo: {
        type: Boolean,
        default: false
      },
      outlined: {
        type: Boolean,
        default: false
      }
    },
    mounted() {

    },
    data() {
      return {
        minInterval: 15,
        searchInput: null,
        timeEntry: null,
        dateObj: new Date(),
        hour: formatDate(new Date(), 'H'),
        minute: formatDate(new Date(), 'mm'),
        ampm: formatDate(new Date(), 'a')
      };
    },
    watch: {
      value: {
        immediate: true,
        deep: true,
        handler(newVal) {
          let val;
          if (isValid(newVal)) val = newVal;
          else val = extractDate(newVal);
          let hour = parseInt(formatDate(val, 'h'));
          this.minute = formatDate(val, 'mm');
          this.ampm = formatDate(val, 'a');
          this.hour = hour;
          console.log('handled value', val, hour, this.minute, this.ampm);
        }
      }
    },
    computed: {
      hours() {
        let list = [];
        let start = this.end && this.startDate ? parseInt(formatDate(this.startDate, 'H')) : 0;
        if (start > 12) start -= 12;
        for (let i = 1; i < 13; i++) {
          let test = i;
          if(this.ampm === 'pm') test = i + 12;
          if (test > start) list.push(i);
        }
        return list;
      },
      mins() {
        let int = 60 / this.minInterval;
        let list = [];
        let hour = 25;
        let startH = 0;
        let start = 0;
        if (this.end) {
          hour = this.ampm === 'pm' ? this.hour + 12 : this.hour;
          startH = this.startDate ? parseInt(formatDate(this.startDate, 'H')) : 0;
          start = this.startDate ? parseInt(formatDate(this.startDate, 'mm')) : 0;
        }
        for (let i = 0; i < int; i++) {
          let num = i * this.minInterval;
          if (num < 60 && (hour > startH || num > start)) list.push(num);
        }
        return list;
      },
      color() {
        return this.textColor ? this.textColor : '#0b3153';
      },
      endRules() {
        return [
          !this.endErrors || 'Cannot be before start time'
        ];
      }
    },
    methods: {
      showMin(i) {
        if (i < 10 && i.toString().length < 2) return '0' + i;
        else return i;
      },
      changeAmPm() {
        let newampm = this.ampm === 'am' ? 'pm' : 'am';
        this.emitChange(this.hour, this.minute, newampm);
      },
      filterFn(val) {
        if (val) {
          if (typeof val === 'string') {
            this.searchInput = val;
          } else this.searchInput = val.toString();
        } else this.searchInput = null;
      },
      emitChange(hour, minute, ampm) {
        let t = hour + ':' + minute + ' ' + ampm;
        if (ampm === 'pm') hour += 12;
        console.log('emitting change', t, hour, minute, ampm, this.dateObj);
        let r = adjustDate(this.dateObj, { hours: hour, minutes: minute });
        console.log('got valid time', r);
        const finish = (dt) => {
          console.log('got valid date', dt);
          this.dateObj = dt;
          this.timeEntry = formatDate(r, 'h:mm a');
          let payload = dt;
          console.log('emitting payload', dt);
          this.$emit('input', payload);
          if (ampm === 'pm') hour = parseInt(hour) + 12;
          this.hour = hour;
          this.minute = this.showMin(minute);
          this.ampm = ampm;
        };
        const timeErr = (msg) => {
          this.$q.notify({
            message: msg ? msg : 'Invalid Time', color: 'info'
          });
        };

        if (this.end) {
          let start = this.startDate;
          if (isValid(r)) {
            if (!start || r > start) finish(r);
          } else timeErr('Choose a time after the event start date');
        } else {
          finish(r);
        }
      }
    }
  };

</script>

<style scoped>
.inline_time {
  width: 100%;
  justify-content: center;
  display: flex;
  height: 40px;
  align-items: center;
}

</style>
