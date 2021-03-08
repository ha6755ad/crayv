<template>
  <div class="col-12">
    <div class="row justify-center wrap q-my-md" style="width: 100%">
      <div v-for="(evt, i) in eventsIn" :key="i" class="col-12 col-sm-6 col-md-4 col-lg-3 q-pa-md">
        <q-card style="height: 400px; width: 100%">
          <event-card @open="openEvent" :community-in="community" :event-in="evt" @edit="editEvent(evt)"></event-card>
        </q-card>
      </div>
    </div>
    <q-dialog :maximized="$q.screen.lt.sm" v-model="eventDialog">
      <q-card style="width: 700px; max-width: 100vw">
        <event-form @closeDialog="eventDialog = false" :event-in="editing"></event-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import EventCard from '../cards/EventCard';
  import EventForm from '../forms/EventForm';

  // const { date } = require('quasar');

  export default {
    name: 'EventGrid',
    components: { EventForm, EventCard },
    props: {
      eventsIn: Array
    },
    data() {
      return {
        eventDialog: false,
        editing: null
      };
    },
    computed: {
      ...mapGetters('communities', { getCommunity: 'get' }),
      community() {
        return this.getCommunity(this.$route.params.id);
      },
    },
    methods: {
      openEvent(evt){
        this.$emit('open', evt);
      },
      editEvent(evt) {
        this.editing = evt.clone();
        this.eventDialog = true;
      }
    }
  };
</script>

