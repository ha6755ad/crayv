<template>
  <q-card flat :dark="dark">
    <q-select
      :dark="dark"
      :label="label"
      use-input
      new-value-mode="add-unique"
      hide-bottom-space
      :input-style="{ height: '30px' }"
      :bg-color="endErrors ? '#FFCDD2' : '#FAFAFA'"
      :rules="endRules"
      :options="times"
      :dense="dense"
      :value="useValue"
      @input="handleInput"
      @input-value="searchInput = $event"
      :outlined="outlined"
    >
      <template v-slot:selected-item>
        <q-chip :dark="dark" removable @remove="handleInput(null)" v-show="useValue" icon="mdi-clock" :label="useValue"></q-chip>
      </template>
      <template v-slot:option="scope">
        <q-item clickable @click="handleInput(scope.opt)">
          <q-item-section>
            <q-item-label>{{parseDateHour(scope.opt, displayFormat)}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator></q-separator>
      </template>
    </q-select>
<!--    <vue-ctk-date-time-picker-->
<!--      only-time-->
<!--      :inline="inline"-->
<!--      :format="displayFormat"-->
<!--      :value="useValue"-->
<!--      @input="handleInput"-->
<!--      :dark="dark"-->
<!--      :color="color"-->
<!--      :buttonColor="buttonColor"-->
<!--      :noButton="noButton"-->
<!--      :right="right"-->
<!--      :noButtonNow="noButtonNow"-->
<!--      :overlay="overlay"-->
<!--      :autoClose="autoClose"-->
<!--      :noHeader="noHeader"-->
<!--      :inputSize="inputSize"-->
<!--      :minute-interval="minuteInterval"-->
<!--      :label="label"-->
<!--    ></vue-ctk-date-time-picker>-->
  </q-card>
</template>

<script>

  export default {
    name: 'InlineTime',
    components: { },
    props: {
      dense: { type: Boolean, default: true },
      endErrors: Boolean,
      outlined: Boolean,
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
      displayFormat: {type: String, default: 'h:mm a'},
      value: [Date, String]
    },
    data(){
      return {
        interval: 15,
        searchInput: ''
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
        if(this.dateFormat) date = this.extractDate(this.value, this.dateFormat);
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
        return list;
      },
    },
    methods: {
      handleInput(val) {
        if (val || val === 0) {
          let date = this.getDateFormat(this.value, 'YY-MM-DD');
          let newDate = this.extractDate(date + ' ' + String(val), 'YY-MM-DD Hmm');

          let payload = newDate;
          if (this.format) payload = this.getDateFormat(newDate, this.format);
          console.log('sending time', val, payload);
          this.$emit('input', payload);
        } else this.$emit('input', null);
      }
    }
  };
</script>

<style scoped lang="scss">

</style>
