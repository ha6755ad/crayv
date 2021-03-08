<template>
  <div class="__card-grid">
    <img style="height: 100%; width: 100%; object-fit: cover" :src="getAvatar(eventIn, 'images', 'large', 0)">

    <div style="width: 100%; padding: 5%">
      <div class="text-weight-bold text-xs text-mb-md">{{ eventIn.name }}</div>
      <div class="text-red-10 text-xs text-mb-md text-weight-medium">{{ formatStart(eventIn.starts) }}</div>


      <div class="q-mt-sm text-xxs text-mb-xs text-weight-light">
        <v-clamp :max-lines="2" :autoresize="true">
          {{ eventIn.description }}
        </v-clamp>
        <q-tooltip :content-class="`text-xxs text-mb-xxs bg-primary text-${getTextColor('--q-color-primary')}`">
          {{ eventIn.description }}
        </q-tooltip>
      </div>
    </div>

    <div class="row self-baseline q-px-md no-wrap">
      <q-btn size="xs" @click="$emit('edit')"
             v-if="isMember(getCommunity(eventIn.byGroup), ['admins', 'board'], person ? person._id : null)" flat round
             icon="mdi-pencil"/>
      <q-icon v-if="lget(eventIn, 'product_ids', []).length" size="xs" color="green-8" name="attach_money">
        <q-tooltip :content-class="`text-xxs text-mb-xxs bg-primary text-${getTextColor('--q-color-primary')}`">This is
          a paid event
        </q-tooltip>
      </q-icon>
      <q-space/>
      <div>

        <q-btn flat size="sm" label="details" color="secondary"
               @click="$emit('open', eventIn)"></q-btn>

      </div>
      <div>
        <q-btn class="glossy" color="secondary" size="sm" label="register"
               @click="registerDialog = true">
        </q-btn>
      </div>
    </div>

    <q-dialog full-width v-model="ticketDialog">
      <div
        style="max-width:100%; display: flex;justify-content: space-evenly;flex-direction: row; border-radius: 15px;background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(156,167,247,1) 100%);">
        <div class="row flex justify-center" style="width: 100%;">
          <q-card class="q-ma-lg flex justify-center" style="width: 20%;height: 40vh;" v-for="(ticket,index) in tickets"
                  :key="index">
            {{ ticket.name }}
            {{ ticket.price }}
          </q-card>
        </div>
      </div>
    </q-dialog>

    <q-dialog size="sm" v-model="registerDialog">
      <q-card style="width: 600px; max-width: 100vw">
        <event-registration :event-in="eventIn" :ticketsIn="eventTickets"/>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
  import {date} from 'quasar';

  const { formatDate } = date;
  import {mapState, mapGetters} from 'vuex';
  // import {models} from 'feathers-vuex';
  import EventRegistration from '../forms/EventRegistration';
  import VClamp from 'vue-clamp';

  export default {
    name: 'EventCard',
    components: { EventRegistration, VClamp },
    props: {
      eventIn: Object,
      communityIn: Object
    },
    mounted() {
      // TODO: this is in both card and details card - see if you can consolidate
      this.$store.dispatch('products/find', {
        query: {
          events: {
            $elemMatch: { id: this.eventIn._id }
          }
        },
        '$populateParams': { name: 'withPromos'}
      }).then(res => {
        console.log('got tickets', res);
      })
        .catch(err => {
          console.log('error finding products in event card', err);
        });
    },
    data() {
      return {
        ticketDialog: false,
        registerDialog: false,
        tickets: [
          {
            name: 'Basic Ticket',
            photoUrl: '',
            price: '5$',
          },
          {
            name: 'Vip Ticket',
            photoUrl: '',
            price: '$20',
          },
          {
            name: 'Full Access Tickets',
            photoUrl: '',
            price: '$100',
          },
          {
            name: 'Full Access Tickets',
            photoUrl: '',
            price: '$100',
          },
          {
            name: 'Full Access Tickets',
            photoUrl: '',
            price: '$100',
          },
          {
            name: 'Full Access Tickets',
            photoUrl: '',
            price: '$100',
          },
          {
            name: 'Full Access Tickets',
            photoUrl: '',
            price: '$100',
          },
          {
            name: 'Full Access Tickets',
            photoUrl: '',
            price: '$100',
          },
          {
            name: 'Full Access Tickets',
            photoUrl: '',
            price: '$100',
          },
          {
            name: 'Full Access Tickets',
            photoUrl: '',
            price: '$100',
          },
          {
            name: 'Full Access Tickets',
            photoUrl: '',
            price: '$100',
          },
          {
            name: 'Full Access Tickets',
            photoUrl: '',
            price: '$100',
          },
          {
            name: 'Full Access Tickets',
            photoUrl: '',
            price: '$100',
          },
          {
            name: 'Full Access Tickets',
            photoUrl: '',
            price: '$100',
          },
        ],
      };
    },
    computed: {
      ...mapState('auth', { user: 'user' }),
      ...mapGetters('communities', { getCommunity: 'get' }),
      ...mapGetters('people', { getPerson: 'get' }),
      ...mapGetters('products', { findProducts: 'find' }),
      eventTickets(){
        return this.findProducts({
          query: {
            events: {
              $elemMatch: { id: this.lget(this.eventIn, '_id') }
            }
          }
        }).data.map(a => a.clone());
      },
      appURL() {
        return process.env.VUE_APP_URL;
      },
      eventRouteId() {
        return this.$route.params.eventId;
      },
      person() {
        if (this.user?._fastjoin?.hasPerson) return this.user._fastjoin.hasPerson;
        else if (this.user) return this.getPerson(this.user.hasPerson);
        else return null;
      },
      eventCommunity() {
        return this.getCommunity(this.eventIn.byGroup ? this.eventIn.byGroup : this.$route.params.id);
      }
    },
    methods: {
      closeDetail() {
        this.eventRouteClose();
      },
      formatStart(sd) {
        if (sd) {
          return formatDate(sd, 'ddd MMM DD, YYYY h:mm a');
        } else return 'No Start Set';
      }
    }
  };
</script>

<style scoped lang="scss">
.__card-grid {
  height: 100%;
  width: 100%;
  display: grid;
  position: relative;
  grid-template-columns: 100%;
  grid-template-rows: 50fr 40fr 10fr;
}
</style>
