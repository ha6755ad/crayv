<template>
  <q-card flat style="height: 100%; width: 100%" class="pointer" @click="expandBoundary">

    <div class="t-r">
      <q-btn dense flat icon="mdi-pencil-box" v-if="editing" @click="editDialog = true"></q-btn>
    </div>

    <div class="__info_box flex flex-center q-pa-md">
      <div class="text-xs text-mb-sm text-weight-bold">
        <div>Boundary Name: {{ lget(value, 'name', 'Untitled') }}</div>
        <q-separator dark/>
        <div>Base Service Pricing:</div>
        <div class="text-xxs text-mb-xs q-px-md">

        </div>
      </div>
    </div>
    <mapbox
      polygons
      :geo-in="featureList"
    ></mapbox>
    <q-dialog v-if="routeSlide === slide" maximized transition-hide="slide-down" transition-show="slide-up"
              :value="true">
      <q-card style="height: 100vh; width: 100vw; overflow-y: scroll">
        <!--        <q-btn dense flat class="bg-dark text-light t-r-f" icon="mdi-close" style="z-index: 100" @click="$router.go(-1)"/>-->
        <slot name="pricing"></slot>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editDialog"></q-dialog>
  </q-card>
</template>

<script>
  import Mapbox from '../../utils/mapbox/map/mapbox';
  import {mapGetters} from 'vuex';

  export default {
    name: 'GeoCard',
    components: { Mapbox },
    props: {
      editing: Boolean,
      slide: String,
      value: Object,
    },
    mounted() {
      console.log('got boundary value', this.value);
    },
    data(){
      return {
        editDialog: false
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal) {
          let id = this.lget(newVal, 'vendor');
          if (id && this.$lisEmpty(this.stateVendor)) {
            this.$store.dispatch('crayv-vendors/get', id);
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', { stateUser: 'user' }),
      ...mapGetters('crayv-vendors', { getVendor: 'get' }),
      stateVendor() {
        let id = this.lget(this.value, 'vendor');
        if (id) return this.getVendor(id);
        else return null;
      },
      featureList() {
        return this.$lget(this.value, 'geo', []);
      },
      routeSlide() {
        return this.$route.params.slide;
      }
    },
    methods: {
      expandBoundary() {
        console.log('wxpanding');
        let obj = Object.assign({}, this.$route.params);
        obj.slide = this.slide;
        this.$router.push({ name: this.$route.name, params: obj });
      }
    }
  };
</script>

<style scoped lang="scss">
  .__info_box {
    position: absolute;
    height: 100%;
    width: 100%;
    border-radius: inherit;
    background: rgba(0, 0, 0, .5);
    color: white;
    z-index: 9;
  }
</style>
