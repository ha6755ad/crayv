<template>
  <div style="position: absolute; top: 0; left: 0; height: 100%; width: 100%; border-radius: inherit; overflow: hidden">
    <div :id="id" :class="id" style="height: 100%; width: 100%; position: absolute; top: 0; left: 0">

    </div>
  </div>
</template>

<script>
  import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
  import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
  import MapboxDraw from '@mapbox/mapbox-gl-draw';

  const lget = require('lodash.get');
  // const lset = require('lodash.set');

  export default {
    name: 'mapbox',
    props: {
      id: {
        type: String,
        default: 'map'
      },
      activeItem: Number,
      fitBounds: Boolean,
      center: {
        type: [Object, Array],
        default: function () {
          return [-111.876183, 40.758701];
        }
      },
      maxZoom: { type: Number, default: 15 },
      zoom: {
        type: Number,
        default: 10
      },
      //TODO: make custom marker a config object
      customMarker: { required: false },
      fill_color: {
        type: String,
        default: '#ff4577'
      },
      autoZoom: {
        type: Boolean,
        default: true,
      },
      styleId: { type: String, default: 'mapbox://styles/mapbox/streets-v11' },
      markerDrag: Boolean,
      geoIn: Object,
      markersIn: Array,
      polygons: { type: Boolean, default: true },
      drawing: Boolean,
      fullScreen: Boolean,
      hoverOn: {
        type: Boolean,
        default: true
      },
      popupOn: Boolean
    },
    mounted() {
      mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_API;


      this.map = new mapboxgl.Map({
        container: this.id,
        style: this.styleId,
        center: this.center,
        zoom: this.zoom,
        maxZoom: this.maxZoom
      });

      this.map.on('click', (e) => {
        console.log('map click');
        this.$emit('mapTouch', e);
      });

      setTimeout(() => {
        if (this.fullScreen) {
          this.map.addControl(new mapboxgl.FullscreenControl());
        }
        if (this.polygons && this.geoIn) {
          this.showPolygons(this.geoIn);
        }
        if (this.drawing) {
          this.draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
              polygon: true,
              trash: true
            }
          });
          this.map.addControl(this.draw);
          this.map.on('draw.create', this.updateArea);
          this.map.on('draw.delete', this.updateArea);
          this.map.on('draw.update', this.updateArea);
        }
      }, 10);
      // .scrollZoom.disable()
    },
    data() {
      return {
        mountTries: 0,
        layerTry: 0,
        draw: null,
        map: null,
        markers: [],
        marker: null,
        popup: null,
        hoverId: null,
        layerName: 'poly'
      };
    },
    watch: {
      geoIn: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          let rmv = !!this.polygons &&
            !!lget(newVal, 'features[0]') && !!oldVal;
          this.showPolygons(newVal, rmv);
        }
      },
      activeItem: {
        immediate: true,
        handler(newVal, oldVal) {
          console.log('toggle acitve', newVal, oldVal);
          if ((newVal || newVal === 0) && newVal > -1) {
            this.hoverId = newVal;
            this.toggleHover(newVal, true);
          }
          if ((oldVal || oldVal === 0) && oldVal > -1) {
            this.toggleHover(oldVal, false);
          }
        }
      },
      flatPoints: {
        immediate: true,
        handler(newVal) {
          console.log('flat points change');
          if (this.lget(newVal, [0])) {
            // eslint-disable-next-line no-console
            // console.log('setting view', newVal);
            setTimeout(() => {
              if (this.autoZoom) {
                this.setBoundingView(newVal);
              }
            }, 300);
            if (this.pointList && this.pointList.length) {
              this.setMapMarkers(newVal);
            }
          }
        }
      },
      center: {
        immediate: true,
        handler(newVal) {
          if (newVal && typeof newVal !== 'undefined') {
            this.setMapCenter(newVal);
          }
        }
      },
    }
    ,
    computed: {
      pointList() {
        if (this.markersIn) return this.markersIn;
        else {
          let geo = lget(this.geoIn, 'features', []).map(a => a.geometry).filter(b => b.type === 'Point');
          return geo;
        }
      }
      ,
      flatPoints() {
        if (this.markersIn) return this.markersIn;
        else {
          let geo = lget(this.geoIn, 'features', []).map(a => a.geometry);
          let list = [];
          geo.forEach(a => {
            if (a.type === 'Point') {
              list.push(a.coordinates);
            } else {
              // eslint-disable-next-line no-console
              // console.log('pushing coord', a);
              a.coordinates[0].forEach(coord => {
                list.push(coord);
              });
            }
          });
          // return [].concat.apply([], geo)
          return list;
        }
      }
    }
    ,
    methods: {
      showPolygons(a, rmv) {
        if (rmv && this.layerName) {
          setTimeout(() => {
            this.map.removeLayer(this.layerName);
          }, 200);
        } else {
          // eslint-disable-next-line no-console
          lget(a, 'features', []).forEach((f, i) => {
            f.id = i;
          });
          console.log('show', a);
          this.layerName = lget(a, 'name', 'poly');
          // if (a.geometry.type === 'Polygon') {
          //interactive features require id, so add one if there isn't one
          // eslint-disable-next-line no-console
          // console.log('got poly', a);
          console.log('map', this.map);
          if (this.map) {
            this.map.addSource(`src-${this.layerName}`, {
              'type': 'geojson',
              'data': a
            });
            this.map.addLayer({
              'id': this.layerName,
              'type': 'fill',
              'source': `src-${this.layerName}`,
              'layout': {},
              'paint': {
                'fill-color': this.fill_color,
                'fill-opacity': [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  .7,
                  0.5
                ]
              }
            });
            this.addTouchListener(this.layerName);
            // }
          } else {
            if (this.layerTry < 10) {
              setTimeout(() => {
                this.showPolygons(a);
              }, 300);
              this.layerTry++;
            }
          }
        }
      }
      ,
      addTouchListener(id) {
        const addListener = (listenerOn, listenerOff, srcId) => {
          this.map.on(listenerOn, srcId, e => {
            if (e.features.length > 0) {
              let sendId = lget(e, `features[${0}].id`, 0);
              this.hoverid = sendId;
              // console.log('hover id', sendId);
              this.toggleHover(sendId, true);
            }
          });

          this.map.on(listenerOff, srcId, () => {
            if (this.hoverId || this.hoverId === 0) {
              this.toggleHover(this.hoverId, false);
            }
            this.hoverId = null;
          });
        };
        addListener('touchstart', 'touchend', id);
        addListener('mousemove', 'mouseleave', id);
        this.map.on('click', id, e => {
          // console.log('map click', e);
          this.$emit('mapClick', e);
        });
      }
      ,
      toggleHover(srcId, val) {
        if (val) {
          if (this.hoverId || this.hoverId === 0) {
            // console.log('toggle hover', srcId, val);
            this.map.setFeatureState(
              { source: `src-${this.layerName}`, id: this.hoverId },
              { hover: false }
            );
          }
          this.hoverId = srcId;
          this.map.setFeatureState(
            { source: `src-${this.layerName}`, id: this.hoverId },
            { hover: true }
          );
        } else {
          this.map.setFeatureState(
            { source: `src-${this.layerName}`, id: this.hoverId },
            { hover: false }
          );
        }
      }
      ,
      updateArea() {
        let data = this.draw.getAll();
        // eslint-disable-next-line no-console
        this.$emit('poly', data);
      }
      ,
      setMapCenter(val) {
        if (this.map && typeof this.map !== 'undefined') {
          this.map.setCenter(val);
          // setTimeout(() => {
          //   if (this.markerList && this.markerList.length) {
          //     this.setMapMarkers(this.markerList)
          //   }
          // }, 5000)
        } else {
          setTimeout(() => this.setMapCenter(val), 200);
        }
      }
      ,
      markerDragEnd(marker) {
        let lngLat = marker.getLngLat();
        this.$emit('pin', lngLat);
      }
      ,
      async setMapMarkers(val) {
        // console.log('setting map markers', val, this.customMarker);
        let map = this.map;
        if (this.map && typeof this.map !== 'undefined') {
          await this.markers.forEach(m => {
            m.remove();
          });
          let list = [];
          val.forEach((a, i) => {
            // eslint-disable-next-line no-console
            // console.log('setting marker', a, map);
            let obj = { color: 'var(--q-color-nice', id: `marker-${i}`, draggable: this.markerDrag };
            if (this.customMarker) {
              let el = document.createElement('div');
              el.draggable = this.markerDrag;
              if (typeof this.customMarker !== 'object') {
                el.style.background = 'rgba(0,0,0,.2)';
                el.style.border = 'solid 5px var(--q-color-primary)';
                el.style.width = '150px';
                el.style.height = '150px';
                el.style.borderRadius = '50%';
              } else {
                Object.keys(this.customMarker).forEach(k => {
                  el.style[k] = this.customMarker[k];
                });
              }
              obj = el;
            }
            let marker = new mapboxgl.Marker(obj)
              .setLngLat(a)
              .addTo(map);
            list.push(marker);
            marker.on('dragend', () => {
              this.markerDragEnd(marker);
            });
          });
          this.markers = list;
          // if (list && list.length > 1) {
          //   this.setBoundingView(val)
          // }
        } else {
          this.mountTries++;
          if (this.mountTries < 10) {
            setTimeout(() => this.setMapMarkers(val), 200);
          } else this.$quickNotify('Unable to display map');
        }
      }
      ,
      setBoundingView(val) {
        // eslint-disable-next-line no-console
        console.log('fitting bounds', val);
        // Pass the first coordinates in the LineString to `lngLatBounds` & wrap each coordinate pair in `extend` to include them in the bounds
        let bounds = val.reduce(function (bounds, coord) {
          return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(val[0], val[0]));

        setTimeout(() => {
          this.map.fitBounds(bounds, {
            padding: 100,
            maxZoom: this.maxZoom
          });
        }, 50);
      }
      ,
    }
  }
  ;
</script>

<style scoped lang="scss">
  @import url("https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css");
  @import url("https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v2.2.0/mapbox-gl-geocoder.css");

  .map {
    height: 100%;
    width: 100%;
  }

  .mapbox-ctrl {
    color: #1c1c1c;
  }

  .mapboxgl-marker {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 1px solid gray;
    background-color: var(--q-color-secondary);
    transform: none !important;
  }

  .mapbox-gl-draw_polygon {
    background: #1c1c1c !important
  }

  /*marker {*/
  /*  background: rgba(0, 0, 0, 0.5);*/
  /*  color: #fff;*/
  /*  position: absolute;*/
  /*  bottom: 40px;*/
  /*  left: 10px;*/
  /*  padding: 5px 10px;*/
  /*  margin: 0;*/
  /*  font-size: 11px;*/
  /*  line-height: 18px;*/
  /*  border-radius: 3px;*/
  /*  display: none;*/
  /*}*/
</style>
