<template>
  <div class="__near_me q-pa-md">
    <div class="row">
      <div>
        <div class="text-sm text-mb-sm">Bought and reviewed</div>
        <div class="text-xs text-mb-xs text-weight-light">by people near you</div>
      </div>
      <q-space></q-space>
      <boundary-filter
        behavior="dialog"
        flat
        flex
        uom="mi"
        :factor="1.609344"
        :value="mi"
        @input="handleKm"
        color="primary"
        :text-limit="25"
      ></boundary-filter>
    </div>
    <q-separator class="q-my-sm"></q-separator>
    <div style="width: 500px; max-width: 100%">
      <search-item v-model="searchInput"></search-item>
    </div>
    <div class="q-py-md" style="position: relative">
      <q-btn dense flat icon="mdi-filter-variant" color="secondary"></q-btn>
      <q-slide-transition>
      <div class="row" v-if="selected">
        <q-chip  dark square size="lg"
                color="secondary" :label="selected.label" removable @remove="selected = null"></q-chip>
      </div>
      </q-slide-transition>
    </div>
    <div class="row q-pa-md">
      <q-chip dark v-for="(tag, i) in $searchAndMatch(tags, searchInput, ['label'])" :key="`tag-${i}`" square size="lg"
              color="nice" :label="tag.label" clickable @click="selected = tag"></q-chip>
    </div>
    <q-separator class="q-my-sm"></q-separator>
    <div class="row">
      <q-card style="height: 300px; width: 300px;" v-for="(home, i) in houseFilter" :key="`home-${i}`" class="q-ma-sm">
        <google-home :zoom-in="17" :longitude="lget(home, 'fullAddress.longitude')" :latitude="lget(home, 'fullAddress.latitude')"></google-home>
      </q-card>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations} from 'vuex';
  import BoundaryFilter from 'components/common/atoms/filters/BoundaryFilter';
  import SearchItem from 'components/common/atoms/search/SearchItem';
  import GoogleHome from 'components/map-buy/components/my-home/GoogleHome';

  export default {
    name: 'NearMe',
    components: { GoogleHome, SearchItem, BoundaryFilter },
    mounted(){
      this.houses.forEach(async h => {
        h.fullAddress = await this.findAddress(h.address);
      });
    },
    data() {
      return {
        selected: null,
        mi: 20,
        searchInput: '',
        houses: [
          {
            address: '775 N 2525 W West Point Ut',
            fullAddress: null,
            buys: ['Insurance', 'Pools & Hot Tubs', 'Farm Produce']
          },
          {
            address: '3102 N 1050 W Lehi Ut',
            fullAddress: null,
            buys: ['Insurance', 'Cars', 'Solar Power', 'Vacations']
          },
          {
            address: '1005 Barnes Dr Kaysville Ut',
            fullAddress: null,
            buys: ['Generators', 'Solar Power', 'Cars', 'Farm Produce']
          },
          {
            address: '2301 E Shiloh Way Murray Ut',
            fullAddress: null,
            buys: ['Construction Services', 'Vacations', 'Cars', 'House Cleaning', 'Farm Produce']
          }
        ]
      };
    },
    watch: {
      selected: {
        immediate: true,
        handler(){
          this.$emit('input', this.houseFilter.map(a => a.fullAddress));
        }
      }
    },
    computed: {
      ...mapGetters('auth', { authUser: 'user' }),
      ...mapGetters('users', { getUser: 'get' }),
      ...mapGetters({ coordinates: 'coordinates' }),
      houseFilter(){
        return this.houses.filter(a => a.buys.includes(this.lget(this.selected, 'label', '!')));
      },
      user() {
        let id = this.lget(this.authUser, '_id');
        if (id) return this.getUser(id);
        else return null;
      },
      latitude() {
        return this.lget(this.activeAddress, 'latitude', this.lget(this.coordinates, [1], this.lget(this.user, 'addresses[0].latitude')));
      },
      longitude() {
        return this.lget(this.activeAddress, 'longitude', this.lget(this.coordinates, [0], this.lget(this.user, 'addresses[0].longitude')));
      },
      tags() {
        return [
          { label: 'Insurance' },
          { label: 'Pools & Hot Tubs' },
          { label: 'Construction Services' },
          { label: 'Farm Produce' },
          { label: 'Cars' },
          { label: 'Solar Power' },
          { label: 'Generators' },
          { label: 'House Cleaning' },
          { label: 'Vacations' },
        ];
      },
    },
    methods: {
      ...mapMutations('tomtom-geocode', { clearAddresses: 'clearAll' }),
      // ...mapActions('tomtom-autocomplete', {findAddresses: 'find'}),
      ...mapActions('tomtom-geocode', { findgeocoded: 'find' }),
      async findAddress(val){
        await this.clearAddresses();
        return await this.findgeocoded({
          query: {
            text: val
          },
        }).then(res => {
          console.log('address res', res);
          let a = this.lget(res, 'data[0]');
          if(a) return this.$tomtomToAddress(a);
          else return null;
        })
          .catch(err => {
            console.log('address search err', err.message);
          });
      },
      handleKm(val) {
        // this.mi = val;
        console.log('emit from nearme', val);
        this.$emit('input', val);
      }
    }
  };
</script>

<style scoped lang="scss">
  .__near_me {
    max-width: 100%;
    width: 4000px;
    z-index: 1;
    border-radius: 20px;
    background: rgba(255, 255, 255, .87);
    box-shadow: 0 0 15px rgba(11, 11, 11, .4);
  }
</style>
