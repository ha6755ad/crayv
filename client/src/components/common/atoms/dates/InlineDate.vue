<template>
  <q-card flat :dark="dark">
    <q-input
      :dark="dark"
      :outlined="outlined"
      :label="label"
      :value="useValue"
      :input-class="inputClass"
      :dense="dense"
    >
      <q-popup-proxy>
        <vue-ctk-date-time-picker
          only-date
          inline
          :format="displayFormat"
          :value="useValue"
          @input="handleInput"
          :dark="dark"
          :color="color"
          :buttonColor="buttonColor"
          :noButton="noButton"
          :right="right"
          :noButtonNow="noButtonNow"
          :overlay="overlay"
          :autoClose="autoClose"
          :noHeader="noHeader"
          :inputSize="inputSize"
        ></vue-ctk-date-time-picker>
      </q-popup-proxy>
    </q-input>
  </q-card>
</template>

<script>
  import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';

  export default {
    name: 'InlineDate',
    components: { VueCtkDateTimePicker },
    props: {
      dense: { type: Boolean, default: true },
      inputClass: String,
      outlined: Boolean,
      label: { type: String, default: 'Choose Date' },
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
      displayFormat: {type: String, default: 'DD MMM, YYYY'},
      value: [Date, String]
    },
    data(){
      return {
      };
    },
    computed: {
      useValue() {
        let date = this.value;
        if(this.dateFormat) date = this.extractDate(this.value, this.dateFormat);
        return this.getDateFormat(date, this.displayFormat);
      }
    },
    methods: {
      handleInput(val){
        let time = this.getDateFormat(this.value, 'Hmm');
        let date = this.getDateFormat(val, 'YY-MM-DD');
        let newDate = this.extractDate(date + ' ' + time, 'YY-MM-DD Hmm');

        let payload = newDate;
        if(this.format) payload = this.getDateFormat(newDate, this.format);
        this.$emit('input', payload);
      }
    }
  };
</script>

<style scoped lang="scss">

</style>
