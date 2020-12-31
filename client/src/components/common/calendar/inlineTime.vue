<template>
  <div class="inline_time" :style="{fontSize: fontSize + 'px'}">
    <q-select
      use-input
      new-value-mode="add-unique"
      hide-bottom-space
      @keyup.enter="emitChange(timeEntry)"
      :filterFn="filterFn"
      :input-style="{ height: '30px', width: width + 'px' }"
      :bg-color="endErrors ? '#FFCDD2' : '#FAFAFA'"
      :rules="endRules"
      :options="times"
      dense
      :value="timeEntry"
      @input="emitChange"
      @input-value="() => timeEntry = ''"
      :outlined="outlined"
    ></q-select>
  </div>
</template>

<script>
// import moment from 'moment';

  const { date } = require('quasar');
  const { formatDate, isValid, buildDate, extractDate, adjustDate } = date;

  export default {
    props: {
      fontSize: {
        type: Number,
        default: 20
      },
      label: String,
      preIcon: String,
      end: {
        type: Boolean,
        default: false
      },
      time: {
        type: String,
        default: formatDate(new Date(), 'h:mm a')
      },
      timeList: {
        type: Object,
        default: function () {
          return {
            date: new Date(),
            hourslots: 96,
            start: 5,
          };
        }
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
      let value = this.value ? this.value : new Date();
      this.timeEntry = isValid(value) ? formatDate(value, 'h:mm a') : formatDate(extractDate(value.toString()), 'h:mm a');
    },
    data() {
      return {
        searchInput: null,
        timeEntry: null,
        dateObj: new Date(),
        timeListCopy: null
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal) {
          this.setTime(newVal);
        }
      },
      timeList: {
        immediate: true,
        handler(newVal) {
          this.timeListCopy = newVal;
        }
      }
    },
    computed: {
      endRules() {
        return [
          !this.endErrors || 'Cannot be before start time'
        ];
      },
      times() {
        let list = [];
        let t = this.timeListCopy.hourslots;
        let s = this.timeListCopy.start;
        let diff = t - (s - 1);
        for (let i = 0; i < 24; i++) {
          let num = t / 24;
          for (let n = 0; n < num; n++) {
            let min = (60 / num) * n;
            let dt = buildDate({ hours: i + s, minutes: min });
            if(!this.end || !this.startDate || dt > this.startDate) {
              if (i < diff) {
                list.push(formatDate(dt, 'h:mm a'));
              } else {
                list.push(formatDate(buildDate({ hours: i - (t - s), minutes: min }), 'h:mm a'));
              }
            }
          }
        }
        return list;
      },
    },
    methods: {
      filterFn(val) {
        if (val) {
          if (typeof val === 'string') {
            this.searchInput = val;
          } else this.searchInput = val.toString();
        } else this.searchInput = null;
      },
      setTime(value) {
        console.log('checking if value is valid when setting time', isValid(value));
        if (isValid(value)) {
          this.timeEntry = formatDate(value, 'h:mm a');
          this.dateObj = value;
        // eslint-disable-next-line no-console
        } else console.log('inlineTime passed invalid time');
      },
      emitChange(val) {
        this.timeEntry = val;
        let t = val.toString().toLowerCase();
        let r = null;
        let valid = false;
        let list = ['h', 'h m', 'hm', 'hmm', 'h:m', 'hh', 'hhmm', 'hhm', 'h:mm', 'hh:mm', 'h:mm a', 'h:mm A', 'hh:mm a', 'hh:mm A', 'hmm a', 'hmm A', 'hhmm a', 'hhmm A', 'h:mma', 'hh:mma', 'h:ma', 'h:m a'];
        for (let i = 0; i < list.length; i++) {
          let extract = extractDate(t.toString(), list[i]);
          if (!valid && formatDate(extract, list[i]) === t.toString()) {
            valid = true;
            let h = formatDate(extract, 'H');
            let m = formatDate(extract, 'm');
            r = adjustDate(this.dateObj, { hours: h, minutes: m });
            console.log('got valid time', t, h, m, r);
          } else if(!valid && i === list.length - 1) this.$q.notify({message: 'Time format not recognized - try h:mm a', color: 'info'});
        }
        if (isValid(r)) {
          console.log('got valid date', r);
          this.dateObj = r;
          this.timeEntry = formatDate(r, 'h:mm a');
          let payload = r;
          console.log('emitting payload', r);
          this.$emit('input', payload);
        } else this.$q.notify({message: `invalid time ${r}`, color: 'info'});
      }
    }
  };

</script>

<style scoped>
.inline_time {
  display: flex
}

</style>
