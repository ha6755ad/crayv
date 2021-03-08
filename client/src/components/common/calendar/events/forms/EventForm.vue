<template>
  <q-card style="width: 100%;">
    <div class="row items-center q-mt-md q-px-md text-xs text-mb-sm text-weight-medium">
      {{ eventIn ? 'Edit' : 'Create' }} Event
      <!--      <q-tabs v-model="tab" dense>-->
      <!--       -->
      <!--        <q-space/>-->
      <!--        <q-tab v-for="(item, i) in tabItems"-->
      <!--               :key="i" :name="i"-->
      <!--               :label="item.name"-->
      <!--               :class="`bg-light text-${$darkest()}`"-->
      <!--               :disable="ready < i"-->
      <!--               :icon="item.icon"-->
      <!--        ></q-tab>-->
      <!--      </q-tabs>-->
      <q-space/>
      <div v-if="lget(eventIn, '_id', false)">
        <q-btn round flat size="sm" icon="mdi-delete" color="red" @click="removeEvent()"/>
      </div>
    </div>
    <q-separator/>
    <div class="row justify-end">
      <q-btn
        size="sm"
        style="position: relative"
        square
        flat
        v-for="(item, i) in tabItems"
        :key="i" :name="i"
        :label="$q.screen.lt.md ? '' : item.name"
        :disable="ready < i"
        :color="tab === i ? 'nice' : 'grey-8'"
        :icon="item.icon"
        @click="tab = i"
      >
        <q-tooltip content-class="bg-dark text-light">{{ item.name }}</q-tooltip>
        <div
          :style="{position: 'absolute', bottom: 0, left: 0, background: `var(--q-color-nice})`, width: tab === i ? '100%' : '0', height: '1px', transition: 'all .3s ease-out'}"/>
      </q-btn>
    </div>

    <q-tab-panels
      v-model="tab"
      animated
    >
      <q-tab-panel :name="0">
        <div class="row justify-evenly">
          <div class="col-12">
            <q-input label="Name Event" v-model="form.name"></q-input>
          </div>
          <div class="col-12 q-py-sm">
            <q-input filled type="textarea" label="Event Description" v-model="form.description"></q-input>
          </div>
          <div class="col-12">
            <div class="row justify-center">
              <div style="width: 800px; max-width: 100%">
            <p>Event Time</p>
            <inline-picker block_view :model_end="modelEnd" :model_start="modelStart"
                           @input="setDate"></inline-picker>
              </div>
            </div>
          </div>
          <div class="col-5 justify-center" style="text-align: center;">
            <div class="row justify-center text-md text-mb-md">

            <q-btn flat icon="mdi-image" label="Event Images" @click="adding = !adding"/>
            </div>
            <div class="row justify-center q-py-md" v-if="adding">
              <image-form v-model="form.images" multiple @input="addImage"></image-form>
            </div>

            <div class="row justify-center">
              <template v-for="(image, i) in form.images">
                <q-img :key="`image-${i}`" style="height: 150px; width: 200px" :src="getAvatar(image, null, 'medium')">
                  <q-btn size="sm" round class="text-red bg-light t-r" icon="mdi-delete"
                         @click="form.images.splice(i, 1)"/>
                </q-img>

              </template>
            </div>
          </div>
          <div style="border-left: 1px solid black;text-align: center;" class="col-5 justify-center">
            <q-btn class="text-light" :style="{'color': form.color.hexa}" flat icon="mdi-palette" label="Event Color">
              <q-popup-proxy>
                <q-card class="q-pa-md">
                  <color-picker path="color" v-model="form.color"></color-picker>
                </q-card>
              </q-popup-proxy>
            </q-btn>
          </div>
          <div class="col-12 q-mt-xl row flex-center" v-if="!host">
