<template>
  <div>
    <div class="row items-center justify-around">
      <div v-for="(type, i) in boundaryTypes" :key="`boundary-type-${i}`">
        <q-btn @click="changeType(type.value)"
               :icon="boundaryType === type.value ? 'mdi-checkbox-marked-outline' : 'mdi-checkbox-blank-outline'"
               :color="boundaryType === type.value ? 'nice' : 'grey-5'" flat :label="type.label">
          <q-tooltip>{{ type.caption }}</q-tooltip>
        </q-btn>
        <div class="__underline bg-nice" :style="boundaryType === type ? {} : {width: 0}"></div>
      </div>
    </div>

    <div style="height: 550px; transition: all .6s; max-height: 95vw; width: 100%;" v-if="boundaryType === 'draw'"
         class="q-pa-sm">
      <!--        <div style="height: 100%; width: 100%">-->
      <draw-boundary
        :markers-in="[center]"
        single-boundary
        v-model="form"
        @input="handleInput"
        :center="center ? center : coordinates ? coordinates : [-111.876183, 40.758701]"
      ></draw-boundary>
      <!--        </div>-->
    </div>

    <q-slide-transition>
      <div v-if="boundaryType === 'radius'" class="q-py-lg q-px-sm">
        <div class="flex justify-center items-center text-xxs text-mb-xxs text-weight-medium">
          <div>Within</div>
          <q-btn-dropdown
            class="q-mx-sm"
            outline
            color="nice"
            :label="km"
          >
            <q-list>
              <q-item v-for="i in 10" :key="`level-${i}`" clickable @click="addRadius(i * 10)">
                <q-item-section>
                  <q-item-label class="text-center text-xs text-mb-xs text-weight-bold">{{ i * 10 }}km</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <div>km</div>
        </div>
      </div>
    </q-slide-transition>

    <q-slide-transition>
      <div v-if="boundaryType === 'point'" class="q-pa-md text-xs text-mb-xs text-italic">
        No Delivery
      </div>
    </q-slide-transition>
  </div>
</template>

<script>
  import DrawBoundary from 'components/utils/mapbox/map/DrawBoundary';
  import {mapGetters} from 'vuex';

  export default {
    name: 'BoundaryForm',
    components: { DrawBoundary },
    props: {
      value: Object,
      checkChange: Boolean,
      location: Object,
      noSet: Boolean
    },
    mounted() {
      if (this.lget(this.value, 'features', []).some(a => a.name)) {
        this.boundaryType = 'draw';
      } if((!this.value || this.$lisEmpty(this.value)) && !this.noSet) this.addPoint();
    },
    data() {
      return {
        km: 10,
        form: {},
        boundaryType: 'point'
      };
    },
    watch: {
      location: {
        immediate: true,
        handler(newVal, oldVal){
          if((newVal && (!oldVal || JSON.stringify(newVal) !== JSON.stringify(oldVal))) && !this.noSet){
            this.addPoint(this.center);
          }
        }
      },
      value: {
        immediate: true,
        handler(newVal) {
          if (newVal) Object.assign(this.form, Object.assign({}, newVal));
        }
      }
    },
    computed: {
      ...mapGetters({ coordinates: 'coordinates' }),
      center() {
        let lng = this.lget(this.location, 'longitude');
        let lat = this.lget(this.location, 'latitude');
        if (lng && lat) {
          return [lng, lat];
        } else return null;
      },
      boundaryTypes() {
        return [
          { label: 'Pickup Only', value: 'point', caption: 'Buyers pick up at a single location' },
          { label: 'Radius', value: 'radius', caption: 'Deliver within a distance from your location' },
          { label: 'Draw', value: 'draw', caption: 'Draw custom boundaries' },
        ];
      },
    },
    methods: {
      handleInput(val){
        let payload = val ? val : this.form;
        this.$emit('input', payload);
      },
      pointGeo(val) {
        let point = val ? val : this.coordinates;
        return {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: point
              }
            }
          ]
        };
      },
      addPoint(val) {
        this.form = this.pointGeo(val);
        this.handleInput();
      },
      addRadius(val) {
        this.km = val;
        let geo = this.$createGeoJSONCircle(this.center, val);
        console.log('add radius', geo);
        if (geo) {
          this.form = geo;
          this.handleInput(geo);
        } else this.$quickNotify('Error setting radius - try again');
      },
      changeType(val) {
        if (this.checkChange) {
          this.$q.dialog({
            title: 'Change Delivery Area Type?',
            message: 'Changing type will remove any existing boundary data',
            ok: { size: 'sm', color: 'positive', label: 'Yes', push: true },
            cancel: { size: 'sm', color: 'negative', label: 'Go Back', flat: true },
          }).onOk(() => {
            this.form = null;
            this.$emit('input', null);
            this.boundaryType = val;
            if (val === 'point') {
              this.addPoint();
              this.$lset(this.form, 'price.delivery.basePrice', undefined);
            } else if (val === 'radius') {
              this.addRadius(this.km);
            }
          });
        } else {
          this.boundaryType = val;
          if (val === 'point') {
            this.addPoint();
            this.$lset(this.form, 'price.delivery.basePrice', undefined);
          } else if (val === 'radius') {
            this.addRadius(this.km);
          }
        }
      },
    }
  };
</script>

<style scoped>

</style>
