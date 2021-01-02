<template>
  <q-card flat class="q-pa-md">
    <div class="text-sm text-mb-md text-weight-medium">{{form.name ? form.name : 'Create Lineup'}}</div>
    <q-input label="Lineup Name" v-model="form.name"></q-input>
    <q-input label="Description" v-model="form.name"></q-input>
    <q-separator dark class="q-my-md"></q-separator>
    <div class="q-pa-sm text-xxs text-mb-xs text-weight-medium">Add Product Groups</div>
    <product-group-list
      select
      editing
      :sm="12" :md="12" :lg="12" :xl="12"
      :query-in="{ _id: { $in: this.lget(this.vendorContext,'productGroups', [])} }"
      emit-value
      multiple
      v-model="form.productGroups"
    ></product-group-list>

    <div class="q-pa-sm text-xxs text-mb-xs text-weight-medium">Add Products</div>
    <product-list
      select
      :query-in="{ _id: { $in: this.lget(this.vendorContext, 'products', [])} }"
      emit-value
      multiple
      v-model="form.products"
    ></product-list>

  </q-card>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { models } from 'feathers-vuex';
  import ProductGroupList from 'components/product-groups/lists/ProductGroupList';
  import ProductList from 'components/products/lists/ProductList';

  export default {
    name: 'LineupForm',
    components: { ProductList, ProductGroupList },
    props: {
      value: Object
    },
    mounted(){
      if(this.value) this.form = new models.api.CrayvProductLineups(this.value).clone();
    },
    data(){
      return {
        form: new models.api.CrayvProductLineups().clone()
      };
    },
    computed: {
      ...mapGetters({vendorContext: 'vendorContext'})
    }
  };
</script>
