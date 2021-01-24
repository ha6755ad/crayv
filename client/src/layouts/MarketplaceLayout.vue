<template>
  <q-layout view="HHh LpR FFF">
    <q-header>
      <q-toolbar style="box-shadow: 0 0 10px rgba(0,0,0,.15)" class="bg-white">
        <div style="height: 60px; width: 100vw" class="row items-center">
          <q-btn icon="mdi-menu" @click="drawer = !drawer" dense flat color="dark"></q-btn>
          <q-card style="height: 40px; width: 40px" flat class="bg-transparent q-mx-sm pointer" @click="$routerPreserve({name: 'marketplace-home'})">
            <q-img contain :src="getAvatar(marketplace, 'avatar')"></q-img>
          </q-card>
          <div class="text-sm text-mb-md text-weight-bold text-dark">{{ marketplaceName }}</div>
          <q-space></q-space>
          <q-card flat class="bg-transparent" style="height: 30px; width: 30px">
            <q-img contain src="https://ha6755ad-images.s3-us-west-1.amazonaws.com/crayv_standard.svg"></q-img>
          </q-card>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="drawer"
      show-if-above
      bordered
      content-class="bg-light"
    >
      <q-list separator>
        <template v-if="activeItem">
          <marketplace-nav-item :value="activeItem">
            <template v-slot:side>
              <q-btn icon="mdi-menu-down" dense flat></q-btn>
            </template>
            <template v-slot:menu>
              <marketplace-drawer></marketplace-drawer>
            </template>
          </marketplace-nav-item>
        </template>
        <q-separator></q-separator>
      </q-list>
      <q-slide-transition>
        <template v-if="!activeItem">
          <marketplace-drawer></marketplace-drawer>
        </template>
      </q-slide-transition>
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {MarketPlaceDrawer} from 'components/marketplace/mixins/MarketplaceDrawer';
  import MarketplaceDrawer from 'components/marketplace/drawers/MarketplaceDrawer';
  import MarketplaceNavItem from 'components/marketplace/drawers/MarketplaceNavItem';

  export default {
    name: 'MarketplaceLayout',
    mixins: [MarketPlaceDrawer],
    components: { MarketplaceNavItem, MarketplaceDrawer },
    data() {
      return {
        drawer: false
      };
    },
    watch: {
      user: {
        immediate: true,
        handler(newVal, oldVal) {
          let newId = this.lget(newVal, '_id', 0);
          let oldId = this.lget(oldVal, '_id', 0);
          if (newId && newId !== oldId) {
            this.$store.dispatch('crayv-carts/find', {
              query: {
                person: this.lget(this.$store.getters['auth/user'], '_id'),
                active: true
              },
              $populateParams: { name: 'withLines' }
            });
          }
        }
      },
      marketplaceName: {
        immediate: true,
        async handler(newVal) {
          if (newVal && newVal !== this.lget(this.marketplace, 'name')) {
            await this.$store.dispatch('crayv-marketplaces/find', {
              query: {
                name: newVal
              }
            })
              .then(res => {
                if (res.total) {
                  this.id = res.data[0]._id;
                  this.$router.push({
                    name: this.$route.name,
                    params: this.$route.params,
                    query: { marketplaceId: res.data[0]._id }
                  });
                }
              });
          }
        }
      },
      marketplace: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal) {
            this.$store.dispatch('setMarketplaceContext', newVal);
          }
        }
      }
    },
    computed: {
      ...mapGetters('crayv-marketplaces', { getMarketplace: 'get', findMarketplaces: 'find' }),
      marketplaceName() {
        return this.$route.params.marketplace;
      },
      stateMarketplace() {
        let list = this.findMarketplaces({
          query: {
            name: this.marketplaceName
          }
        }).data;
        return this.lget(list, [0]);
      },
      marketplaceId() {
        return this.lget(this.$route, 'query.marketplaceId', this.lget(this.stateMarketplace, '_id'));
      },
      marketplace() {
        return this.marketplaceId ? this.getMarketplace(this.marketplaceId) : null;
      },

    }
  };
</script>
