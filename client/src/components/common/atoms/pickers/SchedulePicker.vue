<template>
  <q-card style="height: 100%; width: 100%" flat dark>
    <div class="row no-wrap" style="overflow-x: scroll" >

        <!--                DATE HEADER -->

        <div v-for="(day, index) in templateAvailability" :key="day.name" class="days">

          <q-btn :label="day.name" flat/>

          <q-card dark>
                <q-btn icon="mdi-content-copy" size="sm" round flat @click="copyPrev(index)">
                  <q-tooltip>Copy previous day</q-tooltip>
                </q-btn>

            <!--                                TIMES-->

            <div class="timeList">
              <div class="times" :style="colorTime(day, time) ? {color: '#a6f5a9'} : ''" v-for="time in times"
                   :key="time" @click="pushTime(time, index)">
                <div class="q-pa-sm">{{time}}</div>
                <q-icon v-if="colorTime(day, time)" name="mdi-checkbox-marked-circle-outline"
                        style="color: #b5f5b7"/>
              </div>
            </div>

          </q-card>
        </div>
    </div>
  </q-card>
</template>

<script>

  import {datePlugin} from 'src/plugins/dates';

  export default {
    name: 'SchedulePicker',
    mixins: [datePlugin],
    props: {
      value: Object
    },
    mounted(){
      if(!this.value) this.form.days = this.templateAvailability;
    },
    data(){
      return {
        form: {
          days: [],
          blackout: []
        },
        templateAvailability: [
          {
            name: 'Sunday',
            times: []
          },
          {
            name: 'Monday',
            times: []
          },
          {
            name: 'Tuesday',
            times: []
          },
          {
            name: 'Wednesday',
            times: []
          },
          {
            name: 'Thursday',
            times: []
          },
          {
            name: 'Friday',
            times: []
          },
          {
            name: 'Saturday',
            times: []
          }
        ],
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal){
          if(newVal){
            this.form = Object.assign({}, newVal);
          }
        }
      }
    },
    computed: {
      times() {
        let list = [];
        for (let i = 0; i < 24; i++) {
          i < 20 ? list.push(this.getDateFormat(this.genDateHour((i + 5), 0), 'h:mm a')) : list.push(this.getDateFormat(this.genDateHour((i - 19), 0), 'h:mm a'));
        }
        return list;
      },
    },
    methods: {
      colorTime(day, time) {
        if(this.form && this.form.days.length > 0) {
          let days = this.form.days.map(a => a.name);
          let idx = days.indexOf(day.name);
          return this.form.days[idx].times.includes(time);
        } else return false;
      },
      pushTime(time, index) {
        // eslint-disable-next-line no-console
        // console.log('pushing time', time, index)
        if (this.form && this.form.days.length && this.form.days[index].times.includes(time)) {
          this.form.days[index].times.splice(this.form.days[index].times.indexOf(time), 1);
        } else if (this.form && this.form.days) {
          this.form.days[index].times.push(time);
        } else {
          this.form.days = this.templateAvailability;
          this.form.days[index].times.push(time);
        }
        this.$emit('input', this.form);
      },
      copyPrev(index) {
        if(this.form && this.form.days.length > 0) {
          let ind = index - 1;
          this.form.days[index].times = this.form.days[ind].times.slice();
          this.$emit('input', this.form);
        }
      },
    }
  };
</script>

<style scoped lang="scss">
  .days {
    width: 14%;
    min-width: 100px;

  }

  .timeList {
    cursor: pointer;
    margin: auto;
    margin-top: 10px;
  }

  .times {
    display: flex;
    justify-content: space-around;
    text-align: center;
    align-items: center;
    border-style: solid;
    border-color: #EEEEEE;
    border-width: 1px;
  }
</style>
