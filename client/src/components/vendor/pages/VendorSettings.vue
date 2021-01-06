<template>
  <q-page>
    <div class="q-pa-md row items-center">
      <default-avatar :value="vendorContext"></default-avatar>
      <div class="q-mx-md text-md text-mb-md text-weigh-medium">{{lget(vendorContext, 'name', 'Vendor Settings')}}</div>
    </div>
    <div class="q-pa-md">
      <tab-stepper
        color="secondary"
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
  import VendorForm from 'components/vendor/forms/VendorForm';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import {mapGetters} from 'vuex';
  import SettingsAdmin from 'components/vendor/pages/SettingsAdmin';
  export default {
    name: 'VendorSettings',
    components: { DefaultAvatar, TabStepper },
    data(){
      return {
        tab: 0
      };
    },
    computed: {
      ...mapGetters({ vendorContext: 'vendorContext' }),
      tabs(){
        return [
          {
            label: 'Settings',
            icon: 'mdi-map-marker-radius',
            component: SettingsAdmin,
            attrs: {
              value: this.vendorContext
            }
          },
          {
            label: 'Account',
            icon: 'mdi-store',
            component: VendorForm,
            attrs: {
              value: this.vendorContext
            }
          }
        ];
      }
    }
  };
</script>

<style scoped lang="scss">

</style>
