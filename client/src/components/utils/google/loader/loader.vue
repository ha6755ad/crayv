<template>
  <div style="height: 100%; width: 100%; border-radius: inherit; overflow: hidden;">
    <div id="loader" style="border-radius: inherit"></div>
    <template v-if="!!this.google && !!this.map">
      <slot :google="google"
            :map="map"/>
    </template>
  </div>
</template>

<script>
  import GoogleMapsApiLoader from 'google-maps-api-loader';
  // eslint-disable-next-line no-unused-vars
  import google from 'components/utils/google/google';

  export default {
    name: 'loader',
    props: {
      mapConfig: Object,
      apiKey: String,
      showWindow: Boolean,
    },
    data () {
      return {
        google: null,
        map: null,
        TILE_SIZE: 150
      };
    },
    watch: {
      mapConfig: {
        immediate: true,
        handler (newVal) {
          if (this.lget(newVal, 'center.lat') && this.google) {
            this.initializeMap();
          }
        }
      }
    },
    mounted () {
      // console.log('loader', this.apiKey)
      GoogleMapsApiLoader({
        apiKey: this.apiKey
      }).then((google) => {
        this.google = google;
        this.initializeMap();
      });
      // The mapping between latitude, longitude and pixels is defined by the web
      // mercator projection.

    },
    methods: {
      createInfoWindowContent (latLng, zoom) {
        var scale = 1 << zoom;
        // console.log('scale:', scale);
        var worldCoordinate = this.project(latLng);
        var pixelCoordinate = new this.google.maps.Point(
          Math.floor(worldCoordinate.x * scale),
          Math.floor(worldCoordinate.y * scale));
        var tileCoordinate = new this.google.maps.Point(
          Math.floor(worldCoordinate.x * scale / this.TILE_SIZE),
          Math.floor(worldCoordinate.y * scale / this.TILE_SIZE));
        // console.log('tileCoordinate:', tileCoordinate);
        this.$emit('idle', {
          LatLng: latLng,
          zoom: zoom,
          worldCoordinate: worldCoordinate,
          pixelCoordinate: pixelCoordinate,
          tileCoordinate: tileCoordinate,
          lat: latLng.lat(),
          lng: latLng.lng()
        });
        return [
          'Map',
          'LatLng: ' + latLng,
          'Zoom level: ' + zoom,
          'World Coordinate: ' + worldCoordinate,
          'Pixel Coordinate: ' + pixelCoordinate,
          'Tile Coordinate: ' + tileCoordinate
        ].join('<br>');
      },
      project (latLng) {
        var siny = Math.sin(latLng.lat() * Math.PI / 180);
        // Truncating to 0.9999 effectively limits latitude to 89.189. This is
        // about a third of a tile past the edge of the world tile.
        siny = Math.min(Math.max(siny, -0.9999), 0.9999);
        return new this.google.maps.Point(
          this.TILE_SIZE * (0.5 + latLng.lng() / 360),
          this.TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
      },
      initializeMap () {
        // eslint-disable-next-line no-console
        // console.log('center', this.$attrs.timeout);
        var center = new this.google.maps.LatLng(this.lget(this.mapConfig, 'center.lat'), this.lget(this.mapConfig, 'center.lng'));
        // console.log('initializing map', center)
        const mapContainer = this.$el.querySelector('#loader');
        const { Map } = this.google.maps;
        this.map = new Map(mapContainer, this.mapConfig);
        if (this.showWindow) {
          var coordInfoWindow = new this.google.maps.InfoWindow();
          coordInfoWindow.setContent(this.createInfoWindowContent(center, this.map.getZoom()));
          coordInfoWindow.setPosition(center);
          coordInfoWindow.open(this.map);
          this.map.addListener('zoom_changed', () => {
            // console.log('zooming', this.map.getZoom())
            coordInfoWindow.setContent(this.createInfoWindowContent(center, this.map.getZoom()));
            coordInfoWindow.open(this.map);
          });
          this.map.addListener('idle', () => {
            coordInfoWindow.setContent(this.createInfoWindowContent(this.map.getCenter(), this.map.getZoom()));
          });
          this.map.addListener('click', function(e) {
            console.log('i am clickin on the map. ', e);
          });
        } else {
          this.map.addListener('zoom_changed', () => {
            // console.log('zooming', this.map.getZoom())
            this.createInfoWindowContent(center, this.map.getZoom());
          });
          this.map.addListener('idle', () => {
            this.createInfoWindowContent(this.map.getCenter(), this.map.getZoom());
          });
          let that = this;
          this.map.addListener('click', function(e) {
            console.log('i am clickin on the map. ', e);
            that.$emit('clickPosition', e);
          });
          this.$emit('googleInit', {google: this.google, map: this.map});
        }
      }
    },
    // provide() {
    //   return {
    //     google: this.google,
    //     map: this.map
    //   }
    // }
  };
</script>

<style scoped lang="scss" src="./_loader.scss">
</style>
