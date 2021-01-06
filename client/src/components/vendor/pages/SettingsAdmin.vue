<template>
  <q-page>
    <div class="q-pa-md text-sm text-mb-sm text-weight-medium">
      <div>Vendor Settings</div>
      <div class="text-xs text-mb-xs text-weight-light">Settings allow you to manage multiple settings versions for a single vendor. Use settings to manage different locations, divisions, or offerings for different marketplaces.</div>
    </div>
    <settings-list
      :load-watch="lget(vendorContext, '_id')"
    ></settings-list>
  </q-page>
</template>

<script>
  import SettingsList from 'components/vendor/settings/SettingsList';
  import {mapGetters} from 'vuex';
  export default {
    name: 'SettingsAdmin',
    components: { SettingsList },
    props: {
      value: Object
    },
    computed: {
      ...mapGetters({vendorContext: 'vendorContext'})
    }
  };
</script>
