<template>
  <q-card flat class="bg-transparent" style="height: 100%; width: 100%;">
    <template v-if="!stateEvent || !stateEvent._id || !stateCommunity">
      <q-card class="flex flex-center">
        <q-spinner-dots color="primary" />
      </q-card>
    </template>
    <template v-else>
    <div class="__event_top_banner">
      <div class="__event_img">
        <img :src="getAvatar(stateEvent, 'images', 'large', imgIdx)">

        <!--        Next buttons-->
        <template v-if="lget(stateEvent, 'images', []).length > 1">
          <q-btn class="__next_btn right" round flat icon="mdi-chevron-right"
                 @click="imgIdx < stateEvent.images.length - 1 ? imgIdx++ : imgIdx = 0"/>
          <q-btn class="__next_btn left" icon="mdi-chevron-right"
                 @click="imgIdx > 0 ? imgIdx-- : imgIdx = stateEvent.images.length - 1"/>
        </template>

        <div class="__shade"/>
        <div class="__title_row">
          <div class="__event_title text-white">
            <div class="text-weight-bold text-lg text-mb-lg">{{ stateEvent.name }}</div>
            <q-btn class="glossy" color="secondary" label="register" @click="registerDialog = true">
            </q-btn>
          </div>
          <q-space/>
          <q-avatar size="5vw">
            <img v-if="stateCommunity.avatar" :src="getAvatar(stateCommunity, 'avatar', 'medium')">
            <template v-else>
              {{ lget(stateCommunity, 'name', '!').charAt(0) }}
            </template>
          </q-avatar>
        </div>
      </div>
    </div>
    <div class="row justify-center">
      <q-card square class="__info_card q-pa-md" style="min-height: 60vh">
        <div class="row">
          <template v-for="(item, i) in eventTabs">
            <q-btn :size="$q.screen.lt.md ? 'sm' : ''" style="position: relative" flat :key="`tab-${i}`"
                   :label="item.label" :icon="item.icon"
                   :color="tab === i ? `${$darkest()}` : 'grey-6'" @click="tab = i">
              <div class="btn_bottom_border"
                   :style="tab === i ? { background: `var(--q-color-${$darkest()}`} : {width: 0}"/>
            </q-btn>
            <q-separator :key="`separator-${i}`" vertical v-if="i < eventTabs.length - 1"/>
          </template>
        </div>
        <div class="col-12  q-mt-lg">
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel :name="0">
              <q-card flat>
                <q-list separator>
                  <q-item v-for="(item, i) in eventHighlights" :key="`hightlight-${i}`">
                    <q-item-section avatar>
                      <q-icon :color="$darkest()" :name="item.icon"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <div v-html="sanitize(item.html)"></div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card>
              <q-separator/>
              <q-card flat class="q-pa-md">
                <div class="text-xs text-mb-xs text-weight-bold">Tickets</div>
                <q-list v-if="eventTickets.length > 0">
                  <q-item v-for="(ticket, i) in eventTickets" :key="`ticket-${i}`">
                      <ticket-card :ticket-in="ticket" :event-in="stateEvent"></ticket-card>
                  </q-item>
                </q-list>
                <div v-else>
                  <q-card flat style="height: 150px; width: 100%" class="flex flex-center text-xs text-md-xs text-weight-light">No Tickets Required {{lget(eventIn, 'attendees.limit', false) ? '- but spots are limited so registration recommended' : ''}}</q-card>
                </div>
              </q-card>
              <div class="row no-wrap q-mt-lg" style="width: 100%; overflow-x: scroll">
                <q-card style="height: 200px; width: 180px" v-for="(image, i) in lget(stateEvent, 'images', [])"
                        :key="`image-row-${i}`">
                  <q-img style="height: 100%; width: 100%" :src="getAvatar(image, null, 'large')"></q-img>
                </q-card>
              </div>
            </q-tab-panel>
            <q-tab-panel :name="1">
              <q-card flat style="max-height: 50vh; overflow-y: scroll">
                <event-schedule
                  :model_start="stateEvent.starts"
                  :model_end="stateEvent.ends"
                  :events="stateEvent.schedule.items"
                ></event-schedule>
              </q-card>
            </q-tab-panel>
            <q-tab-panel :name="2">
              <div class="row justify-center q-py-md">
                <div class="link_box">
                  <q-btn flat round size="sm" @click="copyLink" class="q-mr-sm"
                         icon="mdi-content-copy"></q-btn>
                  <input readonly="readonly"
                         :style="{color: 'white', borderRadius: '5px', border: 'solid 1px var(--q-color-secondary)', width: '35vh'}"
                         :value="addressLink" id="link_text" class="bg-dark text-xxxs text-mb-xxs">
                </div>
              </div>
              <div class="row justify-center">
                <q-card class="__halfs">
                  <mapbox :features-in="featureList" :center="mapCenter" fit-bounds></mapbox>
                </q-card>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
        <a style="text-decoration: none" :href="`https://www.followsomething.com/landing/${stateCommunity._id}`" target="_blank">
          <div class="row justify-end items center text-xs text-mb-xs">
            <div :class="`q-ml-xs pointer text-primary`" style="height: 80%">
              A <span class="text-sm text-mb-md" style="font-family: 'Damion', sans-serif;">Follow</span> community
              event
            </div>
            <div>
              <img style="height: 25px" class="q-mx-xs" src="https://ha6755ad-images.s3-us-west-1.amazonaws.com/follow/follow_logo.svg">
            </div>
          </div>
        </a>
      </q-card>
    </div>
    <q-dialog size="sm" v-model="registerDialog">
      <q-card style="width: 600px; max-width: 100vw">
        <event-registration :event-in="stateEvent" :ticketsIn="eventTickets"></event-registration>
      </q-card>
    </q-dialog>
    </template>
  </q-card>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {date} from 'quasar';
  import mapbox from '../../utils/mapbox/map/mapbox';
  import EventRegistration from '../EventRegistration';
  import EventSchedule from '../calendar/EventSchedule';
  import TicketCard from '../tickets/TicketCard';

  const { formatDate } = date;

  export default {
    name: 'EventDetailsCard',
    components: { TicketCard, EventSchedule, EventRegistration, mapbox },
    props: {
      eventIn: Object,
      communityIn: Object
    },
    mounted(){
      if(!this.eventIn){
        this.$store.dispatch('events/get', this.$route.params.eventId);
      }
    },
    data() {
      return {
        imgIdx: 0,
        tab: 0,
        registerDialog: false,
      };
    },
    watch: {
      stateEvent: {
        immediate: true,
        handler(newVal, oldVal){
          let newId = this.lget(newVal, '_id', false);
          let oldId = this.lget(oldVal, '_id', 1);
          if(newId && newId !== oldId){
            let id = this.lget(this.$route, 'params.id');
            if(id) this.$store.dispatch('communities/get', id);

            this.$store.dispatch('products/find', {
              query: {
                events: {
                  $elemMatch: { id: newVal._id }
                }
              },
              '$populateParams': { name: 'withPromos'}
            });
          }
        }
      }
    },
    computed: {
      ...mapGetters('events', { getEvent: 'get' }),
      ...mapGetters('communities', { getCommunity: 'get' }),
      ...mapGetters('products', { findProducts: 'find' }),
      eventTickets(){
        return this.findProducts({
          query: {
            events: {
              $elemMatch: { id: this.lget(this.stateEvent, '_id') }
            }
          }
        }).data.map(a => a.clone());
      },
      stateEvent(){
        let id = this.lget(this.eventIn, '_id', false);
        return id ? this.eventIn : this.getEvent(this.$route.params.eventId);
      },
      stateCommunity(){
        let id = this.lget(this.communityIn, '_id', false);
        return id ? this.communityIn : this.getCommunity(this.$route.params.id);
      },
      eventTabs() {
        return [
          {
            label: 'Highlights',
            icon: 'mdi-format-list-text'
          },
          {
            label: 'Schedule',
            icon: 'mdi-calendar'
          },
          {
            label: 'Map',
            icon: 'mdi-map-marker-radius'
          }
        ];
      },
      registration() {
        return {
          people: this.lget(this.stateEvent, 'attendees.list', []).filter(a => a.idPath === 'people').length,
          groups: this.lget(this.stateEvent, 'attendees.list', []).filter(a => ['communities, organizations'].includes(a.idPath)).length
        };
      },
      eventHighlights() {
        let people = this.lget(this.registration, 'people', 0);
        let groups = this.lget(this.registration, 'groups', 0);
        let registeredMessage = 'No Information';
        if (people || groups) registeredMessage = `People: ${people} - Groups: ${groups}`;
        return [
          {
            icon: 'mdi-clock',
            html: `<div class="row items-center text-xs text-mb-xs text-weight-bold text-${this.$darkest()}"><div :class="text-${this.secOrDark()} text-weight-medium">${this.formatStart(this.stateEvent.starts)}</div>
                <div>&nbsp;-&nbsp;</div>
                <div :class="text-${this.secOrDark()} text-weight-medium">${this.formatEnd(this.stateEvent.starts, this.stateEvent.ends)}</div></div>`
          },
          {
            icon: 'mdi-information-outline',
            html: `<div class="text-xs text-mb-xs text-weight-light">${this.stateEvent.description}</div>`
          },
          {
            icon: 'mdi-map-marker-radius',
            html: `<div class="text-xxs text-mb-xxs text-weight-medium">${this.lget(this.stateEvent, 'location.features[0].addresses[0].formatted', 'No Location Set')}</div>`
          },
          {
            icon: 'mdi-account-plus',
            html: `<div class="text-xxs text-mb-xxs text-weight-medium"><span class="text-weight-light">Attending:</span> ${registeredMessage}</div>`
          },
          {
            icon: 'mdi-plus-circle',
            html: `<div class="text-xxs text-mb-xxs text-weight-medium"><span class="text-weight-light">Maximum Capacity:</span>  ${this.lget(this.stateEvent, 'attendees.limit', 'No Information')}</div>`
          }
        ];
      },
      eventCommunity() {
        return this.getCommunity(this.$route.params.id);
      },
      eventId() {
        return this.stateEvent ? this.stateEvent._id : this.$route.params.id;
      },
      featureList() {
        return this.stateEvent?.location?.features ? this.stateEvent.location.features : [];
      },
      mapCenter() {
        if (!this.featureList || !this.featureList.length || !this.featureList[0].addresses.length) return [-111.876183, 40.758701];
        else {
          let f = this.featureList[0].geometry;
          let loc = f.type === 'Point' ? f.coordinates : f.coordinates[0];
          return loc;
        }
      },
      features() {
        return this.featureList.map(a => a.geometry);
      },
      addressLink() {
        if (this.stateEvent?.location?.features?.length && this.stateEvent.location.features[0].addresses.length) {
          return this.stateEvent.location.features[0].addresses[0].formatted;
        } else return 'No Valid Event Address Set';
      }
    },
    methods: {
      copyLink() {
        this.$q.notify({
          message: 'Address Copied to Clipboard',
          color: 'info',
          icon: 'mdi-content-copy'
        });
        let text = document.getElementById('link_text');
        text.select();
        text.setSelectionRange(0, 99999);
        document.execCommand('copy');
      },
      formatStart(sd) {
        if (sd) {
          return formatDate(sd, 'ddd MMM DD, YYYY h:mm a');
        } else return 'No Start Set';
      },
      formatEnd(sd, ed) {
        if (ed) {
          if (sd && date.isSameDate(sd, ed, 'day')) {
            return formatDate(ed, 'h:mm a');
          } else {
            return formatDate(sd, 'ddd MMM DD, YYYY h:mm a');
          }
        } else return 'No End Set';
      }
    }
  };
</script>

<style scoped lang="scss">
.__event_top_banner {
  width: 100%;
  height: 55vh;
  display: flex;
  justify-content: center;
  z-index: 1;

  .__event_img {
    width: 110vh;
    max-width: 100vw;
    height: 100%;
    position: relative;
    z-index: 1;
    box-shadow: 0 -3px 5px rgba(0, 0, 0, .5);

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    .__shade {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(192deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, .6));
    }

    .__title_row {
      position: absolute;
      bottom: 2vw;
      left: 0;
      padding: 0 2vw;
      z-index: 2;
      display: flex;
      align-items: center;
      width: 100%;

      .__event_title {
        display: flex;
        flex-direction: column;
      }
    }
  }
}

.__info_card {
  width: 110vh;
  max-width: 100vw;

  .__halfs {
    position: relative;
    height: 600px;
    width: 600px;
    min-width: 100%;
    max-height: 100%;
    max-width: 100%;
  }

  .__next_btn {
    position: absolute;
    z-index: 10;
    top: 50%;
    transform: translateY(-50%);
  }

  .right {
    right: 5px;
  }

  .left {
    left: 5px;
  }
}
</style>
