<template>
  <q-card flat :dark="dark">
    <div class="row items-center">
    <div :class="`col-${cols} col-sm-${sm} col-md-${md} col-lg-${lg} col-xl-${xl} q-pa-sm`">
      <in-line-date label="From (date)" v-bind="startProps" @input="handleStart"></in-line-date>
    </div>
    <div :class="`col-${cols} col-sm-${sm} col-md-${md} col-lg-${lg} col-xl-${xl} q-pa-sm`">
      <inline-time  label="@ (time)" v-bind="startProps" @input="handleStart"></inline-time>
    </div>

    <div :class="`col-${cols} col-sm-${sm} col-md-${md} col-lg-${lg} col-xl-${xl} q-pa-sm`">
      <in-line-date  label="To (date)" v-bind="endProps" @input="handleEnd"></in-line-date>
    </div>
    <div :class="`col-${cols} col-sm-${sm} col-md-${md} col-lg-${lg} col-xl-${xl} q-pa-sm`">
      <inline-time  label="@ (time)" v-bind="endProps" @input="handleEnd"></inline-time>
    </div>
    </div>
    <div class="row justify-end q-pa-sm" v-if="requireSave">
      <q-btn label="save" size="sm" push glossy color="primary" @click="$emit('input', localDate)"></q-btn>
    </div>
  </q-card>
</template>

<script>
  import InLineDate from './inLineDate';
  import InlineTime from './inlineTime';
  export default {
    name: 'InlinePicker',
    components: { InlineTime, InLineDate },
    props: {
      cols: { type: Number, default: 12 },
      sm: { type: Number, default: 6 },
      md: { type: Number, default: 3 },
      lg: { type: Number, default: 3 },
      xl: { type: Number, default: 3 },
      minuteInterval: { type: Number, default: 5 },
      requireSave: Boolean,
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
      dateDisplay: { type: String, default: 'DD MMM, YYYY' },
      timeDisplay: {type: String, default: 'h:mm a'},
      value: Object,
      outlined: Boolean
    },
    data(){
      return {
        localDate: new Date()
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal){
          if(newVal) this.localDate = newVal;
        }
      }
    },
    computed: {
      startProps(){
        let obj = Object.assign({}, this.$props);
        obj.value = this.lget(this.localDate, 'start', new Date());
        return obj;
      },
      endProps(){
        let obj = Object.assign({}, this.$props);
        obj.value = this.lget(this.localDate, 'end', new Date());
        return obj;
      },
    },
    methods: {
      handleStart(date){
        let val = this.localDate ? Object.assign({}, this.localDate) : {};
        val.start = date;
        console.log('emit start', val, date);
        this.localDate = val;
        if(!this.requireSave) {
          this.$emit('input', val);
        }
      },
      handleEnd(date){
        let val = this.localDate ? Object.assign({}, this.localDate) : {};
        val.end = date;
        this.localDate = val;
        if(!this.requireSave) {
          this.$emit('input', val);
        }
      }
    }
  };
</script>
