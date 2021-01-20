<template>
  <q-layout view="HHh LpR FFF">
    <q-header>
      <q-toolbar style="box-shadow: 0 0 10px rgba(0,0,0,.15)" class="bg-white">
        <div style="height: 60px; width: 100vw" class="row items-center">
          <q-btn icon="mdi-menu" @click="drawer = !drawer" dense flat color="dark"></q-btn>
          <q-card style="height: 40px; width: 40px" flat class="bg-transparent q-mx-sm">
            <q-img contain :src="getAvatar(marketplace, 'avatar')"></q-img>
          </q-card>
          <div class="text-sm text-mb-md text-weight-bold text-dark">{{marketplaceName}}</div>
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
        <q-item></q-item>
        <q-item v-for="(nav, i) in navItems" :key="`nav-item-${i}`" clickable @click="nav.click()">
          <q-item-section avatar>
<!--            <q-btn push dense style="background: linear-gradient(16deg, var(&#45;&#45;q-color-primary), var(&#45;&#45;q-color-nice))">-->
            <div style="height: 32px; width: 32px;" >
              <component color1="var(--q-color-primary)" color2="var(--q-color-primary)" color3="var(--q-color-nice)" color4="var(--q-color-nice)" :is="nav.iconComponent"></component>
            </div>
<!--            </q-btn>-->
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">{{nav.label}}</q-item-label>
            <q-item-label caption>{{nav.caption}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
  import ShopIcon from 'components/common/atoms/custom-icons/ShopIcon';
  import EventIcon from 'components/common/atoms/custom-icons/EventIcon';
  import ClassifiedIcon from 'components/common/atoms/custom-icons/ClassifiedIcon';
  import WalletIcon from 'components/common/atoms/custom-icons/WalletIcon';
  import CartIcon from 'components/common/atoms/custom-icons/CartIcon';
  import HistoryIcon from 'components/common/atoms/custom-icons/HistoryIcon';
  import {mapGetters} from 'vuex';

  export default {
    name: 'MarketplaceLayout',
    components: { ShopIcon },
    data(){
      return {
        drawer: false
      };
    },
    watch: {
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
      }
    },
    computed: {
      ...mapGetters('crayv-marketplaces', { getMarketplace: 'get' }),
      marketplaceName() {
        return this.$route.params.marketplace;
      },
      marketplaceId() {
        return this.lget(this.$route, 'query.marketplaceId', this.lget(this.id));
      },
      marketplace() {
        return this.marketplaceId ? this.getMarketplace(this.marketplaceId) : null;
      },
      navItems() {
        return [
          {
            label: 'Products',
            caption: 'Community based e-commerce',
            iconComponent: ShopIcon
          },
          {
            label: 'Crayv Events',
            caption: 'Buy in groups for big savings',
            iconComponent: EventIcon
          },
          {
            label: 'Classifieds',
            caption: 'Peer to peer stuff exchange',
            iconComponent: ClassifiedIcon
          },
          {
            label: 'Crayv Wallet',
            caption: 'See your balance and activity',
            iconComponent: WalletIcon
          },
          {
            label: 'Cart',
            caption: 'Your shopping cart',
            iconComponent: CartIcon
          },
          {
            label: 'Order History',
            caption: 'View historical orders',
            iconComponent: HistoryIcon
          }
        ];
      }
    }
  };
</script>
