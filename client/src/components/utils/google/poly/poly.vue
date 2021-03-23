<template>
  <div></div>
</template>

<script>
  export default {
    name: 'poly',
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
        type: Object,
        required: true
      },
      icons: {
        type: [Object, Array],
        required: true
      },
      setAroundPoints: {
        type: Boolean,
        required: false,
        default: false
      },
      config: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        marker: null,
        bounds: {},
        southWest: {},
        northEast: {},
        lngSpan: {},
        latSpan: {},
      };
    },
    mounted() {
      const {Polygon} = this.google.maps;
      const overrideConfig = query => ({
        ...query.icon && {icon: location.icon}, // Type:  Array<IconSequence> optional - The icons to be rendered along the polyline.
        ...query.title && {title: location.title},
        ...query.clickable && {clickable: location.clickable}, // Type:  boolean optional - Indicates whether this Polyline handles mouse events. Defaults to true.
        ...query.draggable && {draggable: location.draggable}, // Type:  boolean optional - If set to true, the user can drag this shape over the map. The geodesic property defines the mode of dragging. Defaults to false.
        ...query.editable && {editable: location.editable}, // Type:  boolean optional - If set to true, the user can edit this shape by dragging the control points shown at the vertices and on each segment. Defaults to false.
        ...query.geodesic && {geodesic: location.geodesic}, // Type:  boolean optional - When true, edges of the polygon are interpreted as geodesic and will follow the curvature of the Earth. When false, edges of the polygon are rendered as straight lines in screen space. Note that the shape of a geodesic polygon may appear to change when dragged, as the dimensions are maintained relative to the surface of the earth. Defaults to false.
        ...query.strokeColor && {strokeColor: location.strokeColor}, // Type:  string optional - The stroke color. All CSS3 colors are supported except for extended named colors.
        ...query.strokeOpacity && {strokeOpacity: location.strokeOpacity}, // Type:  number optional - The stroke opacity between 0.0 and 1.0.
        ...query.strokeWeight && {strokeWeight: location.strokeWeight}, // Type:  number optional - The stroke width in pixels.
        ...query.visible && {visible: location.visible}, // Type:  boolean optional - Whether this polyline is visible on the map. Defaults to true.
        ...query.zIndex && {zIndex: location.zIndex}, // Type:  number optional - The zIndex compared to other polys.
      });
      this.polyline = new Polygon({
        path: this.positions.map(a => a.position),
        map: this.map,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        title: 'Polygon!',
        ...this.config,
        ...this.icons,
        ...overrideConfig
      });
    },
    methods: {

    }
  };
</script>
