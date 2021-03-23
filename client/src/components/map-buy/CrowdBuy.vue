<template>
  <q-page style="position: relative; width: 100%;">

    <template v-if="longitude">

      <div style="transition: all .3s ease-out" class="t-l">
        <q-btn v-if="!search" round push class="bg-light text-dark" icon="mdi-magnify" @click="search = !search">
        </q-btn>
        <div :style="search ? { width: '500px', maxWidth: '95%'} : { display: 'none', opacity: 0 }">
        <tomtom-autocomplete
          @clear="activeAddress = null"
          placeholder="Search Address..."
          item_text="formatted"
          @input="activeAddress = $event"
          :value="activeAddress"
          chips
          input-class="text-xs text-mb-xs text-weight-medium"
        >
          <template v-slot:prepend>
            <q-btn round flat class="bg-light text-dark" icon="mdi-magnify" @click="search = !search">
            </q-btn>
          </template>
        </tomtom-autocomplete>
        </div>
      </div>

      <div style="position: relative; height: 95vh; width: 100%">
        <mapbox
          :auto-zoom="!mi"
          id="CrowdBuy"
          @mapTouch="tab = -1"
          :center="[longitude, latitude]"
          :markers-in="markers"
        ></mapbox>
      </div>

      <tab-drawer
        :tabs="tabs"
        v-model="tab"
        @input="mi = 0"
      >
      </tab-drawer>

      <div class="__preview">
        <component
          :is="lget(tabs, [tab, 'preview'])"
          v-bind="lget(tabs, [tab, 'previewAttrs'])"
          @input="lget(tabs, [tab, 'handleInput'])($event)"
        ></component>
      </div>
    </template>

    <template v-else>
      <div style="height: 90vh; width: 100%;" class="flex flex-center bg-white">
        <div style="position: fixed; top: 0; left: -50vw; height: 100vh; width: 200vw; z-index: 0">
          <div style="height: 100%; width: 100%">
            <blobs></blobs>
          </div>
        </div>
        <div style="z-index: 1">
          <need-location img="https://ha6755ad-images.s3-us-west-1.amazonaws.com/crayv_standard.svg"></need-location>
        </div>
      </div>
    </template>

  </q-page>
</template>

<script>
  import Mapbox from 'components/utils/mapbox/map/mapbox';
  import TabDrawer from 'components/common/atoms/tabs/TabDrawer';
  import MyHomeCard from 'components/map-buy/components/my-home/MyHomeCard';
  import Blobs from 'components/common/atoms/custom-icons/Blobs';
  import NeedLocation from 'components/common/atoms/loading/NeedLocation';
  import {mapGetters} from 'vuex';
  import TomtomAutocomplete from 'components/utils/mapbox/tomtom/TomtomAutocomplete';
  import NearMe from 'components/map-buy/components/ratings/NearMe';

  export default {
    name: 'CrowdBuy',
    components: { TomtomAutocomplete, NeedLocation, Blobs, TabDrawer, Mapbox },
    data() {
      return {
        tab: 0,
        search: false,
        activeAddress: null,
        mi: 0,
        setMarkers: []
      };
    },
    computed: {
      ...mapGetters('auth', { authUser: 'user' }),
      ...mapGetters('users', { getUser: 'get' }),
      ...mapGetters({ coordinates: 'coordinates' }),
      geoCircle(){
        return this.$createGeoJSONCircle([this.longitude, this.latitude], this.mi / 1.609344);
      },
      user(){
        let id = this.lget(this.authUser, '_id');
        if(id) return this.getUser(id);
        else return null;
      },
      latitude(){
        return this.lget(this.activeAddress, 'latitude', this.lget(this.coordinates, [1], this.lget(this.user, 'addresses[0].latitude')));
      },
      longitude(){
        return this.lget(this.activeAddress, 'longitude', this.lget(this.coordinates, [0], this.lget(this.user, 'addresses[0].longitude')));
      },
      markers(){
        return this.lget(this.setMarkers, [0]) ? this.setMarkers.map(a => {
          return [a.longitude, a.latitude];
        }) : [[this.longitude, this.latitude]];
      },
      tabs() {
        return [
          {
            label: 'My Home',
            avatar: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/crayv/map-buy/home.svg',
            preview: MyHomeCard,
            previewAttrs: { activeAddress: this.activeAddress }
          },
          {
            label: 'Market',
            avatar: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/crayv/map-buy/graph_chart.svg'
          },
          {
            label: 'Reviews',
            avatar: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/crayv/map-buy/review.svg',
            preview: NearMe,
            previewAttrs: { activeAddress: this.activeAddress },
            handleInput: (val) => {
              console.log('handle mi', val);
              this.mi = val;
            }
          },
          {
            label: 'Shop',
            avatar: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/crayv/map-buy/shop.svg'
          },
          {
            label: 'Chat',
            avatar: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/crayv/map-buy/chat.svg'
          },
        ];
      }
    }
  };
</script>

<style scoped lang="scss">
  .__preview {
    position: absolute;
    top: 3vw;
    right: 3vw;
    max-width: 94%;
    z-index: 1;
  }
</style>
