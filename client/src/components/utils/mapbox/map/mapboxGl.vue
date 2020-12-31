<template>
  <MglMap
    :accessToken="accessToken"
    :mapStyle.sync="mapStyle"
    :zoom="zoom"
    :center="center"
  >
    <template v-for="(marker, i) in markerList">
      <MglMarker :key="i" :coordinates="marker" color="black" @added="markerAdd" style="z-index: 1000"></MglMarker>
    </template>
  </MglMap>
</template>

<script>
  import Mapbox from 'mapbox-gl';
  import {MglMap, MglMarker} from 'vue-mapbox';

  export default {
    components: {
      MglMap, MglMarker
    },
    props: {
      center: {
        type: [Object, Array],
        default: function () {
          return [-111.876183, 40.758701];
        }
      },
      zoom: {
        type: Number,
        default: 10
      },
      markerList: Array
    },
    data() {
      return {
        accessToken: process.env.VUE_APP_MAPBOX_API,
        mapStyle: 'mapbox://styles/mapbox/streets-v11'
      };
    },

    created() {
      // We need to set mapbox-gl library here in order to use it in template
      this.mapbox = Mapbox;
    },
    methods: {
      markerAdd(e){
        // eslint-disable-next-line no-console
        console.log('added marker', e);
      }
    }
  };
</script>
