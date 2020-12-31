<template>
  <div class="map_box" :style="{height: height, width: width}">
    <q-btn @click="adding = !adding" v-if="!adding" style="z-index: 2; background: rgba(255,255,255,.3); position: absolute; top: 10px; left: 10px" icon="mdi-plus"/>
    <div class="geo" v-show="adding || features.length === 0" :style="dark ? {background: 'rgba(0,0,0,.6)'} : {}">
      <div class="geo_tool">
        <q-space/>
        <q-btn v-show="features.length !== 0" icon="mdi-close" round flat @click="adding = false"
               style="position: relative; top: -5px; right: -25px;" :dark="dark"/>
      </div>
      <!--      <places-combo-->
      <!--        @input="newEditedAddress = { ...value, ...$event }"-->
      <!--        @error="searchInput = ''" v-model="selectedSuggestion"></places-combo>-->
      <map-autocomplete
        item_text="formatted"
        solo
        :dark="dark"
        @input="addressInput"
        @error="searchInput = ''" v-model="selectedSuggestion"
        @clear="newEditedAddress = editedAddress"
      ></map-autocomplete>
      <q-btn v-show="searchInput || selectedSuggestion" color="secondary" label="save" @click="saveAddress()"/>
    </div>

    <div class="google_box">
      <mapbox :features-in="featureList" :center="mapCenter" fit-bounds></mapbox>
    </div>

  </div>
</template>

<script>
// import {GeoSuggest, loadGmaps} from '../../service/places';
// import Google from '../utils/google/google';
  import debounce from 'lodash.debounce';
  // import PlacesCombo from '../utils/PlacesCombo';
  import MapAutocomplete from './tomtom/TomtomAutocomplete';
  import mapbox from './map/mapbox';

  export default {
    name: 'MapAddress',
    components: {
      mapbox, MapAutocomplete,
    // PlacesCombo
    },
    props: {
      height: {
        type: String,
        default: '500px'
      },
      dark: Boolean,
      width: {
        type: String,
        default: '500px'
      },
      featureList: {
        type: Array,
        default: function () {
          return [];
        }
      },
      editedAddress: {
        type: Object,
        required: false,
        default: function () {
          return {
            name: '',
            formatted: '',
            address1: '',
            address2: '',
            region: '',
            route: '',
            city: '',
            postal: '',
            country: '',
            latitude: 0,
            longitude: 0,
          };
        }
      },
    },
    data() {
      return {
        adding: true,
        debounce: fn => debounce(fn, 200),
        selectedSuggestion: null,
        searchInput: '',
        newEditedAddress: this.editedAddress,
      };
    },
    watch: {
      editedAddress() {
        this.newEditedAddress = this.$props.editedAddress;
      },
    },
    computed: {
      mapCenter() {
        if (!this.featureList || !this.featureList.length || !this.featureList[0].addresses?.length) return [-111.876183, 40.758701];
        else {
          let f = this.featureList[0].geometry;
          let loc = f.type === 'Point' ? f.coordinates : f.coordinates[0];
          return loc;
        }
      },
      features() {
        return this.featureList.map(a => a.geometry);
      }
    },
    methods: {
      addressInput(val){
        this.newEditedAddress = {...val};
      },
      lngLat(val) {
        return [val.longitude, val.latitude];
      },
      saveAddress() {
        if (!this.selectedSuggestion) {
          let c = confirm(`Map Services doesn't recognize this address. Use "${this.searchInput}" anyway?`);
          if (c) {
            this.selectedSuggestion = {name: '', description: this.searchInput};
            this.newEditedAddress = {name: '', formatted: this.searchInput};
            let payload = this.newEditedAddress;
            this.$nextTick(() => this.$emit('input', payload));
            this.$nextTick(() => {
              this.selectedSuggestion = null;
              this.searchInput = '';
            });
          }
        } else {
          let payload = this.newEditedAddress;
          this.$emit('input', payload);
          this.selectedSuggestion = null;
          this.searchInput = '';
        }
      }
    }
  };
</script>

<style scoped>
  .map_box {
    position: relative;
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
    margin-top: 10px;
  }

  .v-menu {
    z-index: 100 !important;
  }

  .geo {
    position: absolute;
    top: 25%;
    left: 50%;
    max-width: 600px;
    padding: 0 20px 20px 20px;
    z-index: 20;
    width: 90%;
    transform: translate(-50%, 0);
    display: flex;
    flex-direction: column;
    color: #fafafa;
    background: rgba(255,255,255, .6);
    border-radius: 5px;
  }

  .geo_tool {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    position: relative;
  }

  .google_box {
    height: 100%;
    width: 100%;
    min-height: 500px;
    position: absolute;
    top: 0; left: 0;
  }

</style>