<!--              <AutoComplete-->
<!--                list_detail-->
<!--                outlined-->
<!--                chips-->
<!--                label="For Communities..."-->
<!--                :options="following"-->
<!--                option-label="name"-->
<!--                option_avatar="avatar"-->
<!--                @input="pickCommunity"-->
<!--                :color="$store.getters.lightColor"-->
<!--                :multiple="false"-->
<!--                item_subtitle="description"-->
<!--                :hideSelected="true"-->
<!--              ></AutoComplete>-->
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel :name="1">

        <div class="col-12">
          <q-card flat style="height: 100%; width: 100%; min-height: 500px; max-height: 100vw; max-width: 100vw">
            <select-location :event-in="form" @input="updateAddress"
                             :address-list="form.locations ? form.locations.list : []"></select-location>
          </q-card>
        </div>

      </q-tab-panel>

      <q-tab-panel :name="2">
        <event-schedule
          :model_start="form.start"
          :model_end="form.end"
          :events="lget(form, 'schedule.items', [])"
        ></event-schedule>
      </q-tab-panel>
      <q-tab-panel :name="3">
        <event-invite
          :event-in="form"
          :communities-in="[host]"
          :value="lget(form, 'channels', []).map(a => a.id)"
          @input="newChannel"
        ></event-invite>
      </q-tab-panel>
    </q-tab-panels>
    <div class="row items-center q-pa-md">
      <q-btn :disable="!form._id" flat icon="mdi-ticket-confirmation" size="sm" label="Add Tickets"
             @click="ticketForm = true"
      />
    </div>
    <div class="row items-center" v-if="lget(eventTickets, [0])">
      <q-card flat v-for="(ticket, i) in eventTickets" :key="`ticket-${i}`" style="height: 150px; width: 200px">
        <q-btn size="xs" round flat icon="mdi-delete" color="red" class="t-r" @click="rmvProduct(ticket)"/>
        <ticket-card :ticket-in="ticket" :event-in="form"></ticket-card>
      </q-card>
    </div>
    <div class="row q-pa-md flex">
      <q-input dense outlined type="number" label="Limit" hint="maximum capacity" :rules="[ val => val > 0 || 'Limit must be greater than 0']" v-model.number="form.attendees.limit"/>
      <q-space/>
      <q-btn :size="$q.screen.lt.md ? 'sm' : ''" class="b-r q-mb-md q-mr-md" label="save event" :class="`text-${$getTextColor('--q-color-secondary')}`" color="secondary"
             @click="saveEvent(form)"/>
    </div>

    <q-dialog v-model="ticketForm">

    </q-dialog>
  </q-card>
</template>

