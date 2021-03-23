<template>
    <GoogleMapLoader
            class="map"
            :mapConfig="mapConfig"
            :apiKey="loadKey"
    >
        // insert your google maps api key to render styled map
        <template slot-scope="{ google, map }">
            <GoogleMapMarker
                    v-for="marker in markers"
                    :key="marker.id"
                    :marker="marker"
                    :google="google"
                    :map="map"
            />
            <GoogleMapLine
                    v-for="line in lines"
                    :key="line.id"
                    :path.sync="line.path"
                    :google="google"
                    :map="map"
            />
        </template>
    </GoogleMapLoader>
</template>

<script>
  import {loadGmaps} from '../../../service/places';
  import GoogleMapLoader from './loader';
  import GoogleMapMarker from './mixins/marker';
  import GoogleMapLine from './mixins/line';

  import { mapSettings } from './constants/mapSettings';

  export default {
    name: 'MapView',
    components: {
      GoogleMapLoader,
      GoogleMapMarker,
      GoogleMapLine
    },

    data() {
      return {
        markers: [
          {
            id: 'a',
            position: { lat: 40.287827, lng: -111.6934355 }
          }
        ],
        lines: [
          {
            id: '1',
            path: [{ lat: 3, lng: 101 }, { lat: 5, lng: 99 }]
          },
          {
            id: '2',
            path: [{ lat: 5, lng: 99 }, { lat: 6, lng: 97 }]
          }
        ]
      };
    },
    mounted() {
      loadGmaps(process.env.VUE_APP_GCP_PLACES_API_KEY);
    },
    computed: {
      mapConfig() {
        return {
          ...mapSettings,
          center: this.mapCenter
        };
      },
      loadKey(){
        return (process.env.VUE_APP_GCP_PLACES_API_KEY);
      },
      mapCenter() {
        return this.markers[0].position;
      }
    }
  };
</script>

<style>
    .map {
        height: 100%;
        width: 100%;
    }

</style>
