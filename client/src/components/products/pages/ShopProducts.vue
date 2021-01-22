<template>
  <q-page class="q-pa-md">
    <div
      class="bg-white"
      :style="{
      transition: 'all .15s',
      width: '60px',
      borderRadius: menu ? '5px 5px 0 0' : '5px',
      transform: menu ? 'translate(0, 2px)' : null,
      border: 'solid 1px rgba(0,0,0,.4)',
      borderBottom: menu ? 'none' : 'solid 1px rgba(0,0,0,.4)'
    }">
      <q-btn @click="menu = !menu" :icon-right="`mdi-menu-${menu ? 'up' : 'down'}`" dense flat icon="mdi-filter-variant"></q-btn>
    </div>
    <q-slide-transition>
    <div class="row q-pa-sm" style="border: solid 1px rgba(0,0,0,.4); border-radius: 0 8px 8px 8px" v-if="menu">
      <div class="col-6 col-md-4 q-pa-sm">
        <btn-picker
          v-model="vendorFilter"
          :options="vendorSettings"
          empty-label="Vendor..."
          before-text="Vendor Filter"
          color="white"
          :size-in="$q.screen.lt.md ? 'sm' : ''"
          text-color="dark"
          outline
          multiple
          rounded
          clearable
        ></btn-picker>
      </div>
      <div class="col-6 col-md-4 q-pa-sm">

      </div>
    </div>
    </q-slide-transition>
    <div class="q-py-lg" style="width: 100%; height: 80vh">
      <div class="__shop_grid">
        <q-card class="q-pa-md" flat v-for="(product, i) in products" :key="`prod-grid-${i}`">
          <corner-card :value="product"></corner-card>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
  import {makeFindPaginateMixin} from '@ionrev/iy-common-client-lib';
  import {mapGetters} from 'vuex';
  import BtnPicker from 'components/common/atoms/pickers/BtnPicker';
  import CornerCard from 'components/products/card/ProductCard';

  export default {
    name: 'ShopProducts',
    components: { CornerCard, BtnPicker },
    mixins: [
      makeFindPaginateMixin({
        name: 'products',
        qid: 'products',
        service: 'crayv-products',
        query() {
          return this.productQuery;
        },
        makeFindMixinOptions() {
          return {};
        }
      }),
      makeFindPaginateMixin({
        name: 'productGroups',
        qid: 'productGroups',
        service: 'crayv-product-groups',
        query() {
          return this.productGroupQuery;
        },
        makeFindMixinOptions() {
          return {};
        }
      }),
      makeFindPaginateMixin({
        name: 'lineups',
        qid: 'lineups',
        service: 'crayv-product-lineups',
        query() {
          return this.lineupQuery;
        },
        makeFindMixinOptions() {
          return {};
        }
      }),
      makeFindPaginateMixin({
        name: 'vendors',
        qid: 'vendors',
        service: 'crayv-vendors',
        query() {
          return this.vendorQuery;
        },
        makeFindMixinOptions() {
          return {};
        }
      }),
      makeFindPaginateMixin({
        name: 'vendorSettings',
        qid: 'vendorSettings',
        service: 'crayv-vendor-settings',
        query() {
          return this.vendorSettingsQuery;
        },
        makeFindMixinOptions() {
          return {};
        }
      })
    ],
    data() {
      return {
        vendorFilter: null,
        menu: true
      };
    },
    computed: {
      ...mapGetters({ marketplace: 'marketplaceContext' }),
      productIds() {
        let inLineups = this.$flattenArray(this.lineups.map(a => a.products));
        return inLineups;
      },
      productGroupIds() {
        let inLineups = this.$flattenArray(this.lineups.map(a => a.productGroups));
        return inLineups;
      },
      time() {
        let mm = 0;
        let time = this.getDateFormat(new Date(), 'H:mm');
        let hour = time.split(':')[0];
        let minute = parseInt(time.split(':')[1]);
        if (minute <= 15) mm = 15;
        if (minute <= 30) mm = 30;
        if (minute <= 45) mm = 45;
        return parseInt(hour + String(mm));
      },
      dateObj() {
        let dt = new Date();
        return {
          year: parseInt(this.getDateFormat(dt, 'YYYY')),
          month: parseInt(this.getDateFormat(dt, 'M')),
          date: parseInt(this.getDateFormat(dt, 'D')),
          hours: parseInt(this.getDateFormat(dt, 'H')),
          minutes: parseInt(this.getDateFormat(dt, 'm')),
          day: this.getDateFormat(dt, 'dddd').toLowerCase()
        };
      },
      productAvailability() {
        let queryObj = {
          $or: []
        };
        let timesObj = {};
        timesObj[`settings.productSettings.schedule.days.${this.dateObj.day}.times`] = {
          $in: [this.time]
        };
        let allObj = {};
        allObj[`settings.productSettings.schedule.days.${this.dateObj.day}`] = {
          all: true
        };
        queryObj.$or.push(timesObj);
        queryObj.$or.push(allObj);
        return queryObj;
      },
      vendorAvailability() {
        let queryObj = {
          $or: []
        };
        let timesObj = {};
        timesObj[`settings.vendorSettings.schedule.days.${this.dateObj.day}.times`] = {
          $in: [this.time]
        };
        let allObj = {};
        allObj[`settings.vendorSettings.schedule.days.${this.dateObj.day}`] = {
          all: true
        };
        queryObj.$or.push(timesObj);
        queryObj.$or.push(allObj);
        return queryObj;
      },
      vendorQuery() {
        // return {};
        let queryObj = JSON.parse(JSON.stringify(({}, this.vendorAvailability)));
        queryObj.vendorSettings = {
          $in: this.lget(this.marketplace, 'vendorSettings', [])
        };
        return queryObj;
      },
      vendorSettingsQuery() {
        // let queryObj = JSON.parse(JSON.stringify(({}, this.vendorAvailability)));
        // queryObj.$or.push({ 'settings.vendorSettings.schedule.days': { $exists: false } });
        let queryObj = {};
        queryObj._id = { $in: this.lget(this.marketplace, 'vendorSettings', []) };
        return queryObj;
      },
      lineupQuery() {
        // let queryObj = JSON.parse(JSON.stringify(({}, this.productAvailability)));
        // queryObj.$or.push({ 'settings.productSettings.schedule.days': { $exists: false } });
        //TODO: this may not be best when we can search by id, but the issue is looking at all the lineups on the vendorSettings getter has to factor in pagination this query gives you access to all lineups regardless of pagination
        let queryObj = {};
        queryObj.vendorSettings = { $in: this.lget(this.marketplace, 'vendorSettings', []) };
        return queryObj;
      },
      productGroupQuery() {
        // let queryObj = JSON.parse(JSON.stringify(({}, this.productAvailability)));
        // let queryObj = [];
        // queryObj.$or.push({ 'settings.productSettings.schedule.days': { $exists: false } });
        let queryObj = {};
        queryObj._id = { $in: this.productGroupIds };
        return queryObj;
      },
      productQuery() {
        // let queryObj = JSON.parse(JSON.stringify(({}, this.productAvailability)));
        // queryObj.$or.push({ 'settings.productSettings.schedule.days': { $exists: false } });
        let queryObj = {};
        queryObj._id = { $in: this.productIds };
        return queryObj;
      }
    },
    methods: {}
  };
</script>

<style scoped lang="scss">
  .__shop_grid {
    width: 100%;
    display: grid;
    grid-template-rows: repeat( auto-fill, minmax(360px, 400px));
    grid-template-columns: repeat( auto-fill, minmax(280px, 360px));
  }
</style>
