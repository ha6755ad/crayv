/* eslint-disable no-unused-vars */
import colorPalette from './colorPallette';

const {
  COLOR_LANDSCAPE,
  COLOR_BORDERS,
  COLOR_WATER,
  COLOR_LINE,
  COLOR_POINT_FILL,
  COLOR_SELECTED_POINT
} = colorPalette;

const COLORS = {
  BORDERS: COLOR_BORDERS,
  LANDSCAPE: COLOR_LANDSCAPE,
  LINE: COLOR_LINE,
  POINT: COLOR_SELECTED_POINT,
  POINT_FILL: COLOR_POINT_FILL,
  WATER: COLOR_WATER
};

const POINT_MARKER_ICON_CONFIG = {
  path: 'M 0, 0 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0',
  strokeOpacity: 0.7,
  strokeWeight: 4,
  strokeColor: COLORS.POINT,
  fillColor: COLORS.POINT_FILL,
  fillOpacity: 0.7,
  scale: 1
};

const LINE_SYMBOL_CONFIG = {
  path: 'M 0,-2 0,2',
  strokeOpacity: 1,
  strokeWeight: 2,
  scale: 1
};

const LINE_PATH_CONFIG = {
  clickable: true,
  geodesic: false,
  strokeOpacity: 0,
  strokeColor: COLORS.LINE,
  icons: [
    {
      icon: LINE_SYMBOL_CONFIG,
      repeat: '10px'
    }
  ]

};

const DRAWER_CONFIG = {
  center: null, //Type:  LatLng|LatLngLiteral optional - The center of the Circle.
  clickable: true,  //Type:  boolean optional - Indicates whether this Circle handles mouse events. Defaults to true.
  draggable: false, //Type:  boolean optional - If set to true, the user can drag this circle over the map. Defaults to false.
  editable: false, //Type:  boolean optional - If set to true, the user can edit this circle by dragging the control points shown at the center and around the circumference of the circle. Defaults to false.
  fillColor: null, //Type:  string optional - The fill color. All CSS3 colors are supported except for extended named colors.
  fillOpacity: 1, //Type:  number optional - The fill opacity between 0.0 and 1.0.
  map: null, //Type:  Map optional - Map on which to display the Circle.
  radius: null, //Type:  number optional - The radius in meters on the Earth's surface.
  strokeColor: null, //Type:  string optional - The stroke color. All CSS3 colors are supported except for extended named colors.
  strokeOpacity: 1, //Type:  number optional - The stroke opacity between 0.0 and 1.0.
  strokePosition: null, //Type:  StrokePosition optional - The stroke position. Defaults to CENTER. This property is not supported on Internet Explorer 8 and earlier.
  strokeWeight: null, //Type:  number optional - The stroke width in pixels.
  visibleL: true, //Type:  boolean optional - Whether this circle is visible on the map. Defaults to true.
  zIndex: null, //Type:  number optional - The zIndex compared to other polys.
};

const mapSettings = {
  clickableIcons: true,
  streetViewControl: true,
  panControlOptions: false,
  gestureHandling: 'cooperative',
  backgroundColor: COLORS.LANDSCAPE,
  mapTypeControl: false,
  zoomControlOptions: {
    style: 'SMALL'
  },
  zoom: 5
};

export { mapSettings, LINE_PATH_CONFIG, POINT_MARKER_ICON_CONFIG };
