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
  import TabStepper from 'components/common/atoms/tabs/TabStepper';
  import MarketPlaceForm from 'components/ir-commerce/marketplace/MarketPlaceForm';
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
      tabs(){
        return [
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
