<template>
  <q-layout view="HHh LpR FFF">
    <q-header>
      <q-toolbar style="box-shadow: 0 0 10px rgba(0,0,0,.15)" class="bg-white">
        <div style="height: 60px; width: 100vw" class="row items-center">
          <q-btn icon="mdi-menu" @click="drawer = !drawer" dense flat color="dark"></q-btn>
          <q-card style="height: 40px; width: 40px" flat class="bg-transparent q-mx-sm pointer" @click="$routerPreserve({name: 'marketplace-home'})">
            <q-img contain :src="getAvatar(marketplace, 'avatar')"></q-img>
          </q-card>
          <q-space></q-space>
          <div class="flex items-center text-dark">
            <template v-if="!user || !user._id">
              <div class="text-0-9 q-mr-sm text-weight-medium text-uppercase pointer" @click="login(false)">Login</div>
              <q-separator vertical/>
              <div class="text-0-9 q-ml-sm q-mr-md text-weight-medium text-uppercase pointer" @click="login(true)">Signup</div>
              <q-dialog v-model="loginDialog">
                <q-card style="width: 600px; max-width: 100vw">
                  <q-btn v-show="!registering" size="sm" flat label="sign up" class="t-r" @click="registering=true"/>
                  <q-btn v-show="registering" size="sm" flat label="login" class="t-r" @click="registering=false"/>
                  <template v-if="registering">
                    <register></register>
                  </template>
                  <template v-else>
                    <login></login>
                  </template>
                </q-card>
              </q-dialog>
            </template>
            <template v-else>
              <div class="text-0-9 q-ml-sm q-mr-md text-weight-medium text-uppercase pointer"
                   @click="$store.dispatch('auth/logout')">Logout
              </div>
            </template>
            <q-card flat class="bg-transparent" style="height: 30px; width: 30px">
              <q-img contain src="https://ha6755ad-images.s3-us-west-1.amazonaws.com/crayv_standard.svg"></q-img>
            </q-card>
<!--            <q-btn round flat class="q-mx-sm" icon="mdi-cart" @click="cartDrawer = !cartDrawer"></q-btn>-->
          </div>
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
      <q-slide-transition>
        <template v-if="activeItem">
          <component :is="activeItem.drawer" v-bind="activeItem.drawerAttrs"></component>
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
  import Register from 'components/auth/Register';
  import Login from 'components/auth/Login';
  import {LocationMixin} from 'src/mixins/LocationMixin';

  export default {
    name: 'MarketplaceLayout',
    mixins: [MarketPlaceDrawer, LocationMixin],
    components: { Login, Register, MarketplaceNavItem, MarketplaceDrawer },
    data() {
      return {
        drawer: false,
        loginDialog: false,
        registering: false,
        estimateAddress: true,
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

    },
    methods: {
      login(val) {
        this.registering = val;
        this.loginDialog = true;
      }
    }
  };
</script>
