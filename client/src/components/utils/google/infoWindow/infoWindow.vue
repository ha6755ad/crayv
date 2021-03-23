<template>
  <div></div>
</template>

<script>
  const TILE_SIZE = 256;

  export default {
    name: 'infoWindow',
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
      config: {
        type: Object,
        required: false
      }
    },
    data () {
      return {
        marker: null,
        position: null,
        markerCluster: null
      };
    },
    mounted () {
      if ((typeof this.positions === 'object') || (Array.isArray(this.positions) && this.positions.length > 0)) {
        for (var i = 0; i < this.positions.length; i++) {
          this.position = this.positions[i];
          this.setInfoWindow(this.position);
        }
      }
    },
    methods: {
      setInfoWindow (location) {
        const coordInfoWindow = new this.google.maps.InfoWindow();
        var point = new this.google.maps.LatLng(location.position.lat, location.position.lng);
        coordInfoWindow.setContent(this.createInfoWindowContent(point, this.map.getZoom()));
        coordInfoWindow.setPosition(point);
        coordInfoWindow.open(this.map);

        this.map.addListener('zoom_changed', function () {
          coordInfoWindow.setContent(this.createInfoWindowContent(point, this.map.getZoom()));
          coordInfoWindow.open(this.map);
        }.bind(this));
      },
      createInfoWindowContent (latLng, zoom) {
        var scale = 1 << zoom;

        var worldCoordinate = this.project(latLng);

        var pixelCoordinate = new this.google.maps.Point(
          Math.floor(worldCoordinate.x * scale),
          Math.floor(worldCoordinate.y * scale));

        var tileCoordinate = new this.google.maps.Point(
          Math.floor(worldCoordinate.x * scale / TILE_SIZE),
          Math.floor(worldCoordinate.y * scale / TILE_SIZE));

        return [
          'location , IL',
          'LatLng: ' + latLng,
          'Zoom level: ' + zoom,
          'World Coordinate: ' + worldCoordinate,
          'Pixel Coordinate: ' + pixelCoordinate,
          'Tile Coordinate: ' + tileCoordinate
        ].join('<br>');
      },
      // The mapping between latitude, longitude and pixels is defined by the web
      // mercator projection.
      project (latLng) {
        var siny = Math.sin(latLng.lat() * Math.PI / 180);

        // Truncating to 0.9999 effectively limits latitude to 89.189. This is
        // about a third of a tile past the edge of the world tile.
        siny = Math.min(Math.max(siny, -0.9999), 0.9999);

        return new this.google.maps.Point(
          TILE_SIZE * (0.5 + latLng.lng() / 360),
          TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
      }
    }
  };
</script>

