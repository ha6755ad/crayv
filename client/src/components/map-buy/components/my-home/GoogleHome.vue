<template>
  <div style="width: 100%; height: 100%; position: relative; border-radius: 10px;">
    <div style="z-index: 10;" class="b-l flex items-center">
      <q-btn size="sm" dense class="text-dark bg-white" icon="mdi-rotate-3d" @click="changeTilt()"></q-btn>
      <q-btn v-if="tilt" size="sm" dense color="dark" icon="mdi-rotate-right" @click="changeHeading(90)"></q-btn>
      <q-btn v-if="tilt" size="sm" dense color="dark" icon="mdi-rotate-left" @click="changeHeading(-90)"></q-btn>
    </div>
    <google
      :config="mapConfig"
      :showWindow="false"
      @idle="handleIdle"
      :timeout="300"
      @googleInit="handleGoogleInit"
      @clickPosition="handleClickPosition">
      <template v-slot:map_coord="{ /*google, map*/ }">
      </template>
    </google>
  </div>
</template>

<script>
  import Google from 'components/utils/google/google';
  export default {
    name: 'GoogleHome',
    props: {
      latitude: Number,
      longitude: Number,
      zoomIn: Number
    },
    components: { Google },
    data(){
      return {
        tilt: 0,
        map: undefined,
        google: undefined,
        mapMarkers: [],
      };
    },
    computed: {
      mapConfig() {
        return {
          center: {
            lat: this.latitude,
            lng: this.longitude
          },
          fullScreenControl: false,
          zoom: this.zoomIn ? this.zoomIn : 3,
          maxZoom: 24,
          heading: 0,
          rotateControl: false,
          zoomControl: true,
          rotate: 0,
          mapTypeId: 'satellite',
          mapTypeControl: false,
          tilt: 0,
          streetViewControl: false,
          type: 'satellite'
        };
      },
    },
    methods: {
      changeHeading(val) {
        const heading = this.map.getHeading() || 0;
        this.map.setHeading(heading + val);
      },
      changeTilt(){
        let tilt = this.map.getTilt();
        let val = tilt > 0 ? 0 : 45;
        this.tilt = val;
        this.map.setTilt(val);
      },
      handleIdle(value) {
        // console.log('idle in proposal', value);
        this.zooming = true;
        this.infoWindow = Object.assign({}, value);
      },
      handleClickPosition(val) {
        console.log('you ARE clickin the map!!!!', val.latLng.toJSON());
        this.clickPosition = val.latLng.toJSON();
        console.log('this.clickposition', this.clickPosition);
        console.log('these are the current map markers', [...this.mapMarkers]);
      },
      handleGoogleInit(val) {
        console.log('google init');
        this.google = val.google;
        this.map = val.map;
        let latLng = new this.google.maps.LatLng({
          lat: this.lget(this.coordinates, [1]),
          lng: this.lget(this.coordinates, [0])
        });
        // console.log('latLng', latLng)
        this.map.setCenter(latLng);
        this.map.setZoom(20);
        // console.log('system design this.map', this.map)
      }
    }
  };
</script>

<style scoped>

</style>
