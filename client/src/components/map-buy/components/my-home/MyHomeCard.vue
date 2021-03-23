<template>
  <div class="__my_home_card">

    <div class="row">
      <div class="col-12 col-md-8 q-pa-sm">
        <div class="__home_cards q-pa-md" style="height: 350px;">
          <div style="height: 40px;" class="row justify-center text-center">
            <div>
              <div class="text-xs text-mb-xs text-weight-light">Your Est. Home Value</div>
              <div class="text-lg text-mb-lg text-nice text-weight-bolder">
                {{ $dollarString(lget(value, 'estValue', 10000 * latitude), '$', 0) }}
              </div>
            </div>
          </div>
          <div style="height: 300px; width: 100%;">
            <line-chart></line-chart>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 q-pa-sm">
        <div class="__home_cards q-pa-sm" style="height: 350px">
          <google-home :latitude="latitude" :longitude="longitude"></google-home>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import LineChart from 'components/common/charts/LineChart';
  import {mapGetters} from 'vuex';
  import GoogleHome from 'components/map-buy/components/my-home/GoogleHome';

  export default {
    name: 'MyHomeCard',
    components: { GoogleHome, LineChart },
    props: {
      value: Object,
      activeAddress: Object
    },
    mounted(){
    },
    data() {
      return {

      };
    },
    computed: {
      ...mapGetters('auth', { authUser: 'user' }),
      ...mapGetters('users', { getUser: 'get' }),
      ...mapGetters({ coordinates: 'coordinates' }),
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
      }
    },
    methods: {

    }
  };
</script>

<style scoped>
  .__my_home_card {
    z-index: 1;
    width: 1200px;
    max-width: 100%;
  }

  .__home_cards {
    border-radius: 20px;
    background: rgba(255, 255, 255, .87);
    box-shadow: 0 0 15px rgba(11, 11, 11, .4);
  }
</style>
