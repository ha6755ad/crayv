<template>
  <div style="width: 100%" class="q-pa-md">
    <div class="row justify-center">
      <div class="text-xs text-mb-xs text-weight-bold pointer">
        <div class="inline">{{ km }}km <q-icon name="mdi-menu-down" class="q-mx-xs"></q-icon></div>
        <q-menu>
          <q-list>
            <q-item v-for="i in 10" :key="`level-${i}`" clickable @click="setKm(i * 10)">
              <q-item-section>
                <q-item-label class="text-center text-xs text-mb-xs text-weight-bold">{{ i * 10 }}km</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </div>
    <div class="q-py-md">
      <tomtom-autocomplete
        dense
        placeholder="Address..."
        item_text="formatted"
        @input="addAddress"
        @error="searchInput = ''"
        @clear="selectedSuggestion = null"
        display-path="city"
        :value="address"
      >
        <template v-slot:prepend>
          <q-icon name="mdi-magnify"></q-icon>
        </template>
      </tomtom-autocomplete>
    </div>
    <div class="row justify-center">
      <q-card style="border-radius: 10px; height: 400px; max-height: 90vw; width: 550px; max-width: 100%">
        <mapbox
          :zoom="km / 6"
          marker-drag
          :center="coordinates"
          :markers-in="[coordinates]"
          :geo-in="lget($createGeoJSONCircle(coordinates, km), 'data')"
          @pin="setLocation"
        ></mapbox>
      </q-card>
    </div>
  </div>
</template>

<script>
  import Mapbox from 'components/utils/mapbox/map/mapbox';
  import TomtomAutocomplete from 'components/utils/mapbox/tomtom/TomtomAutocomplete';
  import {LocationMixin} from 'src/mixins/LocationMixin';
  import {mapGetters} from 'vuex';

  export default {
    name: 'BoundaryTabs',
    components: { TomtomAutocomplete, Mapbox },
    mixins: [LocationMixin],
    props: {
      km: { type: Number, default: 40 },
      color: String
    },
    data() {
      return {
        noLocationCheck: true,
      };
    },
    computed: {
      ...mapGetters({ coordinates: 'coordinates' }),
    },
    methods: {
      addAddress(val) {
        let lng = this.lget(val, 'longitude');
        let lat = this.lget(val, 'latitude');
        if (lng && lat) {
          this.$store.dispatch('setCoordinates', [lng, lat]);
          this.$store.dispatch('setAddress', val);
        }
      },
      setKm(val){
        console.log('set in tabs', val);
        this.$emit('km', val);
      }
    }
  };
</script>

<style scoped>

</style>
