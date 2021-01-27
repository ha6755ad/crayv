<template>
  <q-card class="q-pa-md" style="width: 600px; max-width: 100%">
    <div class="row justify-center items-center text-xs text-mb-xs text-weight-medium">
      <div>Within</div>
      <q-btn-dropdown
        class="q-mx-sm"
        outline
        color="nice"
        :label="km"
      >
        <q-list>
          <q-item v-for="i in 10" :key="`level-${i}`" clickable @click="$emit('km', i * 10)">
            <q-item-section>
              <q-item-label class="text-center text-xs text-mb-xs text-weight-bold">{{i * 10}}km</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <div>km</div>
    </div>
    <div class="row justify-center items-center text-xxs text-mb-xxs text-weight-light q-pa-sm">
      of you in&nbsp; <q-btn @click="changing = !changing" class="q-mx-xs" outline :color="color" :icon-right="changing ? 'mdi-menu-up' : 'mdi-menu-down'" :label="lget(address, 'city', 'unknown city')"></q-btn>
    </div>
    <q-separator class="q-my-sm"></q-separator>
    <q-slide-transition>
    <div style="width: 100%" v-if="changing">
      <tab-stepper
        :color="color"
        :tabs="tabs"
        v-model="tab"
      ></tab-stepper>
      <q-tab-panels v-model="tab" animated style="padding: 0">
        <q-tab-panel :name="1" style="padding: 0">
          <div class="q-pa-md">
          <tomtom-autocomplete
            dense
            placeholder="Start Typing..."
            item_text="formatted"
            @input="addAddress"
            @error="searchInput = ''"
            @clear="selectedSuggestion = null"
          >
            <template v-slot:prepend>
              <q-icon name="mdi-magnify"></q-icon>
            </template>
          </tomtom-autocomplete>
          </div>
        </q-tab-panel>
        <q-tab-panel :name="0" style="padding: 40px 0 0 0">
          <div class="row justify-center">
          <q-card style="border-radius: 10px; height: 400px; max-height: 90vw; width: 550px; max-width: 100%">
          <mapbox
            marker-drag
            :center="coordinates"
            :markers-in="[coordinates]"
            :geo-in="$createGeoJSONCircle(coordinates, km)"
            @pin="setLocation"
            ></mapbox>
          </q-card>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    </q-slide-transition>
  </q-card>
</template>

<script>
  import TabStepper from 'components/common/atoms/tabs/TabStepper';
  import {mapState} from 'vuex';
  import {LocationMixin} from 'src/mixins/LocationMixin';
  import TomtomAutocomplete from 'components/utils/mapbox/tomtom/TomtomAutocomplete';
  import Mapbox from 'components/utils/mapbox/map/mapbox';

  export default {
    name: 'BoundaryFilter',
    mixins: [LocationMixin],
    components: { Mapbox, TomtomAutocomplete, TabStepper },
    props: {
      km: { type: Number, default: 10 },
      color: String,
      padding: { type: String, default: 'sm' }
    },
    data() {
      return {
        changing: false,
        tab: 0,
        estimateAddress: true
      };
    },
    computed: {
      ...mapState({ coordinates: 'coordinates' }),
      tabs() {
        return [
          { label: 'Map Pin', icon: 'mdi-map-marker' },
          { label: 'Address', icon: 'mdi-magnify' },
        ];
      },
      defaultAddress() {
        return this.lget(this.user, 'addresses[0]');
      },
      locationText() {
        return this.lget(this.value, 'formatted');
      }
    },
    methods: {
      addAddress(val) {
        let lng = this.lget(val, 'longitude');
        let lat = this.lget(val, 'latitude');
        if (lng && lat) {
          this.$store.dispatch('setCoordinates', [lng, lat]);
          this.$store.dispatch('setAddress', val);
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .__boundary_btn {
    border-radius: 8px;
    box-shadow: 0 0 6px rgba(0, 0, 0, .15);
  }
</style>
