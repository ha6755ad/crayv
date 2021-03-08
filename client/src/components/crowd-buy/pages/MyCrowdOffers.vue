<template>
  <q-page class="q-pa-md">
    <paginate-list
      title="My Crowd Buy Offers"
      subtitle="Create and manage crowd buy events"
      grid
      load-service="crayv-crowd-buys"
      search
      adding
      :query-in="{}"
    >
      <template v-slot:card="scope">
        <crowd-buy-card :value="scope.item"></crowd-buy-card>
      </template>
      <template v-slot:form="scope">
        <crowd-buy-form @input="scope.close"></crowd-buy-form>
      </template>
    </paginate-list>
  </q-page>
</template>

<script>
  import PaginateList from 'components/common/substance/lists/PaginateList';
  import CrowdBuyForm from 'components/crowd-buy/forms/CrowdBuyForm';
  import CrowdBuyCard from 'components/crowd-buy/cards/CrowdBuyCard';
  export default {
    name: 'MyCrowdOffers',
    components: { CrowdBuyCard, CrowdBuyForm, PaginateList }
  };
</script>

<style scoped>

</style>
