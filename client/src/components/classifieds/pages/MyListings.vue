<template>
  <q-page class="q-pa-md flex justify-center bg-light">
    <div class="bg-white q-px-md" style="width: 1200px; max-width: 100%">
     <div class="text-xs text-mb-xs text-weight-bold">My Listings</div>
      <div class="q-pa-md">
      <tab-stepper
        v-model="tab"
        :tabs="tabs"
      ></tab-stepper>
      </div>
      <paginate-list
        qid-in="myListings"
        load-service="crayv-classifieds"
        :query-in="query"
        :value="null"
      >
        <template v-slot:list-item="{item}">
          <listing-card :value="item"></listing-card>
        </template>
      </paginate-list>
    </div>
  </q-page>
</template>

<script>
  import PaginateList from 'components/common/substance/lists/PaginateList';
  import {mapGetters} from 'vuex';
  import ListingCard from 'components/classifieds/cards/ListingCard';
  import TabStepper from 'components/common/atoms/tabs/TabStepper';
  export default {
    name: 'MyListings',
    components: { TabStepper, ListingCard, PaginateList },
    data(){
      return {
        tab: 0
      };
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      query(){
        let query = { createdBy: this.lget(this.user, '_id') };
        if(this.tab === 1) query.sold = { $lte: new Date() };
        else {
          query.$or = [
            { sold: { $exists: false }},
            { sold: { $in: [undefined, null]}}
          ];
        }
        return query;
      },
      tabs(){
        return [
          { label: 'For Sale', icon: 'mdi-sign-real-estate', },
          { label: 'Sold', icon: 'mdi-history' },
        ];
      }
    }
  };
</script>

<style scoped>

</style>
