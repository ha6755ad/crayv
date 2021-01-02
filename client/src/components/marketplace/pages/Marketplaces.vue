<template>
  <q-page>
    <div class="q-pa-md text-md text-mb-lg text-weight-medium">
      {{ lget(podIn, 'name', 'Pod') }} Marketplace
    </div>

    <div class="q-px-sm">
      <tab-stepper
        :tabs="tabs"
        v-model="tab"
      ></tab-stepper>
    </div>

    <q-tab-panels animated v-model="tab">
      <q-tab-panel v-for="(tab, i) in tabs" :key="`tab-${i}`" :name="i">
        <component :is="tab.component" v-bind="tab.attrs"></component>
      </q-tab-panel>
    </q-tab-panels>

  </q-page>
</template>

<script>
  import { mapGetters } from 'vuex';
  import TabStepper from '../../common/atoms/tabs/TabStepper';
  import MarketPlaceForm from '../MarketPlaceForm';
  import MarketPlaceList from '../lists/MarketPlaceList';

  export default {
    name: 'MarketplaceAdmin',
    components: { TabStepper },
    props: {
      podIn: Object
    },
    data(){
      return {
        tab: 0
      };
    },
    computed: {
      ...mapGetters({vendorContext: 'vendorContext'}),
      tabs(){
        return [
          {
            label: 'Explore',
            icon: 'mdi-telescope',
            component: MarketPlaceList,
            attrs: {
              title: 'Explore Marketplaces',
              subtitle: 'Join marketplaces to expand your product reach',
              search: true,
              editing: false,
              queryIn: {
                privacy: 'public',
                vendorSettings: { $nin: this.lget(this.vendorContext, 'vendorSettings', []) }
              },
            }
          },
          {
            label: 'Settings',
            icon: 'mdi-cog-outline',
            component: MarketPlaceForm,
            attrs: {
              hostIn: this.podIn
            }
          },
          {
            label: 'Vendors',
            icon: 'mdi-store'
          }
        ];
      }
    }
  };
</script>

<style scoped lang="scss">

</style>
