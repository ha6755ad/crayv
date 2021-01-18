<template>
  <q-card flat style="height: 100%; width: 100%; border-radius: 10px; overflow: hidden" class="pointer"
          @click="$emit('add', value)">

    <div class="__info_box flex flex-center q-pa-md">

      <div class="t-l">
        <default-avatar :value="value"></default-avatar>
      </div>

      <div class="t-r" style="z-index: 10">
        <q-btn color="white" dense flat icon="mdi-pencil-box" v-if="editing" @click="editDialog = true"></q-btn>
      </div>


      <div>
        <div class="text-sm text-mb-md text-weight-bold __one-liner">{{ lget(value, 'name', 'Untitled') }}</div>
        <q-separator dark/>
        <div class="text-xs text-mb-xs">Selling in:</div>
        <marketplace-item dark :value="stateMarketplace"></marketplace-item>
      </div>
    </div>
    <mapbox
      polygons
      :geo-in="featureList"
    ></mapbox>

    <q-dialog v-model="editDialog" position="left" transition-hide="slide-left" transition-show="slide-right"
              :maximized="$q.screen.lt.sm">
      <q-card style="width: 600px; max-width: 100vw">
        <q-btn dense size="sm" flat icon="mdi-close" class="bg-dark text-light t-r-f" @click="editDialog = false"/>
        <vendor-settings-form :value="value"></vendor-settings-form>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
  import Mapbox from '../../utils/mapbox/map/mapbox';
  import {mapGetters} from 'vuex';
  import VendorSettingsForm from 'components/vendor/settings/VendorSettingsForm';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import MarketplaceItem from 'components/marketplace/cards/MarketPlaceItem';

  export default {
    name: 'GeoCard',
    components: { MarketplaceItem, DefaultAvatar, VendorSettingsForm, Mapbox },
    props: {
      editing: Boolean,
      slide: String,
      value: Object,
    },
    mounted() {
      console.log('got boundary value', this.value);
    },
    data() {
      return {
        editDialog: false
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal) {
          let vendorId = this.lget(newVal, 'vendor');
          if (vendorId && !this.lget(this.stateVendor, '_id')) {
            this.$store.dispatch('crayv-vendors/get', vendorId);
          }
          let marketplaceId = this.lget(newVal, 'marketplace');
          if (marketplaceId && !this.stateMarketplace) {
            this.$store.dispatch('crayv-marketplaces/get', marketplaceId);
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', { stateUser: 'user' }),
      ...mapGetters('crayv-vendors', { getVendor: 'get' }),
      ...mapGetters('crayv-marketplaces', { getMarketplace: 'get' }),
      stateMarketplace() {
        let id = this.lget(this.value, 'marketplace');
        if (id) return this.getMarketplace(id);
        else return null;
      },
      stateVendor() {
        let id = this.lget(this.value, 'vendor');
        if (id) return this.getVendor(id);
        else return null;
      },
      featureList() {
        return this.$lget(this.value, 'geo', null);
      },
      routeSlide() {
        return this.$route.params.slide;
      }
    },
    methods: {}
  };
</script>

<style scoped lang="scss">
  .__info_box {
    position: absolute;
    height: 100%;
    width: 100%;
    border-radius: inherit;
    background: rgba(0, 0, 0, .6);
    color: white;
    z-index: 9;
  }
</style>
