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
    <div>
      <q-btn dense flat @click="setRules = !setRules" :style="{ color: setRules === 0 ? 'var(--ir-grey-6)' : 'var(--q-color-nice)' }" class="q-pa-sm q-mr-sm"
             icon="mdi-repeat"></q-btn>
      <q-slide-transition>
        <div v-if="setRules">
          <r-rule-form :dark="dark" @input="handleRecurrence" :value="form.recurrence"></r-rule-form>
        </div>
      </q-slide-transition>
    </div>
    <div class="row justify-end q-pa-sm" v-if="requireSave">
      <q-btn label="save" size="sm" push glossy color="primary" @click="$emit('input', form)"></q-btn>
    </div>
  </q-card>
</template>

<script>
  import InLineDate from './inLineDate';
  import InlineTime from './inlineTime';
  import RRuleForm from 'components/common/recurrance/RRuleForm';
  export default {
    name: 'InlinePicker',
    components: { RRuleForm, InlineTime, InLineDate },
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
        form: { start: new Date(), end: new Date(), recurrence: undefined },
        setRules: false
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal){
          if(newVal) this.form = newVal;
        }
      }
    },
    computed: {
      startProps(){
        let obj = Object.assign({}, this.$props);
        obj.value = this.lget(this.form, 'start', new Date());
        return obj;
      },
      endProps(){
        let obj = Object.assign({}, this.$props);
        obj.value = this.lget(this.form, 'end', new Date());
        return obj;
      },
    },
    methods: {
      handleStart(date){
        let val = this.form ? Object.assign({}, this.form) : {};
        val.start = date;
        console.log('emit start', val, date);
        this.form = val;
        if(!this.requireSave) {
          this.$emit('input', val);
        }
      },
      handleRecurrence(val){
        console.log('handle recurrence', val);
        this.form.recurrence = val;
        if(!this.requireSave) {
          this.$emit('input', this.form);
        }
      },
      handleEnd(date){
        let val = this.form ? Object.assign({}, this.form) : {};
        val.end = date;
        this.form = val;
        if(!this.requireSave) {
          this.$emit('input', val);
        }
      }
    }
  };
</script>
