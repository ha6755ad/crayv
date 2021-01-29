<template>
  <div style="width: 100%">
    <template v-if="loading">
      <logo-loading :img="img"></logo-loading>
    </template>
    <template v-else>
      <div
        style="border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,.4); min-height: 30vh; width: 700px; max-width: 95vw"
        class="flex flex-center q-pa-md bg-white">
        <div>
          <div class="row justify-center q-py-md">
            <div class="text-sm text-mb-sm text-weight-bold q-px-md">
              <div class="text-left">
                Looks like your {{ $q.screen.lt.md ? 'phone' : 'computer' }} is being stingy with your location
              </div>
              <div class="text-xs text-mb-xs text-weight-light">
                We can't show you products unless we know who's selling in your area.
              </div>
            </div>
          </div>
          <div class="row justify-center" style="width: 100%">
            <div style="max-width: 500px; width: 100%">
              <tomtom-autocomplete
                placeholder="Enter Your City..."
                item_text="formatted"
                @input="addAddress"
                display-path="city"
                :value="address"
                chips
                input-class="text-xs text-mb-xs text-weight-medium"
              ></tomtom-autocomplete>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import TomtomAutocomplete from 'components/utils/mapbox/tomtom/TomtomAutocomplete';
  import {mapGetters} from 'vuex';
  import LogoLoading from 'components/common/atoms/loading/LogoLoading';

  export default {
    name: 'NeedLocation',
    components: { LogoLoading, TomtomAutocomplete },
    props: {
      img: String,
      timeout: {
        type: Number,
        default: 5000
      }
    },
    mounted() {
      setTimeout(() => {
        this.loading = false;
      }, this.timeout);
    },
    data() {
      return {
        loading: true
      };
    },
    watch: {
      address: {
        immediate: true,
        handler(newVal) {
          if (this.lget(newVal, 'latitude')) {
            this.loading = false;
          }
        }
      }
    },
    computed: {
      ...mapGetters({ address: 'address' }),
    },
    methods: {
      addAddress(val) {
        let lng = this.lget(val, 'longitude');
        let lat = this.lget(val, 'latitude');
        if (lng && lat) {
          this.$store.dispatch('setCoordinates', [lng, lat]);
          this.$store.dispatch('setAddress', val);
        }
      },
    }
  };
</script>

<style scoped>

</style>
