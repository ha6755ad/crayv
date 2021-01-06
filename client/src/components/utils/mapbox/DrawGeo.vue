<template>
  <div style="position: relative; height: 100%; width: 100%; z-index: 1; display: grid; grid-template-rows: auto 1fr; grid-template-columns: 100%">
    <div>
      <q-card flat>
        <q-list separator>
          <q-item v-for="(item, i) in lget(value, 'features', [])" :key="`geo-feature-${i}`" clickable @mouseenter="active = i" @mouseleave="active = -1" @touchstart="active = i" @touchend="active = -1" >
            <q-item-section>
              <q-item-label>{{lget(item, 'name', 'Untitled Boundary')}}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat dense icon="mdi-delete" @click="$emit('rmv', i)"/>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>
    <div style="width: 100%; height: 100%; position: relative">
      <mapbox
        :id="id"
        fullScreen
        drawing
        @poly="setBoundary"
        polygons
        :geo-in="value"
        :active-item="active"
      ></mapbox>
    </div>
  </div>
</template>

<script>
  import Mapbox from './map/mapbox';

  export default {
    name: 'DrawGeo',
    components: { Mapbox },
    props: {
      id: {
        type: String,
        default: 'map'
      },
      value: Object
    },
    data(){
      return {
        form: {},
        active: -1
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal){
          this.form = Object.assign({}, newVal);
        }
      }
    },
    computed: {
    },
    methods: {
      setBoundary (val) {
        this.form = val;
        this.$emit('input', this.form);
      }
    }
  };
</script>
