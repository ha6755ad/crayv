<template>
  <q-card flat class="q-pa-md">
    <q-card v-for="(ticket, i) in tickets" :key="`evt-${i}`">
      <q-card-section>
        <div class="text-sm text-mb-sm text-primary" v-if="isRegistered(ticket).length">You registered</div>
        <div class="text-xs text-mb-xs text-weight-medium">Who will be attending?</div>
        <div class="text-xxs text-mb-xxs text-weight-light">You have {{ lget(ticket, 'attendees', []).length }} tickets
          to register
        </div>
      </q-card-section>
      <q-card-section>

        <div class="text-xs text-mb-xs">{{ lget(ticketEvent(ticket), 'name') }}</div>
        <div class="text-xxs text-mb-xxs text-weight-light">
          {{ getDateFormat(lget(ticketEvent(ticket), 'starts'), 'MM-DD-YYYY h:mm a') }} -
          {{ isSame(lget(ticketEvent(ticket), 'ends'), lget(ticketEvent(ticket), 'starts'), 'day') ? getDateFormat(lget(ticketEvent(ticket), 'ends'), 'h:mm a') : getDateFormat(lget(ticketEvent(ticket), 'ends'), 'MM-DD-YYYY h:mma ') }}
        </div>

      </q-card-section>
      <q-card-section>
        <div class="col-12 q-gutter-md">
          <q-card class="q-pa-md bg-background" v-for="(person, i) in ticket.attendees" :key="`ticket-${i}`">
            <q-input label="Attendee Name" v-model="person.name"/>
            <q-input label="Attendee Email" v-model="person.email" hint="If you want email invite and reminders"/>
            <div class="q-my-md">
              <vue-tel-input label="Attendee Phone" :value="person.phone"
                             @input="person.phone = handlePhone('e164', ...arguments)"
                             hint="If you want text invite and reminders"/>
              <div class="text-0-8 text-grey-8 text-weight-light">If you want text invite and reminders</div>
            </div>
          </q-card>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row justify-end">
          <q-btn @click="invite" label="Register" class="glossy" color="primary"/>
        </div>
      </q-card-section>
    </q-card>
  </q-card>
</template>

<script>
  import {mapGetters, mapState} from 'vuex';

  const { date } = require('quasar');

  export default {
    name: 'IdTickets',
    props: {
      // TODO: create option to share tickets with others in follow or by text or email
      ticketsIn: Array,
    },
    mounted() {
      this.tickets = [];
      this.$store.dispatch('events/find', {
        query: {
          _id: { $in: this.orderEvents }
        }
      }).catch(err => {
        console.log('error finding events in id tickets', err);
      });
      this.ticketsIn.forEach(ticket => {
        ticket.attendees = [];
        let obj = { id: null, idPath: null, name: name, email: '', phone: '' };
        let list = this.isRegistered(ticket);
        if(list.length){
          list.forEach(registrant => {
            ticket.attendees.push(registrant);
          });
        } else {
          for (let idx = 0; idx < this.lget(ticket, 'quantity', 0); idx++) {
            let name = this.lget(this.person, 'name', '');
            let email = this.$getDefaultProfileEmail(this.person);
            let phone = this.$getDefaultProfilePhone(this.person, null, 'number.e164');
            if (idx === 0) {
              obj = {
                name: name,
                email: email,
                phone: phone,
                id: this.person._id,
                idPath: 'people',
                confirmed: true,
                ticket: ticket.product
              };
            }
            ticket.attendees.push(obj);
          }
        }
        this.tickets.push(ticket);
      });
    },
    data() {
      return {
        tickets: []
      };
    },
    computed: {
      ...mapState('auth', { user: 'user' }),
      ...mapGetters('people', { getPerson: 'get' }),
      ...mapGetters('events', { findEvents: 'find' }),
      orderEvents() {
        let events = this.ticketsIn ? this.ticketsIn.map(a => a.event) : [];
        return events.map(a => a.id);
      },

      stateEvents() {
        return this.findEvents({
          query: {
            _id: { $in: this.orderEvents }
          }
        }).data;
      },
      person() {
        return this.lget(this.user, '_fastjoin.hasPerson', this.getPerson(this.user.hasPerson));
      },
    },
    methods: {
      isRegistered(ticket){
        return this.lget(this.ticketEvent(ticket), 'attendees.outbound', []).filter(a => {
          return a.ticket === ticket.product;
        });
      },
      ticketEvent(ticket) {
        let event = this.lget(ticket, 'event.id');
        return this.$arrayFilterZero(this.stateEvents.filter(a => a._id === event));
      },
      isSame(date1, date2, unit) {
        return date.isSameDate(date1, date2, unit);
      },
      invite() {
        this.tickets.forEach(async ticket => {
          await this.$store.dispatch('event-invite/create', {attendees: ticket.attendees, id: this.lget(ticket, 'event.id'), register: true})
            .then(res => {
              console.log('invited', res);
              this.$successNotify('Registered');
            }).catch(err => {
              console.log('invite err', err);
              this.$errNotify('Error Registering');
            });
        });
      }
    }
  };
</script>
