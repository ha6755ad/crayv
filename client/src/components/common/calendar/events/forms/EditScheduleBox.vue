<template>
  <div class="box">
    <template>
      <div class="inputs" style="margin-bottom: 16px">
        <q-input placeholder="Name Schedule Item"
                 clearable
                 @clear="form.name = ''"
                 :dark="dark" v-model="form.name"
                 outlined
        ></q-input>
      </div>
      <div class="inputs" style="margin-bottom: 16px">
        <q-input autogrow type="textarea" placeholder="Description" v-model="form.description"></q-input>
      </div>
      <div class="inputs">
        <inline-picker
          :model_start="eventIn.starts"
          :model_end="eventIn.ends"
          :calendar="false"
          :recur="false"
          @input="setDT"
          :dateList="dateList"
          format="MMM, DD YYYY"
        ></inline-picker>
      </div>
      <div class="btn">
        <q-btn @click="saveItem" style="align-self: flex-end" label="save item"/>
      </div>
    </template>
  </div>
</template>

<script>
  import InlinePicker from '../../../atoms/dates/InlinePicker';
  import moment from 'moment';

  export default {
    name: 'EditScheduleBox',
    components: { InlinePicker },
    props: {
      dark: Boolean,
      // to provide datepicker the list of available event dates
      dateList: {
        type: Array,
        default: function () {
          return [
            moment()
          ];
        }
      },
      uuidIn: String,
      eventIn: Object,
      itemIn: Object,
    },
    data() {
      return {
        form: {
          name: '',
          description: '',
          starts: {
            date: moment(),
          },
          ends: {
            date: moment().add(1, 'hour')
          },
          settings: {
            shell: false
          }
        }
      };
    },
    watch: {
      eventIn: {
        immediate: true,
        handler(newVal){
          // eslint-disable-next-line no-console
          console.log('scheduleBoxWatch');
          if(newVal && Object.keys(newVal).length > 0){
            this.form = newVal;
          }
        }
      }
    },
    computed: {
    },
    methods: {
      setDT(value) {
        // eslint-disable-next-line no-console
        // console.log('scheduleBoxDT')
        this.form.starts = value.start;
        this.form.ends = value.end;
      },
      saveItem(){
        let payload = Object.assign({}, this.$store.state.eventstore.scheduleSchema);
        payload.uuid = this.uuidIn;
        payload.name = this.form.name;
        payload.description = this.form.description;
        payload.starts = this.form.starts;
        payload.ends = this.form.ends;
        payload.settings = this.form.settings;
        this.$emit('input', payload);
      }
    }
  };
</script>

<style scoped>
  .box {
    width: 100%;
    height: 100%;
    padding: 30px 0 0 0;
    /*display: flex;*/
    /*flex-direction: column;*/
    /*align-items: center;*/
  }
  .btn {
    display: flex;
    width: 100%;
    justify-content: flex-end
  }
  .inputs {
    margin: -30px 0 0 0;
  }
</style>