<script>
  import { mapGetters } from 'vuex';
  import {models} from 'feathers-vuex';
  import InlinePicker from '../../../atoms/dates/InlinePicker';
  import SelectLocation from '../../../../utils/mapbox/SelectLocation';
  import EventSchedule from '../EventSchedule';
  import colorPicker from '../../../atoms/colorSelectorRoundInput/colorSelectorRoundInput';
  import ImageForm from 'components/family-pod/personal/ImageForm';
  import TicketCard from '../tickets/TicketCard';

  // const common = require('../../store/schemas/common');
  import EventInvite from './EventInvite';
  const {date} = require('quasar');
  // eslint-disable-next-line no-unused-vars
  const {formatDate, buildDate} = date;

  export default {
    name: 'EventForm',
    components: {
      EventInvite,
      TicketCard,
      ImageForm,
      EventSchedule,
      SelectLocation,
      InlinePicker,
      colorPicker,
    },
    props: {
      eventIn: Object,
      start: {Date, String},
      end: {Date, String},
      hostIn: Object
    },
    mounted() {
      this.modelStart = this.start;
      this.modelEnd = this.end;
      if (this.eventIn) {
        this.form = new models.api.Events(this.eventIn).clone();
      }
      setTimeout(() => {
        if (!Object.keys(this.lget(this.eventIn, 'schedule.items[0]', {})).length > 0) this.createShell();
      }, 500);
    },
    data() {
      return {
        modelStart: new Date(),
        modelEnd: new Date(),
        communitiesPicked: [],
        adding: false,
        ticketForm: false,
        productTab: 0,
        productPaginate: 10,
        tab: 0,
        imageHolder: null,
        vendor: null,
        scheduleSchema: {
          uuid: '',
          name: '',
          description: '',
          start: null,
          end: null,
          invites: {},
          settings: {},
        },
        form: new models.api.Events().clone()
      };
    },
    watch: {},
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      eventTickets(){
        return [];
      },
      hostId() {
        return this.hostIn ? this.hostIn._id : this.$route.params.hostId;
      },
      host() {
        return this.hostIn;
      },
      ready() {
        // TODO: handle ready
        return 10;
        // let s = 0;
        // if (this.form?.start && this.form?.end) s = 3;
        // return s;
      },
      tabItems() {
        return [
          {
            name: 'Details',
            icon: 'mdi-calendar'
          },
          {
            name: 'Location',
            icon: 'mdi-map-marker'
          },
          {
            name: 'Schedule',
            icon: 'mdi-clock'
          },
          {
            name: 'Invite',
            icon: 'mdi-account-group'
          }
        ];
      }
    },
    methods: {
      newChannel(arr){
        console.log('handling new channel', arr);
        arr.forEach(channelId => {
          let idx = this.lget(this.form, 'channels', []).map(a => a.id).indexOf(channelId);
          if(idx === -1){
            let obj = {id: channelId, idPath: 'channels'};
            this.form.channels ? this.form.channels.push(obj) : this.form.channels = [obj];
          }
        });
      },
      rmvTicket(ticket) {
        let idx = ticket.events.indexOf(this.form._id);
        ticket.events.splice(idx, 1);
        ticket.save();
      },
      pickhost(e){
        console.log(e);
        this.form.host = e._id;
      },
      async toggleProduct(product) {
        let idx = this.lget(product, 'events', []).map(a => a.id).indexOf(this.form._id);
        if (idx > -1) product.events.splice(idx, 1);
        else product.events ? product.events.push({id: this.form._id}) : product.events = [{ id: this.form._id }];
        product.save()
          .then(res => {
            this.$successNotify('Ticket Added');
            console.log('saved product to event', res);
          }).catch(err => {
            console.log('error saving event ticket', err);
            this.$ertStrNotify('Error saving ticket');
          });
      },
      removeEvent(){
        console.log('event id', this.eventIn._id);
        this.$isLoading(true);
        this.$store.dispatch('events/remove', this.eventIn._id)
          .then(() => {
            this.$isLoading(false);
            this.$emit('closeDialog');
          })
          .catch(err => {
            this.$isLoading(false);
            this.$errNotify('Error removing event - ' + err.message);
          });
      },
      updateAddress(payload, idx) {
        // eslint-disable-next-line no-console
        console.log('updating', idx, payload);
        this.form.location = payload;
      },
      setDate(value) {
        let start = value.start;
        let end = value.end;
        this.form.start = start;
        this.form.end = end;
      },
      async saveEvent(e) {
        this.$isLoading(true);
        if(!e.start){
          e.start = this.modelStart;
        }
        if(!e.end){
          e.end = this.modelEnd;
        }
        e.coverPhoto = this.imageHolder;
        e.createdBy = this.user._id;
        console.log('saving', e);
        e.save()
          .then(res => {
            this.$isLoading(false);
            // this.generateBallotPreview('events', 'Approval', [res]);
            //eslint-disable-next-line-no-console
            console.log('event saved', res);
            let evts = this.host.events;
            // TODO: handle channels
            evts ? evts.push({id: res._id, channels: []}) : evts = [{id: res._id, channels: []}];
            // TODO: governance workflow
            this.$store.dispatch('communities/patch', [this.host._id, { events: evts }, {}])
              .catch(err => {
                console.log('error adding event to host', err);
                this.$errNotify('Error adding event to host, please save event again');
              });
            this.$q.notify({
              message: 'Event Saved',
              color: 'positive'
            });
          }).catch(err => {
            this.$isLoading(false);
            //eslint-disable-next-line-no-console
            console.log('error creating event', err);
            this.$q.notify({
              message: 'Error Saving Event',
              color: 'negative'
            });
          });
      }
    }
  };
</script>
