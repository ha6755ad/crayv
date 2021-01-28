<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md flex items-center">
      <tab-stepper
        v-model="tab"
        :tabs="tabs"
        color="secondary"
      ></tab-stepper>
    </div>
    <paginate-list
      load-service="crayv-offers"
      :query-in="query"
      :params-in="{$populateParams: { name: 'withSubject' }}"
      grid
      :filter="filter"
      :value="null"
    >
      <template v-slot:card="scope">
        <offer-card :value="scope.item" with-subject></offer-card>
      </template>
    </paginate-list>
  </q-page>
</template>

<script>
  import PaginateList from 'components/common/substance/lists/PaginateList';
  import OfferCard from 'components/offers/cards/OfferCard';
  import TabStepper from 'components/common/atoms/tabs/TabStepper';

  export default {
    name: 'MyOffers',
    components: { TabStepper, OfferCard, PaginateList },
    data() {
      return {
        tab: 0
      };
    },
    computed: {
      tabs() {
        return [
          { label: 'Open' },
          { label: 'Won' },
          { label: 'Missed' },
        ];
      },
      query() {
        let query = { $sort: { createdAt: -1 } };
        if (this.tab === 2) {
          query.$or = [
            { accepted: { $in: [undefined, null] } },
            { accepted: { $exists: false } }
          ];
        } else if (this.tab === 1) {
          query.accepted = {
            $lte: new Date
          };
        }
        return query;
      },
      filter() {
        if (this.tab === 2) {
          return (items) => {
            return items.filter(a => a.fullSubject.sold);
          };
        } else if (this.tab === 1) {
          return (items) => {
            return items.filter(a => a.fullSubject.sold);
          };
        } else return (items) => {
          return items.filter(a => !a.fullSubject.sold);
        };
      }
    }
  };
</script>

<style scoped>

</style>
