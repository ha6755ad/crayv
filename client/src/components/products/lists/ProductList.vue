<template>
  <div style="width: 100%;">
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
    :load-service="loadService"
    :load-watch="loadWatch"
    :load-on-mount="!loadWatch"
    :search="search"
    :search-placeholder="searchPlaceholder"
    :paginator="paginator"
  >
    <template v-slot:list="scope">
      <q-list separator v-if="!select">
        <add-list-item v-if="editing" @add="addDialog = true"></add-list-item>
        <q-item v-for="(item, i) in scope.items" :key="`product-${i}`">
          <product-item
            :flat="flat"
            :value="item"
            :editing="editing"
            @add="handleInput"
            :active="isSelected(item)"
          >
            <!--          TODO: this slot not working-->
            <template v-if="$scopedSlots.side" v-slot:side>
              <slot name="side" :item="item" :index="i"></slot>
            </template>
          </product-item>
        </q-item>
      </q-list>
      <q-select
        label="Search Products..."
        v-else
        :options="scope.items"
        behavior="menu"
        :multiple="multiple"
        :value="activeItems"
        use-input
        @input-value="searchInput = $event"
      >
        <template v-slot:no-option v-if="editing">
          <add-list-item @add="addDialog = true"></add-list-item>
        </template>
        <template v-slot:before-options v-if="editing">
          <add-list-item @add="addDialog = true"></add-list-item>
        </template>
        <template v-slot:selected-item="{ opt, index }">
          <q-chip dark removable @remove="removeItem(index, opt)">
            <default-avatar :value="opt" avatar-path="images"></default-avatar>
            {{lget(opt, 'name')}}
          </q-chip>
        </template>
        <template v-slot:option="{ opt, index }">
          <product-item :value="opt" @add="handleInput" :editing="editing">
<!--          TODO: this slot not working-->
            <template v-if="$scopedSlots.side" v-slot:side>
              <slot name="side" :item="opt" :index="index"></slot>
            </template>
          </product-item>
        </template>
      </q-select>
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
  import AddListItem from 'components/common/atoms/search/AddListItem';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  export default {
    name: 'ProductList',
    mixins: [SelectMixin],
    components: { DefaultAvatar, AddListItem, ProductForm, ProductItem, LoadAndPaginate },
    props: {
      searchPlaceholder: { type: String, default: 'Search Products...'},
      paginator: { type: Boolean, default: true },
      select: Boolean,
      title: String,
      sideSlot: Boolean,
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
      multiple: {type: Boolean, default: true },
      editing: Boolean,
      search: Boolean,
      showInactive: {
        type: Boolean,
        default: false
      },
      queryIn: Object,
      value: {
        required: true
      }
    },
    mounted(){

    },
    data(){
      return {
        searchInput: '',
        addDialog: false
      };
    },
    watch: {

    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      loadService(){
        return 'crayv-products';
      },
      queryAdders(){
        let activeObj = { active: !this.showInactive };
        return this.queryIn ? {...this.queryIn, ...activeObj} : activeObj;
      },
    },
    methods: {

    }
  };
</script>
