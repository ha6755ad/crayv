<template>
  <div></div>
</template>

<script>
  import MarkerClusterer from '@google/markerclusterer';

  export default {
    name: 'marks',
    // inject: ["google", "map"],
    props: {
      google: {
        type: Object,
        required: true
      },
      map: {
        type: Object,
        required: true
      },
      positions: {
        type: Array,
        required: false
      },
      cluster: {
        type: Boolean,
        required: false,
        default: true
      },
      config: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        marker: null,
        position: null,
        markerCluster: null
      };
    },
    mounted() {
      if ((typeof this.positions === 'object') || (Array.isArray(this.positions) && this.positions.length > 0)) {
        if (this.cluster) {
          this.setClusters();
        } else {
          for (var i = 0; i < this.positions.length; i++) {
            this.position = this.positions[i];
            this.setMark(this.position);
          }
        }
      }
    },
    methods: {
      setMark(location) {
        const {Marker} = this.google.maps;
        const overrideConfig = query => ({
          ...query.icon && {icon: location.icon},
          ...query.shape && {shape: location.shape},
          ...query.title && {title: location.title},
          ...query.label && {label: location.label},
        });
        this.marker = new Marker({
          position: location.position,
          zIndex: location.zIndex,
          map: this.map,
          ...this.config,
          ...overrideConfig
        }.bind(this));
      },
      setClusters() {
        // Add some markers to the map.
        // Note: The code uses the JavaScript Array.prototype.map() method to
        // create an array of markers based on a given "locations" array.
        // The map() method here has nothing to do with the Google Maps API.
        // eslint-disable-next-line no-unused-vars
        var markers = this.positions.map(function(location, i) {
          return new this.google.maps.Marker(location);
        }.bind(this));

        // Add a marker clusterer to manage the markers.
        this.markerCluster = new MarkerClusterer(this.map, markers,
                                                 {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
      }
    }
  };
</script>
