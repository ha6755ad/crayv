<template>
  <q-card flat class="bg-transparent" style="width: 100%">
    <div class="row q-px-md q-mt-md text-weight-medium text-1-2">
      Event Registration
    </div>
    <template v-if="!ticketsIn.length > 0">
      <q-card flat class="q-pa-md">
    <div class="row">
      <div class="col-12">
        <q-input label="name" v-model="register.name"/>
      </div>
      <div class="col-12">
        <q-input label="email" v-model="register.email"/>
      </div>
      <div class="col-12">
        <p class="text-1 text-grey-8" style="transform: translateY(80%)">Phone</p>
        <vue-tel-input :value="register.phone"
                       @input="register.phone = handlePhone('e164', ...arguments)"></vue-tel-input>
        <p class="caption text-grey-8 text-weight-light">If you want SMS directions and reminder</p>
      </div>
    </div>
    <div class="row justify-end q-px-md">
      <q-space/>
      <q-btn label="register" class="glossy" color="secondary" @click="registerEvent"/>
    </div>
      </q-card>
    </template>
    <template v-else>
      <q-card style="width: 100%; max-height: 100vh; overflow-y: scroll">
        <div class="text-xxs text-md-xxs text-weight-light q-px-md">
          Choose ticket option
        </div>
        <q-list style="width: 100%" separator>
          <q-item v-for="(ticket, i) in ticketsIn" :key="`ticket-${i}`">
            <div style="width: 100%">
            <ticket-card :ticket-in="ticket" :event-in="eventIn"></ticket-card>
            </div>
          </q-item>
        </q-list>
      </q-card>
    </template>
  </q-card>
</template>

<script>
  import { mapState, mapGetters } from 'vuex';
  import {models} from 'feathers-vuex';
  import TicketCard from '../tickets/TicketCard';

  export default {
    name: 'EventRegistration',
    components: { TicketCard },
    props: {
      eventIn: Object,
      ticketsIn: Array
    },
    mounted(){
      if(this.lget(this.person, '_id')){
        this.register.name = this.person.name;
        this.register.email = this.$getDefaultProfileEmail(this.person);
        this.register.phone = this.$getDefaultProfilePhone(this.person, null, 'number.e164');
        this.register.id = this.person._id;
        this.register.idPath = 'people';
      }
    },
    data(){
      return {
        register: {
          name: '',
          email: '',
          phone: '',
        }
      };
    },
    computed: {
      ...mapState('auth', { user: 'user' }),
      ...mapGetters('people', {getPerson: 'get'}),
      person(){
        return this.lget(this.user, '_fastjoin.hasPerson', this.getPerson(this.lget(this.user, 'hasPerson')));
      }
    },
    methods: {
      async registerEvent() {
        let e = new models.api.Events(this.eventIn).clone();
        let attendee = Object.assign({}, this.register);
        if(this.lget(this.person, '_id')){
          attendee.id = this.person._id;
          attendee.idPath = 'people';
        }
        attendee.confirmed = true;

        await this.$store.dispatch('event-invite/create', {attendees: [attendee], id: e._id, register: true, inbound: true})
          .then(() => {
            this.$q.notify({
              message: 'See you there!',
              color: 'positive'
            });
          })
          .catch(err => {
            //eslint-disable-next-line-no-console
            console.log(err.message);
            this.$q.notify({
              message: 'Error registering, please try again',
              color: 'negative'
            });
          });
      },
    }
  };
</script>
