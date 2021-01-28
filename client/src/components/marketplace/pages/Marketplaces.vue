<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md text-md text-mb-lg text-weight-medium">
      {{ lget(podIn, 'name', '') }} Marketplace
    </div>

    <paginate-list
      title="Explore Marketplaces"
      subtitle="Join marketplaces to expand your product reach"
      load-service="crayv-marketplaces"
      grid
      adding
      :query-in="{ privacy: 'public', vendorSettings: { $in: lget(vendorContext, 'vendorSettings', []) }
              }"
      :value="null"
    >
      <template v-slot:card="{item, handleInput}">
        <q-card style="width: 100%; height: 320px">
        <marketplace-card :value="item" @add="handleInput" editing></marketplace-card>
        </q-card>
      </template>

      <template v-slot:form="{close}">
        <marketplace-form @input="close"></marketplace-form>
      </template>
    </paginate-list>

  </q-page>
</template>

<script>
  import { mapGetters } from 'vuex';
  import PaginateList from 'components/common/substance/lists/PaginateList';
  import MarketplaceCard from 'components/marketplace/cards/MarketPlaceCard';
  import MarketplaceForm from 'components/marketplace/MarketPlaceForm';

  export default {
    name: 'MarketplaceAdmin',
    components: { MarketplaceForm, MarketplaceCard, PaginateList },
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

    }
  };
</script>

<style scoped lang="scss">

</style>
