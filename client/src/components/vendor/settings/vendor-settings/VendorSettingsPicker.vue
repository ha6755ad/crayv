<template>
  <div>
    <paginate-list
      load-service="crayv-vendor-settings"
      select
      search-label="Search Vendor Settings..."
      :query-in="query"
      :value="activeItems"
      :multiple="multiple"
      dense
      @input="handleInput"
    >
      <template v-slot:chip="scope">
        <vendor-item flat :value="scope.item" subtitle-path="address.formatted">
        </vendor-item>
      </template>
      <template v-slot:option="scope">
        <vendor-item flat :value="scope.item" @input="scope.handleInput(scope.item)" subtitle-path="address.formatted"></vendor-item>
      </template>
    </paginate-list>
  </div>
</template>

<script>
  import PaginateList from 'components/common/substance/lists/PaginateList';
  import {SelectMixin} from 'src/mixins/SelectMixin';
  import VendorItem from 'components/vendor/cards/VendorItem';
  export default {
    name: 'VendorSettingsPicker',
    components: { VendorItem, PaginateList },
    mixins: [SelectMixin],
    props: {
      value: { required: false },
      multiple: Boolean,
      emitValue: Boolean,
      vendorId: { required: false },
      marketplaceId: { required: false },
      queryIn: Object,
      queryOverride: Boolean
    },
    data(){
      return {
        loadService: 'crayv-vendor-settings'
      };
    },
    computed: {
      query(){
        let query = {};
        if(this.marketplaceId) query.marketplace = this.marketplaceId;
        if(this.vendorId) query.vendorId = this.vendorId;
        return this.queryOverride ? this.queryIn : this.queryIn ? {...query, ...this.queryIn} : query;
      }
    },
    methods: {

    }
  };
</script>

<style scoped>

</style>
