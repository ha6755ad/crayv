<template>
  <div :class="`col-${cols} col-md-${md} q-py-md`">
    <div class="flex align-center">
      <div :style="{justifySelf: 'flex-start', width: '10%', marginRight: block_view ? '25px' : ''}">
        <q-icon v-if="icon" @click="$emit('timeClick')" name="mdi-clock"/>
      </div>
      <div :class="block_view ? 'picker_block' : 'picker_line'">
        <!--            START DATE-->
        <div :class="block_view ? 'start_date' : ''">
          <in-line-date @input="setStartDate"
                        :calendar="calendar"
                        :starter="start"
                        :value="start"
                        :dateList="dateList"
                        :width="width"
                        :top="top"
                        :right="right"
                        :left="left"
                        :calSize="calSize"
                        :absolute="absolute_date_picker"
                        :format="format"
          ></in-line-date>
        </div>
        <div :class="block_view ? 'start_time' : ''">
          <!--            START TIME-->
          <in-line-time @input="setStartTime"
                        :value="start"
          ></in-line-time>
        </div>
        <div class="to_text" v-show="!block_view">
          to
        </div>

        <!--            END TIME-->
        <div :class="block_view ? 'end_time' : ''">
          <in-line-time @input="setEndTime"
                        :value="end"
                        :endErrors="endTimeErrors"
          ></in-line-time>
        </div>
        <!--            END DATE-->
        <div :class="block_view ? 'end_date' : ''">
          <in-line-date @input="setEndDate"
                        :calendar="calendar"
                        :starter="end"
                        :value="end"
                        :endErrors="endDateErrors"
                        isEnd
                        :dateList="dateList"
                        :width="width"
                        :top="top"
                        :right="right"
                        :left="left"
                        :calSize="calSize"
                        :absolute="absolute_date_picker"
                        :format="format"
          ></in-line-date>
        </div>
      </div>
    </div>
    <div class="rules" v-if="recur">
      <q-btn dense flat @click="setRules = !setRules" :style="{ color: setRules === 0 ? '#9e9e9e' : '#2196F3' }" class="q-pa-sm q-mr-sm"
              icon="mdi-repeat"/>
      <div v-show="setRules"
           class="justify-center"
           :style="{height: block_view && recurring.code !== 0 ? '90px' : '30px', marginBottom: block_view ? '30px' : 0}">
<!--        <inline-rules :starter="start" @input="newRule" :stack="block_view"></inline-rules>-->
      <r-rule-form @input="newRule" :value="recurring"/>
      </div>
    </div>
  </div>
