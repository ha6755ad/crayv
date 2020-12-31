<template>
  <div style="width: 100%; min-height: 200px">
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
    load-service="crayv-products"
    :load-watch="loadWatch"
    :load-on-mount="!loadWatch"
    :search="search"
    search-placeholder="Search Products..."
  >
    <template v-slot:list="scope">
      <q-list separator>
        <q-item dense v-if="editing" clickable @click="addDialog = true">
          <q-item-section avatar>
            <q-btn dense flat icon="mdi-plus-circle" size="sm" color="dark"></q-btn>
          </q-item-section>
          <q-item-section>
            <q-item-label>Add New</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-for="(item, i) in scope.items" :key="`product-${i}`">
          <product-item
            :flat="flat"
            :value="item"
            :editing="editing"
            @add="handleInput"
            :active="isSelected(item)"
          ></product-item>
        </q-item>
      </q-list>
    </template>
  </load-and-paginate>

    <q-dialog position="right" :maximized="$q.screen.lt.sm" transition-hide="slide-right" transition-show="slide-left" v-model="addDialog">
      <q-card style="width: 600px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="addDialog = false"/>
        <product-form></product-form>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
  import LoadAndPaginate from 'components/common/atoms/loading/LoadAndPaginate';
  import {mapGetters} from 'vuex';
  import ProductItem from 'components/products/card/ProductItem';
  import {SelectMixin} from 'src/mixins/SelectMixin';
  import ProductForm from 'components/products/forms/ProductForm';
  export default {
    name: 'ProductList',
    mixins: [SelectMixin],
    components: { ProductForm, ProductItem, LoadAndPaginate },
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
