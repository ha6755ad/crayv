<template>
  <q-list>
    <template v-for="(nav, i) in navItems">
      <marketplace-nav-item :key="`nav-item-${i}`" :value="nav" @input="nav.click()"></marketplace-nav-item>
    </template>
  </q-list>
</template>

<script>
  import {MarketPlaceDrawer} from 'components/marketplace/mixins/MarketplaceDrawer';
  import MarketplaceNavItem from 'components/marketplace/drawers/MarketplaceNavItem';

  export default {
    name: 'MarketplaceDrawer',
    components: { MarketplaceNavItem },
    mixins: [MarketPlaceDrawer]

  };
</script>

<style scoped>

</style>