</template>
<script>
// import moment from 'moment';
  import RRuleForm from 'components/common/recurrance/RRuleForm';
  const {date} = require('quasar');
  const {addToDate, isValid} = date;
  import InLineDate from './inLineDate';
  import InLineTime from './inlineTime';

  export default {
    components: { RRuleForm, InLineTime, InLineDate },
    props: {
      // for inlineDate when not using calendar view - to provide a limited list of dates
      dateList: {
        type: Array,
        default: function () {
          return [
            new Date()
          ];
        }
      },
      toggle: Boolean,
      calSize: {
        type: String,
        default: '200px'
      },
      block_view: Boolean,
      icon: {
        type: Boolean,
        default: true
      },
      width: {
        type: Number,
        default: 120
      },
      cols: {
        type: Number,
        default: 12
      },
      rRuleIn: Object,
      format: {
        type: String,
        default: 'ddd, MMM-DD YYYY'
      },
      absolute_date_picker: Boolean,
      md: {
        type: Number,
        default: 12
      },
      right: {
        type: String,
      },
      left: {
        type: String,
        default: '0px'
      },
      top: {
        type: String,
        default: '80%'
      },
      starter: {
        type: [String, Date],
        default: function () {
          return new Date();
        }
      },
      model_start: {
        type: [String, Date],
        default: function(){
          return new Date();
        }
      },
      model_end: {
        type: [String, Date],
        default: function(){
          return addToDate(new Date(), {hours: 1});
        }
      },
      calendar: {
        type: Boolean,
        default: true
      },
      recur: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        // a: {
        //   b: 'd',
        //   c: {
        //     f: '',
        //     g: {
        //       j : ['acbd', {a: 'b'}],
        //     }
        //   }
        // },
        // a.c.g.j[1]
        //
        // lget(a, 'c.g.j[1]', 'cat')
        setRules: false,
        endTimeErrors: false,
        endDateErrors: false,
        start: null,
        end: null,
        recurring: {

        }
      };
    },
    mounted() {
      if(this.rRuleIn) this.recurring = Object.assign({}, this.rRuleIn);
      if (this.model_start && this.model_end) {
        this.start = this.model_start;
        this.end = this.model_end;
      }
      else {
        this.start = new Date();
        this.end = new Date();
      }
    },
    watch: {
      model_start: {
        immediate: true,
        handler(newVal) {
          if (isValid(newVal)) {
            this.start = newVal;
          // eslint-disable-next-line no-console
          } else console.log('inline picker received invalid start date', newVal);
        }
      },
      model_end: {
        immediate: true,
        handler(newVal) {
          if (isValid(newVal)) {
            this.end = newVal;
          // eslint-disable-next-line no-console
          } else console.log('inline picker received invalid end date', newVal);
        }
      },
      start: {
        immediate: true,
        handler(newVal) {
          this.recurring.start = newVal;
        }
      },
      end: {
        immediate: true,
        handler(newVal) {
          this.recurring.end = newVal;
        }
      }
    },
    computed: {
      payload() {
        return {
          start: this.start,
          end: this.end,
        };
      }
    },
    methods: {
      newRule(value) {
        this.recurring = Object.assign({}, value);
        this.$emit('recur', value);
      },
      setStartDate(value) {
        if (this.start) {
          let oldStartTime = date.formatDate(this.start, 'h:mm a');
          value = date.formatDate(value, 'YYYY-MM-DD');
          this.start = date.extractDate(`${value} --- ${oldStartTime}`, 'YYYY-MM-DD --- h:mm a');
        } else this.start = new Date();
        this.end > this.start ? console.log('no date change') : this.end = addToDate(this.start, {hours: 1});
        this.$emit('input', this.payload);
      },
      setStartTime(value) {
        if(this.start){
          let oldStartDate = date.formatDate(this.start, 'YYYY-MM-DD');
          value = date.formatDate(value, 'h:mm a');
          this.start = date.extractDate(`${oldStartDate} --- ${value}`, 'YYYY-MM-DD --- h:mm a');
        }

        this.end > this.start ? console.log('no date change') : this.end = addToDate(this.start, {hours: 1});
        this.$emit('input', this.payload);
      },
      setEndDate(value) {
        if (this.end) {
          let oldEndTime = date.formatDate(this.end, 'h:mm a');
          value = date.formatDate(value, 'YYYY-MM-DD');
          this.end = date.extractDate(`${value} --- ${oldEndTime}`, 'YYYY-MM-DD --- h:mm a');
        } else this.end = new Date();
        this.end > this.start ? console.log('no date change') : this.end = addToDate(this.start, {hours: 1});
        this.$emit('input', this.payload);
      },
      setEndTime(value) {
        if(this.end){
          let oldEndDate = date.formatDate(this.end, 'YYYY-MM-DD');
          value = date.formatDate(value, 'h:mm a');
          this.end = date.extractDate(`${oldEndDate} --- ${value}`, 'YYYY-MM-DD --- h:mm a');
        }
        this.end > new Date(this.start) ? console.log('no date change') : this.end = addToDate(this.start, {hours: 1});
        this.$emit('input', this.payload);
      }
    }
  };
</script>

<style scoped lang="scss">
.picker_line {
  width: 100%;
  display: flex;
  align-items: center
}

.picker_block {
  width: 100%;
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: 40px 40px;
  grid-row-gap: 10px;
}

.rules {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.to_text {
  margin-right: 10px;
  margin-left: 10px;
}

.to_text_grid {
  margin-right: 10px;
  margin-left: -20px;
  grid-column-start: 2;
  grid-row-start: 2;
}

.start_date {
  grid-column-start: 2;
  grid-row-start: 1;
}

.start_time {
  grid-column-start: 1;
  grid-row-start: 1;
  /*justify-self: end;*/
}

.end_date {
  margin-top: 10px;
  grid-column-start: 2;
  grid-row-start: 2;
  align-self: end;
}

.end_time {
  grid-column-start: 1;
  grid-row-start: 2;
  /*justify-self: end;*/
  align-self: end;
  display: flex;
}
</style>
