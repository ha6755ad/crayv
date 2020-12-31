<template>
  <div style="width: 100%">
    <div class="q-pa-md" v-if="title || subtitle">
      <div :class="titleClass">
        {{title}}
      </div>
      <div :class="subtitleClass">
        {{subtitle}}
      </div>
    </div>
    <load-and-paginate
      :query-adders="queryAdders"
      :paginator="true"
      load-service="crayv-product-groups"
      :load-watch="loadWatch"
      :load-on-mount="!loadWatch"
      :search="search"
      search-placeholder="Search Product Groups..."
    >
      <template v-slot:list="slot">
        <div class="row justify-end">
          <q-btn push size="sm" color="secondary" label="Add New" icon="mdi-plus" @click="addDialog = true"></q-btn>
        </div>
        <div class="row">
          <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 q-pa-sm" v-for="(pg, i) in slot.items" :key="`pg-${i}`">
            <product-group-card :value="pg"></product-group-card>
          </div>
        </div>
      </template>
    </load-and-paginate>

    <q-dialog position="left" :maximized="$q.screen.lt.sm" transition-hide="slide-left" transition-show="slide-right" v-model="addDialog">
      <q-card style="width: 600px; max-width: 100vw; height: 100vh">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="addDialog = false"/>
        <product-group-form></product-group-form>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
  import LoadAndPaginate from 'components/common/atoms/loading/LoadAndPaginate';
  import ProductGroupForm from 'components/products/forms/ProductGroupForm';
  import {SelectMixin} from 'src/mixins/SelectMixin';
  import {mapGetters} from 'vuex';
  import ProductGroupCard from 'components/product-groups/cards/ProductGroupCard';
  export default {
    mixins: [SelectMixin],
    components: { ProductGroupCard, ProductGroupForm, LoadAndPaginate },
    props: {
      title: String,
      subtitle: String,
      titleClass: {
        type: String,
        default: 'text-sm text-mb-md text-weight-medium'
      },
      subtitleClass:  {
        type: String,
        default: 'text-xs text-mb-sm text-weight-light'
      },
      flat: {
        type: Boolean,
        default: true
      },
      loadWatch: {
        required: false
      },
      emitValue: Boolean,
      multiple: Boolean,
      editing: Boolean,
      search: Boolean,
      showInactive: {
        type: Boolean,
        default: false
      },
      queryIn: Object
    },
    data(){
      return {
        addDialog: false
      };
    },
    watch: {

    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      queryAdders(){
        let activeObj = { active: !this.showInactive };
        return this.queryIn ? {...this.queryIn, ...activeObj} : activeObj;
      },
    },
    methods: {

    }
  };
</script>
