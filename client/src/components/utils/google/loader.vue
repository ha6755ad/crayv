<template>
  <div>
    <div
      class="google-map"
      ref="googleMap"
    ></div>
    <template v-if="Boolean(this.google) && Boolean(this.map)">
      <slot
        :google="google"
        :map="map"
      />
    </template>
  </div>
</template>

<script>
  import GoogleMapsApiLoader from 'google-maps-api-loader';

  export default {
    props: {
      mapConfig: Object,
      apiKey: String,
      libraries: Array
    },

    data() {
      return {
        google: null,
        map: null
      };
    },
    async mounted() {
      const googleMapApi = await GoogleMapsApiLoader({
        apiKey: this.apiKey,
        libraries: this.libraries || ['places', 'drawing']
      });
      this.google = googleMapApi;
      this.initializeMap();
    },

    methods: {
      initializeMap() {
        const mapContainer = this.$refs.googleMap;
        this.map = new this.google.maps.Map(
          mapContainer,
          {
            mapSettings: {
              backgroundColor: '#dfd2ae', //Type:  string optional - Color used for the background of the Map div. This color will be visible when tiles have not yet loaded as the user pans. This option can only be set when the map is initialized.
              center: null, //Type:  LatLng|LatLngLiteral optional - The initial Map center. Required.
              clickableIcons: true, //Type:  boolean optional - When false, map icons are not clickable. A map icon represents a point of interest, also known as a POI. By default map icons are clickable.
              controlSize: null, //Type:  number optional - Size in pixels of the controls appearing on the map. This value must be supplied directly when creating the Map, updating this value later may bring the controls into an undefined state. Only governs the controls made by the Maps API itself. Does not scale developer created custom controls.
              disableDefaultUI: true, //Type:  boolean optional - Enables/disables all default UI. May be overridden individually.
              disableDoubleClickZoom: true, //Type:  boolean optional - Enables/disables zoom and center on double click. Enabled by default. (Note: This property is not recommended. To disable zooming on double click, you can use the gestureHandling property, and set it to "none".)
              draggable: true, //Type:  boolean optional - If false, prevents the map from being dragged. Dragging is enabled by default. (Note: This property is deprecated. To disable dragging on the map, you can use the gestureHandling property, and set it to "none".)
              draggableCursor: null, //Type:  string optional - The name or url of the cursor to display when mousing over a draggable map. This property uses the css cursor attribute to change the icon. As with the css property, you must specify at least one fallback cursor that is not a URL. For example: draggableCursor: 'url(http://www.example.com/icon.png), auto;'.
              draggingCursor: null, //Type:  string optional - The name or url of the cursor to display when the map is being dragged. This property uses the css cursor attribute to change the icon. As with the css property, you must specify at least one fallback cursor that is not a URL. For example: draggingCursor: 'url(http://www.example.com/icon.png), auto;'.
              fullscreenControl: false, //Type:  boolean optional - The enabled/disabled state of the Fullscreen control.
              fullscreenControlOptions: null, //Type:  FullscreenControlOptions optional - The display options for the Fullscreen control.
              gestureHandling: 'cooperative', //Type:  string optional - This setting controls how the API handles gestures on the map. Allowed values:
              // "cooperative": Scroll events and one-finger touch gestures scroll the page, and do not zoom or pan the map. Two-finger touch gestures pan and zoom the map. Scroll events with a ctrl key or ⌘ key pressed zoom the map. In this mode the map cooperates with the page.
              // "greedy": All touch gestures and scroll events pan or zoom the map.
              // "none": The map cannot be panned or zoomed by user gestures.
              // "auto": (default) Gesture handling is either cooperative or greedy, depending on whether the page is scrollable or in an iframe.
              heading: null, //Type:  number optional - The heading for aerial imagery in degrees measured clockwise from cardinal direction North. Headings are snapped to the nearest available angle for which imagery is available.
              keyboardShortcuts: true, //Type:  boolean optional - If false, prevents the map from being controlled by the keyboard. Keyboard shortcuts are enabled by default.
              mapTypeControl: false, //Type:  boolean optional - The initial enabled/disabled state of the Map type control.
              mapTypeControlOptions: null, //Type:  MapTypeControlOptions optional - The initial display options for the Map type control.
              mapTypeId: 'ROADMAP', //Type:  MapTypeId|string optional - The initial Map mapTypeId. Defaults to ROADMAP.
              maxZoom: null, //Type:  number optional - The maximum zoom level which will be displayed on the map. If omitted, or set to null, the maximum zoom from the current map type is used instead. Valid values: Integers between zero, and up to the supported maximum zoom level.
              minZoom: null, //Type:  number optional - The minimum zoom level which will be displayed on the map. If omitted, or set to null, the minimum zoom from the current map type is used instead. Valid values: Integers between zero, and up to the supported maximum zoom level.
              noClear: false, //Type:  boolean optional - If true, do not clear the contents of the Map div.
              restriction: null, //Type:  MapRestriction optional - Defines a boundary that restricts the area of the map accessible to users. When set, a user can only pan and zoom while the camera view stays inside the limits of the boundary.
              rotateControl: true, //Type:  boolean optional - The enabled/disabled state of the Rotate control.
              rotateControlOptions: null, //Type:  RotateControlOptions optional - The display options for the Rotate control.
              scaleControl: true, //Type:  boolean optional - The initial enabled/disabled state of the Scale control.
              scaleControlOptions: null, //Type:  ScaleControlOptions optional - The initial display options for the Scale control.
              scrollwheel: true, //Type:  boolean optional - If false, disables zooming on the map using a mouse scroll wheel. The scrollwheel is enabled by default. (Note: This property is not recommended. To disable zooming using scrollwheel, you can use the gestureHandling property, and set it to either "cooperative" or "none".)

              streetView: null, //Type:  StreetViewPanorama optional - A StreetViewPanorama to display when the Street View pegman is dropped on the map. If no panorama is specified, a default StreetViewPanorama will be displayed in the map's div when the pegman is dropped.
              streetViewControl: true, //Type:  boolean optional - The initial enabled/disabled state of the Street View Pegman control. This control is part of the default UI, and should be set to false when displaying a map type on which the Street View road overlay should not appear (e.g. a non-Earth map type).
              streetViewControlOptions: null, //Type:  StreetViewControlOptions optional - The initial display options for the Street View Pegman control.
              styles: [], //Type:  Array<MapTypeStyle> optional - Styles to apply to each of the default map types. Note that for satellite/hybrid and terrain modes, these styles will only apply to labels and geometry.
              tilt: null, //Type:  number optional - Controls the automatic switching behavior for the angle of incidence of the map. The only allowed values are 0 and 45. The value 0 causes the map to always use a 0° overhead view regardless of the zoom level and viewport. The value 45 causes the tilt angle to automatically switch to 45 whenever 45° imagery is available for the current zoom level and viewport, and switch back to 0 whenever 45° imagery is not available (this is the default behavior). 45° imagery is only available for satellite and hybrid map types, within some locations, and at some zoom levels. Note: getTilt returns the current tilt angle, not the value specified by this option. Because getTilt and this option refer to different things, do not bind() the tilt property; doing so may yield unpredictable effects.
              zoom: 5, //Type:  number optional - The initial Map zoom level. Required. Valid values: Integers between zero, and up to the supported maximum zoom level.
              zoomControl: true, //Type:  boolean optional - The enabled/disabled state of the Zoom control.
              zoomControlOptions: {style: 'SMALL'} //Type:  ZoomControlOptions optional - The display options for the Zoom control.
            }
          }
        );


        const drawingManager = new this.google.maps.drawing.DrawingManager({
          drawingMode: this.google.maps.drawing.OverlayType.MARKER,
          drawingControl: true,
          drawingControlOptions: {
            position: this.google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
          },
          markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
          circleOptions: {
            center: null, //Type:  LatLng|LatLngLiteral optional - The center of the Circle.
            clickable: true,  //Type:  boolean optional - Indicates whether this Circle handles mouse events. Defaults to true.
            draggable: true, //Type:  boolean optional - If set to true, the user can drag this circle over the map. Defaults to false.
            editable: true, //Type:  boolean optional - If set to true, the user can edit this circle by dragging the control points shown at the center and around the circumference of the circle. Defaults to false.
            fillColor: 'light-gray', //Type:  string optional - The fill color. All CSS3 colors are supported except for extended named colors.
            fillOpacity: 0.1, //Type:  number optional - The fill opacity between 0.0 and 1.0.
            map: null, //Type:  Map optional - Map on which to display the Circle.
            radius: null, //Type:  number optional - The radius in meters on the Earth's surface.
            strokeColor: 'dark-gray', //Type:  string optional - The stroke color. All CSS3 colors are supported except for extended named colors.
            strokeOpacity: 0.5, //Type:  number optional - The stroke opacity between 0.0 and 1.0.
            strokePosition: 'CENTER', //Type:  StrokePosition optional - The stroke position. Defaults to CENTER. This property is not supported on Internet Explorer 8 and earlier.
            strokeWeight: 1, //Type:  number optional - The stroke width in pixels.
            visibleL: true, //Type:  boolean optional - Whether this circle is visible on the map. Defaults to true.
            zIndex: 1, //Type:  number optional - The zIndex compared to other polys.
          },
          PolygonOptions: {}
        });
        drawingManager.setMap(this.map);
      }
    }
  };
</script>

<style scoped>
  .google-map {
    width: 100%;
    min-height: 100%;
  }
</style>
