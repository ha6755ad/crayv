<template>
  <div id="google" style="border-radius: inherit">
    <loader :map-config="mapConfig"
            :timeout="$attrs.timeout"
            :apiKey="apiKey" @idle="handleIdle"
            :show-window="showWindow"
            @googleInit="val => {$emit('googleInit', val)}"
            @clickPosition="val => {$emit('clickPosition', val)}"

    >
      <template slot-scope="{ google, map }">
          <slot name="map_coord" :google="google"
                :map="map"/>
        <marks v-if="!!markers" :positions="markers" :config="config" :google="google" :map="map"></marks>
        <lines v-if="!!lines" :positions="lines" :config="config" :google="google" :map="map"></lines>
        <poly v-if="!!poly" :positions="poly" :config="config" :google="google" :map="map"></poly>
        <info-window v-if="!!infoBoxes" :positions="infoBoxes" :config="config" :google="google" :map="map"></info-window>
      </template>
    </loader>
  </div>
</template>

<script>
  import loader from './loader/loader';
  import marks from './marks/marks';
  import lines from './lines/lines';
  import poly from './poly/poly';
  import infoWindow from './infoWindow/infoWindow';
  import mapMixins from './mixins/mapMixins';
  import {getColoredIconUrl} from './utils/icon-url-generator';

  export default {
    name: 'google',
    props: {
      markers: {
        type: Array,
        required: false
      },
      markClusters: {
        type: Boolean,
        required: false,
        default: true
      },
      showWindow: Boolean,
      infoBoxes: {
        type: Array,
        required: false
      },
      lines: {
        type: Array,
        required: false
      },
      poly: {
        type: Array,
        required: false
      },
      config: {
        type: Object,
        required: false,
        default: function () {
          return {};
        }
      }
    },
    components: {
      loader,
      marks,
      lines,
      poly,
      infoWindow,
    },
    mixins: [
      mapMixins
    ],
    data(){
      return {
      };
    },
    mounted(){
    },
    computed: {
      apiKey(){
        return process.env.VUE_APP_GCP_PLACES_API_KEY;
      },
      mapConfig() {
        return {
          ...{
            zoom: 14,
            center: {lat: 40.431259, lng: -111.891739},
            icon: {
              url: getColoredIconUrl('ballWithPoleInHole', '#C0FFEE', '#B00B1E'),
              anchor: {x: 14, y: 14}
            },
            editable: true,
            draggable: true,
            clickable: true
          },
          ...this.config
        };
      }
    },
    methods: {
      handleIdle(value) {
        // console.log('idle in google')
        this.$emit('idle', value);
      }
    }
  };
</script>

<style scoped src="./_google.scss" lang="scss">
</style>
