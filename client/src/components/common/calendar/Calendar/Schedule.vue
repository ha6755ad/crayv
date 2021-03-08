<template>
    <div class="col-12">
    <ScheduleItem v-for="event in filteredEvents" :key="event._id.$oid" :avatar="event.coverPhoto ? event.coverPhoto : 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/calendar_emoji.png'" :title="event.name" :subtitle="event.description" preIconSize="30px" :preIcon="getDate(event.starts)" :icon="false" :bottom-text="getMonth(event.starts)" :top-text="getDay(event.starts)" :time="getTime(event.starts)" :cardHeight="90" :listItems="vendorGroups" :listTwoItems="groups"
    ></ScheduleItem>
<!--    <v-list>-->
<!--        <v-list-group v-for="event in filteredEvents" :key="event._id.$oid">-->
<!--            <template v-slot:activator>-->
<!--                <v-list-item>-->
<!--                    <v-list-item-icon>{{getDate(event.starts)}}</v-list-item-icon>-->
<!--                    <v-list-item-avatar>-->
<!--                        <img :src="event.coverPhoto ? event.coverPhoto : 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/calendar_emoji.png'">-->
<!--                    </v-list-item-avatar>-->
<!--                    <v-list-item-title>-->
<!--                        {{event.name}}-->
<!--                    </v-list-item-title>-->
<!--                    <v-list-item-subtitle>-->
<!--                        {{event.description}}-->
<!--                    </v-list-item-subtitle>-->
<!--                </v-list-item>-->
<!--            </template>-->
<!--        </v-list-group>-->
<!--    </v-list>-->
    </div>
</template>

<script>
  // import moment from 'moment';
  import {mapActions, mapState} from 'vuex';
  import ScheduleItem from './ScheduleItem';
  const {date} = require('quasar');
  // eslint-disable-next-line no-unused-vars
  const {daysInMonth, formatDate, subtractFromDate, addToDate, startOfDate, buildDate} = date;

  export default {
    name: 'Schedule',
    components: {ScheduleItem},
    props: {},
    data(){
      return {

      };
    },
    created(){
      this.getEvents();
      this.getVendors();
      this.getGroups();
    },
    computed: {
      ...mapState('eventstore', {
        events: 'events'
      }),
      ...mapState('crayv', {
        vendorGroups: 'vendorGroups'
      }),
      // ...mapState('ct', {
      //     groups: 'groups'
      // }),
      filteredEvents(){
        let list = [];
        this.events.forEach(a => a.starts ? list.push(a) : '');
        return list;
      }
    },
    methods: {
      ...mapActions('eventstore', {
        loadEvents: 'loadEvents'
      }),
      ...mapActions('crayv', {
        loadVendorGroups: 'loadVendorGroups'
      }),
      ...mapActions('ct', {
        loadGroups: 'loadGroups'
      }),
      getDate(date){
        return formatDate(date, 'D');
      },
      getDay(date){
        return formatDate(date, 'ddd');
      },
      getMonth(date){
        return formatDate(date, 'MMM');
      },
      getTime(date){
        return formatDate(date, 'h:mm a');
      },
      getEvents(){
        let params = {};
        this.loadEvents(params);
      },
      getVendors(){
        let params = {};
        this.loadVendorGroups(params);
      },
      getGroups(){
        let params = {};
        this.loadGroups(params);
      }
    }
  };
</script>
