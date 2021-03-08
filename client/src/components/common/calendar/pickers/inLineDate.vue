<template>
  <div class="inline_date"
       :style="{fontSize: fontSize + 'px', position: absolute ? '' : 'relative'}">
    <div v-if="calendar">
      <q-input v-if="!button"
               dense
               :input-style="{ width: width + 'px', maxHeight: '100%' }"
               :bg-color="endErrors ? '#FFCDD2' : '#FAFAFA'"
               :rules="endRules"
               :placeholder="placeholder"
               @input.native="$emit('input', $event.target.value)"
               @click="dateBox = !dateBox"
               :value="dateEntry"
               :hint="hint"
               hide-bottom-space
               :label="label"
               :solo="solo"
               :outlined="outlined"
               persistent-hint
               readonly
      >
        <template v-slot:append>
          <q-icon :color="icon_color" v-if="prepend_icon" :name="prepend_icon">
          </q-icon>
        </template>
        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
          <q-date
            @input="setDT"
            v-model="datePass"
          ></q-date>
        </q-popup-proxy>
      </q-input>
      <q-btn v-if="button" flat style="margin-top: -10px" @click="dateBox = !dateBox" :abel="dateEntry"></q-btn>
    </div>
    <div v-if="!calendar">
      <q-select
        use-input
        dense
        :input-style="{ height: '30px', background: endErrors ? '#FFCDD2' : '#FAFAFA' }"
        :rules="endRules"
        :placeholder="placeholder"
        :value="dateEntry"
        :options="dateListFormat"
        :outlined="outlined"
        :label="label"
        option-label="date"
        :filterFn="filterFn"
        @input="emitChange"
      ></q-select>
    </div>
  </div>
</template>

<script>
// import moment from 'moment';
  const {date} = require('quasar');
  const {formatDate, isValid} = date;

  export default {
    components: {},
    props: {
      // for the non calendar view. Pass in available dates
      dateList: {
        type: Array,
        default: function () {
          return [
            new Date(),
          ];
        }
      },
      absolute: Boolean,
      calendar: {
        type: Boolean,
        default: true
      },
      prepend_icon: {
        type: String,
        default: 'mdi-calendar'
      },
      icon_color: String,
      starter: {
        type: [Date, String],
        default: function () {
          return new Date();
        }
      },
      button: {
        type: Boolean,
        default: false
      },
      fontSize: {
        type: Number,
        default: 20
      },
      // 'single', 'multi'
      selectSet: {
        type: String,
        default: 'single'
      },
      labelColor: {
        type: String,
        default: 'var(--primary-1-color)'
      },
      hint: String,
      label: String,
      width: {
        type: Number,
        default: 140
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
      pix: {
        type: Number,
        default: 250
      },
      calSize: {
        type: String,
        default: '200px'
      },
      value: {
        type: [String, Date]
      },
      isEnd: Boolean,
      endErrors: {
        type: Boolean,
        default: false
      },
      format: {
        type: String,
        default: 'ddd, MMM-DD YYYY'
      },
      solo: Boolean,
      outlined: Boolean
    },
    data() {
      return {
        searchInput: null,
        datePass: formatDate(new Date(), 'YYY-DD-MM'),
        dateEntry: null,
        dateListCopy: null,
        dateBox: false,
        datePick: {
          date: new Date(),
          obj: new Date()
        }
      };
    },
    watch: {
      // value: {
      //   immediate: true,
      //   handler(newVal) {
      //     this.setDate(newVal);
      //   }
      // },
      dateList: {
        immediate: true,
        handler(newVal) {
          this.dateListCopy = newVal;
        }
      }
    },
    computed: {
      placeholder() {
        return this.starter ? formatDate(this.starter, this.format) : formatDate(new Date(), this.format);
      },
      dateListFormat() {
        let dates = [];
        for (let i = 0; i < this.dateListCopy.length; i++) {
          if (this.searchInput && typeof this.searchInput !== 'undefined') {
            const needle = this.searchInput.toLowerCase();
            // console.log('needle', needle, this.optionLabel)
            if (this.dateListCopy[i].format(this.format).toString().toLowerCase().indexOf(needle) > -1) {
              dates.push({date: formatDate(this.dateListCopy[i], this.format), obj: this.dateListCopy[i]});
            }
          } else {
            dates.push({date: formatDate(this.dateListCopy[i], this.format), obj: this.dateListCopy[i]});
          }
        }
        return dates;
      },
      endRules() {
        return [
          !this.endErrors || 'Cannot be before start date'
        ];
      },
      boxStyle() {
        return {
          display: 'flex',
          flexDirection: 'row',
          position: 'absolute',
          height: this.calSize,
          width: this.calSize,
          zIndex: 19,
          right: this.right,
          top: this.top,
          left: this.left,
          justifyContent: 'center'
        };
      },
      // need to build a different payload system before implementing multiple dats so that the display can differ from the payload emitted
      payload() {
        return isValid(formatDate(this.dateEntry, this.format)) ? formatDate(this.dateEntry, this.format) : '';
      }
    },
    methods: {
      filterFn(val, update) {
        if (this.dateListFormat && typeof this.dateListFormat !== 'undefined') {
          update(() => {
            // eslint-disable-next-line no-unused-vars
            let valPlug;
            if (typeof val !== 'string') {
              this.searchInput = val.toString();
            } else {
              this.searchInput = val;
            }
          // console.log('filtering', val)
          });
        }
        this.emitChange();
      },
      close() {
        this.dateBox = false;
      },
      emitChange() {
        this.dateEntry = formatDate(this.datePick.obj, this.format);
        this.$emit('input', this.payload);
      },
      setDate(value) {
        // eslint-disable-next-line no-console
        isValid(value) ? this.dateEntry = formatDate(value, this.format) : console.log('inlineDate passed invalid date');
      },
      setDT(value) {
        console.log('dateset', value);
        this.dateEntry = formatDate(value, this.format);
        this.$emit('input', this.payload);
      },
      closeDate() {
        // eslint-disable-next-line no-console
        console.log('closing');
        this.dateBox = false;
      }
    }
  };

</script>

<style scoped>
.inline_date {
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
}

</style>
