<template>
  <q-page class="q-pa-md">
    <template v-if="!vendorContext">
      <paginate-list
        grid
        load-service="crayv-vendors"
        :query-in="queryAdders"
        search
        @input="selectVendor"
        :value="vendorContext"
      >
        <template v-slot:card="scope">
          <vendor-card
            :value="scope.item"
          ></vendor-card>
        </template>
      </paginate-list>
    </template>
    <template v-else>

      <router-view></router-view>

    </template>
  </q-page>
</template>

<script>
  import PaginateList from 'components/common/substance/lists/PaginateList';
  import {mapGetters} from 'vuex';
  import VendorCard from 'components/vendor/cards/VendorCard';
  export default {
    name: 'CrayvAdmin',
    components: { VendorCard, PaginateList },
    computed: {
      ...mapGetters({ vendorContext: 'vendorContext' }),
      queryAdders(){
        let id = this.lget(this.user, '_id');
        let query = {
          $or: [
            { owner: id },
            { 'roles.superAdmin': { $in: [id] } },
            { 'roles.admin': { $in: [id] } }
          ]
        };
        return query;
      },
    },
    methods: {
      selectVendor(val){
        this.$store.dispatch('setVendorContext', val);
      }
    }
  };
</script>

<style scoped>

</style>
