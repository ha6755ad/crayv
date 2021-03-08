<template>
  <q-card flat :dark="dark" style="cursor:pointer" class="q-pa-xs">
    <div class="text-xxxs text-mb-xxxs text-weight-light">{{ label }}</div>
    <q-chip
      icon-right="mdi-menu-down"
      icon="mdi-clock"
      :square="square"
      :dark="dark"
      :label="useValue ? useValue : 'No Time...'"
      :color="endErrors ? 'negative' : color ? color : dark ? 'dark' : 'light'"
      :size="dense ? 'md' : 'lg'"
      :outline="outline"
      :removable="!!useValue"
      @remove="handleInput(null)"
    >
      <q-popup-proxy>
        <q-list separator>
          <q-item>
            <q-input label="Enter Time..." dense v-model="searchInput" @keyup.enter="addTime(searchInput)">
            </q-input>
          </q-item>
          <q-item clickable @click="handleInput(opt)" v-for="(opt, i) in times" :key="`time-opt-${i}`">
            <q-item-section>
              <q-item-label>{{ parseDateHour(opt, displayFormat) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-popup-proxy>
    </q-chip>

  </q-card>
</template>

<script>

  export default {
    name: 'InlineTime',
    components: {},
    props: {
      square: Boolean,
      borderless: Boolean,
      dense: { type: Boolean, default: true },
      endErrors: Boolean,
      outline: Boolean,
      label: { type: String, default: 'Choose Time' },
      minuteInterval: { type: Number, default: 5 },
      inputSize: String,
      dark: Boolean,
      color: String,
      buttonColor: String,
      noButton: Boolean,
      right: Boolean,
      noButtonNow: Boolean,
      overlay: Boolean,
      autoClose: Boolean,
      noHeader: Boolean,
      textClass: { type: String, default: 'text-xs text-mb-xs' },
      borderColor: String,
      displayOff: Boolean,
      inline: Boolean,
      format: String,
      dateFormat: String,
      displayFormat: { type: String, default: 'h:mm a' },
      value: [Date, String]
    },
    data() {
      return {
        interval: 15,
        searchInput: '',
        addedTimes: []
      };
    },
    computed: {
      endRules() {
        return [
          !this.endErrors || 'Cannot be before start time'
        ];
      },
      useValue() {
        let date = this.value;
        if (this.dateFormat) date = this.extractDate(this.value, this.dateFormat);
        return this.getDateFormat(date, this.displayFormat);
      },
      intervals() {
        //before changing these, see that pushTime function is using these fixed intervals for logic
        return [60, 30, 15];
      },
      times() {
        let list = [];
        for (let i = 0; i < 24; i++) {
          let intervals = this.interval ? 60 / this.interval : 1;
          for (let int = 0; int < intervals; int++) {
            let minutes = int * this.interval;
            i < 20 ? list.push(parseInt(this.getDateFormat(this.genDateHour((i + 5), minutes), 'Hmm'))) : list.push(parseInt(this.getDateFormat(this.genDateHour((i - 19), minutes), 'Hmm')));
          }
        }
        let times = list;
        if (this.searchInput && times) times = list.filter(a => {
          let str = this.searchInput.toString().replace(/\s|:/g,'');
          console.log('str', str);
          return a.toString().toLowerCase().indexOf(str.toLowerCase().trim()) > -1;
        });
        return this.addedTimes ? [...times, ...this.addedTimes] : times;
      },
    },
    methods: {
      handleInput(val) {
        if (val || val === 0) {
          let date = this.getDateFormat(this.value, 'YY-MM-DD');
          let newDate = this.extractDate(date + ' ' + String(val), 'YY-MM-DD Hmm');

          let payload = newDate;
          if (this.format) payload = this.getDateFormat(newDate, this.format);
          console.log('sending time', val, payload, this.format);
          this.$emit('input', payload);
        } else this.$emit('input', null);
      },
      checkValidTime(val) {
        let t = val.toString().toLowerCase();
        let r = null;
        let valid = false;
        let format = 'h:mm a';
        let list = ['h', 'h m', 'hm', 'hmm', 'h:m', 'hh', 'hhmm', 'hhm', 'h:mm', 'hh:mm', 'h:mm a', 'h:mm A', 'hh:mm a', 'hh:mm A', 'hmm a', 'hmm A', 'hhmm a', 'hhmm A', 'h:mma', 'hh:mma', 'h:ma', 'h:m a'];
        for (let i = 0; i < list.length; i++) {
          let extract = this.extractDate(t.toString(), list[i]);
          console.log('extract', extract, val);
          if (this.getDateFormat(extract, list[i]) === t.toString()) {
            valid = true;
            r = extract;
            format = list[i];
          }
        }
        return { valid: valid, date: r, format: format };
      },
      addTime(val) {
        let valid = this.checkValidTime(val);
        if (valid.valid) {
          let timeVal = parseInt(this.getDateFormat(valid.date, 'Hmm'));
          this.handleInput(timeVal);
          console.log('got valid time', timeVal);
        } else this.$q.notify({
          message: 'Time format not recognized - try h:mm a',
          color: 'info'
        });
      }
    }
  };
</script>

<style scoped lang="scss">

</style>
