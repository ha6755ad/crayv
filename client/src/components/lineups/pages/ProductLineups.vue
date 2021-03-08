<template>
  <q-page class="q-pa-md">
    <paginate-list
      v-bind="page.attrs"
    >
      <template v-if="page.item" v-slot:list-item="{item, handleInput}">
        <component v-bind="page.itemAttrs" :is="page.item" :value="item" @input="handleInput"></component>
      </template>

      <template v-if="page.card && page.attrs.grid" v-slot:card="{item, handleInput}">
        <component v-bind="page.cardAttrs" :is="page.card" :value="item" @input="handleInput"></component>
      </template>

      <template v-slot:form="{close}">
        <component :is="page.form" @input="close"></component>
      </template>
    </paginate-list>
  </q-page>
</template>

<script>
  import {mapGetters} from 'vuex';
  import PaginateList from 'components/common/substance/lists/PaginateList';
  import LineupCard from 'components/lineups/cards/LineupCard';
  import LineupForm from 'components/lineups/forms/LineupForm';

  export default {
    name: 'ProductLineups',
    components: { PaginateList },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters({ vendorContext: 'vendorContext' }),
      page(){
        return {
          label: 'Product Lineups',
          card: LineupCard,
          cardAttrs: {
            editing: true
          },
          form: LineupForm,
          attrs: {
            title: 'Product Lineups',
            subtitle: 'Manage your customer facing offerings',
            loadService: 'crayv-product-lineups',
            loadWatch: null,
            grid: true,
            value: null,
            search: true,
            searchPlaceholder: 'Search Lineups...',
            adding: true,
            queryIn: {
              // _id: { $in: this.lget(this.vendorContext, 'productLineups', []) }
            }
          },
        };
      }
    }
  };
</script>

<style scoped>

</style>
