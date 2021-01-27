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
      :search-input-in="searchInputIn"
      :filter="filter"
      :qid-in="qidIn"
      :dark="dark"
      :query-adders="queryAdders"
      :params-adders="paramsAdders"
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
          <q-btn push color="nice" size="sm" :label="addLabel" icon="mdi-plus" @click="addDialog = true"></q-btn>
        </div>
        <div v-if="emptyMessage && (!scope.items || !scope.items.length)"
             class="text-xs text-mb-xs text-italic q-pa-md">{{ emptyMessage }}
        </div>
        <div
          v-if="grid" class="__paginate_grid q-py-md"
          :style="{
            gridTemplateColumns: `repeat(auto-fill, minmax(${colMinMax}`,
            gridTemplateRows: `repeat(auto-fill, minmax(${rowMinMax}`,
             }">
          <div style="width: 100%" v-for="(item, i) in scope.items" :key="`item-${i}`"
          >
            <slot name="card" :scope="scope" :item="item" :handleInput="handleInput" :index="i"></slot>
          </div>
        </div>
        <q-list separator v-if="!select && !grid">
          <add-list-item :dark="dark" :title="addLabel" v-if="adding" @add="addDialog = true"></add-list-item>
          <div v-for="(item, i) in scope.items" :key="`product-${i}`" style="width: 100%">
            <slot name="list-item" :scope="scope" :item="item" :index="i" :handleInput="handleInput"></slot>
          </div>
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
      <template v-slot:bottom="scope">
       <slot name="bottom" :total="scope.total"></slot>
      </template>
    </load-and-paginate>

    <q-dialog :position="formPosition" :maximized="formMax" :transition-hide="transitionHide"
              :transition-show="transitionShow"
              v-model="addDialog">
      <q-card :style="formCardStyle">
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
    components: { AddListItem, LoadAndPaginate },
    props: {
      filter: Function,
      emptyMessage: String,
      formMaximized: Boolean,
      formCardStyle: { type: [String, Object], default: 'width: 600px; max-width: 100vw; height: 100vh' },
      formPosition: { type: String, default: 'right' },
      transitionHide: { type: String, default: 'slide-right' },
      transitionShow: { type: String, default: 'slide-left' },
      qidIn: String,
      loadService: String,
      addLabel: { type: String, default: 'Add New' },
      dark: Boolean,
      colMinMax: { type: String, default: '330px, 360px' },
      rowMinMax: { type: String, default: '300px, 330px' },
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
      searchInputIn: String,
      queryIn: Object,
      paramsIn: Object,
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
    watch: {
      searchInputIn: {
        immediate: true,
        handler(newVal){
          if(typeof newVal === 'string'){
            this.searchInput = newVal;
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      formMax() {
        return this.formMaximized || this.formMaximized === false ? this.formMaximized : this.$q.screen.lt.sm;
      },
      service() {
        return this.loadService;
      },
      paramsAdders(){
        return this.paramsIn;
      },
      queryAdders() {
        // return {};
        return this.queryIn;
        // let activeObj = { active: !this.showInactive };
        // return this.queryIn ? {...this.queryIn, ...activeObj} : activeObj;
      }
    },
    methods: {
      handleRmv(val) {
        this.$emit('rmv', val);
      }
      ,
      closeDialog() {
        this.addDialog = false;
      }
    }
  }
  ;
</script>

<style scoped lang="scss">
  .__paginate_grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(330px, 360px));
    grid-template-rows: repeat( auto-fill, minmax(300px, 330px));
  }
</style>
