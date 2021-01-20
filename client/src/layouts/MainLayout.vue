<template>
  <q-layout view="HHh LpR FFF">
    <q-header elevated>
      <q-toolbar class="bg-primary-secondary">
        <div class="row items-center" style="width: 100%">
          <q-btn
            v-show="user && user._id"
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />
          <img src="https://ha6755ad-images.s3-us-west-1.amazonaws.com/crayv/crayv_light.svg" style="height: 40px"
               class="q-mx-sm">
          <q-space></q-space>
          <div class="flex items-center">
            <template v-if="!user || !user._id">
              <div class="text-0-9 q-mr-sm text-weight-medium text-uppercase pointer" @click="login(false)">Login</div>
              <q-separator dark vertical/>
              <div class="text-0-9 q-ml-sm text-weight-medium text-uppercase pointer" @click="login(true)">Signup</div>
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
              <div class="text-0-9 q-ml-sm text-weight-medium text-uppercase pointer"
                   @click="$store.dispatch('auth/logout')">Logout
              </div>
            </template>
            <q-btn round flat class="q-mx-sm" icon="mdi-cart" @click="cartDrawer = !cartDrawer"></q-btn>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list separator>
        <q-item>
          <vendor-picker
            set-context
            v-model="currVendor">
          </vendor-picker>
        </q-item>
        <q-item-label
          header
          class="text-grey-8"
        >
          Your Crayv
        </q-item-label>
        <EssentialLink
          v-for="link in personalLinks"
          :key="link.title"
          @click="link.click()"
          v-bind="link"
        />
        <q-item-label
          header
          class="text-grey-8"
        >
          Vendor Admin
        </q-item-label>
        <EssentialLink
          v-for="link in vendorLinks"
          :key="link.title"
          @click="link.click()"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <div class="__cart" :style="{transform: cartDrawer ? 'none' : 'translate(100%, 0)'}"
         v-if="user && user._id">
      <checkout-drawer @close="cartDrawer = false"/>
    </div>

    <q-page-container>
      <router-view v-bind="attrs"/>
    </q-page-container>

    <q-footer>
      <div class="row items-center justify-center bg-dark text-light" style="height: 30px">
        <div>&copy; Crayv 2020</div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
  import EssentialLink from 'components/EssentialLink.vue';
  import {mapGetters} from 'vuex';
  import VendorPicker from 'components/common/pickers/VendorPicker';
  import CheckoutDrawer from 'components/checkout/CheckoutDrawer';
  import Register from 'components/auth/Register';
  import Login from 'components/auth/Login';

  export default {
    name: 'MainLayout',

    components: {
      Register,
      CheckoutDrawer,
      Login,
      VendorPicker,
      EssentialLink
    },
    async mounted() {
      // this.setVendor();
      this.pageWidth = window.innerWidth;
      window.addEventListener('resize', () => {
        this.pageWidth = window.innerWidth;
      });
      let vendorId = this.$q.sessionStorage.getItem('vendorId');
      if (!vendorId) vendorId = this.$q.localStorage.getItem('vendorId');
      if (vendorId && String(vendorId) !== String(this.lget(this.vendorContext, '_id', '*'))) {
        await this.$store.dispatch('crayv-vendors/get', vendorId)
          .then(res => {
            this.$store.dispatch('setVendorContext', res);
          });
      }
    },
    data() {
      return {
        pageWidth: 1400,
        cartDrawer: false,
        registering: false,
        loginDialog: false,
        vendorTry: 0,
        currVendor: null,
        leftDrawerOpen: false,
        personalLinks: [
          {
            title: 'Profile',
            caption: 'Your personal information',
            icon: 'mdi-account-box',
            click: () => {
              this.$router.push({name: 'profile', query: this.$route.query});
            }
          }
        ],
        vendorLinks: [
          {
            title: 'Marketplaces',
            caption: 'Manage and join marketplaces',
            icon: 'mdi-earth',
            click: () => {
              this.$router.push({name: 'marketplaces', query: this.$route.query});
            }
          },
          {
            title: 'Product Catalog',
            caption: 'create/edit products',
            icon: 'mdi-format-list-text',
            click: () => {
              this.$router.push({name: 'catalog', query: this.$route.query});
            }
          },
          {
            title: 'Product Lineups',
            caption: 'manage product offerings',
            icon: 'mdi-group',
            click: () => {
              this.$router.push({name: 'lineups', query: this.$route.query});
            }
          },
          {
            title: 'Subscriptions',
            caption: 'manage subscriptions',
            icon: 'mdi-shape-circle-plus',
            click: () => {
              this.$router.push({name: 'subscriptions', query: this.$route.query});
            }
          },
          {
            title: 'Schedule',
            caption: 'availability and events',
            icon: 'mdi-calendar',
            click: () => {
              this.$router.push({name: 'schedule', query: this.$route.query});
            }
          },
          {
            title: 'Vendor Account',
            caption: 'account and settings',
            icon: 'mdi-cog',
            click: () => {
              this.$router.push({name: 'vendor-account', query: this.$route.query});
            }
          },
        ]
      };
    },
    watch: {
      user: {
        immediate: true,
        handler(newVal, oldVal) {
          if ((newVal?._id) && (!oldVal?._id)) {
            this.leftDrawerOpen = true;
          } else if (oldVal?._id && !newVal?._id) {
            // this.$router.push('/')
            this.leftDrawerOpen = false;
          }
        }
      },
      stateVendor: {
        immediate: true,
        deep: true,
        handler(newVal){
          if(newVal){
            this.$store.dispatch('setVendorContext', newVal);
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters('crayv-vendors', { getVendor: 'get'}),
      ...mapGetters({vendorContext: 'vendorContext'}),
      stateVendor(){
        let id = this.lget(this.vendorContext, '_id');
        if(id) return this.getVendor(id);
        else return null;
      },
      attrs() {
        return {
          appId: 'follow-something',
          appName: 'follow',
          groupsIn: [],
          currVendor: this.currVendor
        };
      },
      // stateVendors() {
      //   return this.findVendors({
      //     // query: {
      //     //   owner: this.person._id
      //     // }
      //   }).data
      // },
    },
    methods: {

      login(val) {
        this.registering = val;
        this.loginDialog = true;
      },

      // setVendor() {
      //   if (this.stateVendors && this.stateVendors.length) {
      //     console.log('MainLayout >> methods >> setVendor >> if >> true >> stateVendors[0]', this.stateVendors[0])
      //     if (!this.currVendor) this.currVendor = this.stateVendors[0]
      //     this.$store.dispatch('setVendorContext', this.stateVendors[0])
      //   }
      // }
    }
  };
</script>

<style scoped lang="scss">
  .__cart {
    border-radius: 5px 0 0 5px;
    box-shadow: -5px 0 5px rgba(0, 0, 0, .3);
    background: white;
    z-index: 19;
    position: fixed;
    top: 60px;
    bottom: 50px;
    right: 0;
    width: 600px;
    max-width: 100vw;
    overflow-y: scroll;
    transition: transform .2s ease-in;
  }
</style>
