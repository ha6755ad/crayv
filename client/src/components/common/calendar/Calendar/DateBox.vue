<template>
        <div :style="dayStyle" class="day_squares">
          <div @click="selectDate(day)" :key="day" class="dateNumber pointer"><div class="q-ma-xs">{{day}}</div><q-btn color="blue-grey-3" icon="far fa-calendar-plus" size="xs" class="q-ma-xs" round></q-btn></div>
          <div style="overflow: scroll;">
            <div @click="$emit('open', event)" v-for="(event,index) in events" :key="index" class="text-white q-ma-sm event pointer" :style="{background: event.eventColor.hexa}">
              <div>{{event.name}}</div>
              <div>
                <q-btn icon="mdi-pencil-box" round flat size="xs"
                     v-if="isAdmin(groupIn) || lget(eventIn, 'createdBy', '*') === lget(user, '_id', null)"
                       @click.stop="$emit('edit', event)"
                >
                </q-btn>
              </div>
            </div>
          </div>
        </div>
</template>

<script>
  export default {
    props: {
      day: {
        type: [Number, String]
      },
      colorDate: {
        type: Array
      },
      width: {
        type: Number
      },
      pixs: {
        type: Number
      },
      bgColor: {
        type: String,
        default: '#ffffff'
      },
      fontColor: {
        type: String,
      },
      events: {
        type: Array,
      },
      groupIn: Object,
    },
    computed: {
      //dayStyle(date)
      dayStyle() {
        return {
          '--transform--hover': 'scale(1.02)',
          '--box-shadow--hover': '0px 1px 12px #0D47A1',
          '--z-index--hover': 5,
          '--width': this.width / 7.05 + 'px',
          '--height': this.width / 7 + 'px',
          '--text-align': 'center',
          '--cursor': 'pointer',
          // '--line-height': this.pixs / 7 + 'px',
          '--box-shadow': '0px 0px 2px #9E9E9E',
          // '--background-color': this.colorSelected(date)
        };
      },
      fontSize(){
        return Math.max(this.width/70, 15);
      }

    },
    methods: {
      selectDate(day){
        this.$emit('selectDate', day);
      },
      colorSelected(date) {
        return this.colorDate === date ? '#B9F6CA' : this.bgColor;
      },
    }
  };
</script>

<style scoped>
    .day_squares {
        box-shadow: var(--box-shadow);
        width: var(--width);
        height: var(--height);
        text-align: var(--text-align);
        /*cursor: var(--cursor);*/
        /*line-height: var(--line-height);*/
        background-color: var(--background-color);
        display: flex;
        flex-direction: column;
    }

    /*.day_squares:hover {*/
    /*    transform: var(--transform--hover);*/
    /*    box-shadow: var(--box-shadow--hover);*/
    /*    z-index: var(--z-index--hover);*/
    /*}*/
    .dateNumber {
      color: #607D8B;
      font-size: 1.2em;
      display: flex;
      justify-content: space-between;
    }


    .event {
      height: 25px;
      border-radius: 5px;
      display: grid;
      grid-template-columns: 80% 20%;
      overflow: hidden;
    }

    .event:hover {
      transition: 0.4s;
      transform: scale(1.1);
      border: 1px solid grey;
    }

</style>
