<template>
  <q-card flat :dark="dark" :class="dark ? '' : 'bg-transparent'" style="width: 100%;">
    <div class="q-pa-md" v-if="title || subtitle">
      <div :class="titleClass">
        {{ title }}
      </div>
      <div :class="subtitleClass">
        {{ subtitle }}
      </div>
    </div>
    <load-and-paginate
      :qid-in="qidIn"
      :dark="dark"
      :query-adders="queryAdders"
      :load-service="service"
      :load-watch="loadWatch"
      :load-on-mount="!loadWatch"
      :search="search"
      :search-placeholder="searchPlaceholder"
      :search-label="searchLabel"
      :paginator="paginator"
    >
      <template v-slot:list="scope">
        <div v-if="adding && grid" class="row justify-end">
          <q-btn flat size="sm" :label="addLabel" icon="mdi-plus" @click="addDialog = true"></q-btn>
        </div>
        <div v-if="grid" class="row q-py-md">
          <div
            :class="`col-${cols} col-sm-${sm} col-md-${md} col-lg-${lg} col-xl-${xl}`"
            v-for="(item, i) in scope.items" :key="`item-${i}`"
          >
            <slot name="card" :scope="scope" :item="item" :handleInput="handleInput" :index="i"></slot>
          </div>
        </div>
        <q-list separator v-if="!select && !grid">
          <add-list-item :dark="dark" :title="addLabel" v-if="adding" @add="addDialog = true"></add-list-item>
          <q-item v-for="(item, i) in scope.items" :key="`product-${i}`" style="width: 100%">
            <slot name="list-item" :scope="scope" :item="item" :index="i" :handleInput="handleInput"></slot>
          </q-item>
        </q-list>
        <q-select
          :label="searchLabel"
          v-if="select"
          :options="scope.items"
          behavior="menu"
          :multiple="multiple"
          :value="activeItems"
          use-input
          @input-value="searchInput = $event"
        >
          <template v-slot:no-option v-if="adding">
            <add-list-item :dark="dark" @add="addDialog = true" :title="addLabel"></add-list-item>
          </template>
          <template v-slot:before-options v-if="adding">
            <add-list-item :dark="dark" @add="addDialog = true" :title="addLabel"></add-list-item>
          </template>
          <template v-slot:selected-item="selectedScope">
            <slot name="chip" :scope="selectedScope"></slot>
          </template>
          <template v-slot:option="optionScope">
            <slot name="chip" :scope="optionScope"></slot>
          </template>
        </q-select>
      </template>
    </load-and-paginate>

    <q-dialog position="right" :maximized="$q.screen.lt.sm" transition-hide="slide-right" transition-show="slide-left"
              v-model="addDialog">
      <q-card style="width: 600px; max-width: 100vw; height: 100vh">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="addDialog = false"/>
        <slot name="form" :close="closeDialog"></slot>
      </q-card>
    </q-dialog>
  </q-card>
</template>
<script>
  import LoadAndPaginate from 'components/common/atoms/loading/LoadAndPaginate';
  import {mapGetters} from 'vuex';
  import {SelectMixin} from 'src/mixins/SelectMixin';
  import AddListItem from 'components/common/atoms/search/AddListItem';

  export default {
    name: 'PaginateList',
    mixins: [SelectMixin],
    components: {  AddListItem, LoadAndPaginate },
    props: {
      qidIn: String,
      loadService: String,
      addLabel: { type: String, default: 'Add New' },
      dark: Boolean,
      cols: { type: Number, default: 12 },
      sm: { type: Number, default: 6 },
      md: { type: Number, default: 4 },
      lg: { type: Number, default: 3 },
      xl: { type: Number, default: 2 },
      searchPlaceholder: { type: String, default: 'Search...' },
      searchLabel: { type: String },
      paginator: { type: Boolean, default: true },
      select: Boolean,
      title: String,
      sideSlot: Boolean,
      subtitle: String,
      titleClass: {
        type: String,
        default: 'text-sm text-mb-md text-weight-medium'
      },
      subtitleClass: {
        type: String,
        default: 'text-xs text-mb-sm text-weight-light'
      },
      flat: {
        type: Boolean,
        default: true
      },
      grid: Boolean,
      loadWatch: {
        required: false
      },
      emitValue: Boolean,
      multiple: { type: Boolean, default: true },
      adding: Boolean,
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
    mounted() {

    },
    data() {
      return {
        searchInput: '',
        addDialog: false
      };
    },
    watch: {},
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      service(){
        return this.loadService;
      },
      queryAdders() {
        // return {};
        return this.queryIn;
        // let activeObj = { active: !this.showInactive };
        // return this.queryIn ? {...this.queryIn, ...activeObj} : activeObj;
      },
    },
    methods: {
      handleRmv(val) {
        this.$emit('rmv', val);
      },
      closeDialog(){
        this.addDialog = false;
      }
    }
  };
</script>