<template>
  <div class="fill_size">
    <div class="row justify-end q-my-sm" v-if="paginatorTop">
      <btn-paginator
        :dark="dark"
        :pages="itemsPages"
        v-model="itemsCurrentPage"
      ></btn-paginator>
    </div>
    <div :class="searchClass" v-if="search">
      <div style="width: 600px; max-width: 100%">
        <search-item
          :dark="dark"
          :dense="dense"
          :rounded="rounded"
          :outlined="outlined"
          v-model="searchInput"
          :label="searchLabel"
          :placeholder="searchPlaceholder"
        ></search-item>
      </div>
    </div>
    <slot name="list" :items="useItems"></slot>
    <div class="row justify-end q-my-sm" v-if="paginator && !paginatorTop && (total > itemsLimit)">im opp
      <btn-paginator
        :dark="dark"
        :pages="itemsPages"
        v-model="itemsCurrentPage"
      ></btn-paginator>
    </div>
    <slot name="bottom" :total="total"></slot>
  </div>
</template>
<script>
  import BtnPaginator from 'components/common/atoms/pagination/BtnPaginator';
  import SearchItem from 'components/common/atoms/search/SearchItem';
  import {makeFindPaginateMixin} from '@ionrev/iy-common-client-lib';


  export default {
    name: 'LoadAndPaginate',
    mixins: [makeFindPaginateMixin({
      name: 'items',
      qid: 'items',
      service() {
        return this.loadService;
      },
      query() {
        let text = this.searchInput;
        let query = {};
        if (text && typeof (text) === 'string' && text.length) {
          let nameSearch = {
            $regex: `${text}`,
            $options: 'igm'
          };
          if (this.tagSearch) {
            let nameObj = {};
            nameObj[this.filterName] = nameSearch;
            let tagObj = {};
            let patternExp = new RegExp(text, 'igm');
            tagObj[this.useTagPath] = { $in: [patternExp] };
            query.$or = [nameObj, tagObj];
          } else {
            query[this.filterName] = nameSearch;
          }
        }
        console.log('change in query', { ...query, ...this.queryAdders });
        return { ...query, ...this.queryAdders };
      },
      params() {
        return this.paramsAdders;
      },
    })],
    components: { SearchItem, BtnPaginator },
    props: {
      dense: Boolean,
      filter: Function,
      qidIn: String,
      dark: Boolean,
      searchInputIn: String,
      paginator: {
        type: Boolean,
        default: false
      },
      queryAdders: {
        type: Object,
        default: () => {
          return {};
        }
      },
      paramsAdders: {
        type: Object,
        default: () => {
          return {};
        }
      },
      rounded: Boolean,
      tagSearch: Boolean,
      loadOnMount: Boolean,
      paginatorTop: Boolean,
      outlined: Boolean,
      search: Boolean,
      searchLabel: String,
      searchPlaceholder: String,
      showSearch: Boolean,
      searchClass: {
        type: String,
        default: 'q-my-sm'
      },
      useTagPath: { type: String, default: 'tags' },
      loadService: String,
      //you can simply increment the load event to trigger new load
      loadWatch: {
        required: false
      }
    },
    mounted() {
      // this.$watch('qidIn', (newVal) => {
      //   // if (newVal) this.itemsQid = newVal;
      // }, { immediate: true });
    },
    data() {
      return {
        searchInput: '',
        // itemsQid: 'items'
      };
    },
    watch: {
      searchInputIn: {
        immediate: true,
        handler(newVal) {
          if (typeof newVal === 'string') {
            this.searchInput = newVal;
          }
        }
      },
      paginateLoading: {
        immediate: true,
        handler(newVal) {
          this.$emit('loading', newVal);
        }
      },
      watch: {
        useItems: {
          immediate: true,
          handler(newVal){
            this.$emit('options', newVal);
          }
        }
      }
    },
    computed: {
      useItems(){
        if(this.filter){
          return this.filter(this.items);
        } else return this.items;
      },
      qid(){
        return this.qidIn ? this.qidIn : 'items';
      },
      total(){
        return this.lget(this.itemsPaginationData, 'default.mostRecent.total', 0);
      },
      paginateLoading() {
        return this.$store.state[this.loadService]['isFindPending'];
      },
      // stateItems(){
      //   return this[$lcamelCase(this.name)].map(a => a.clone());
      // },
      filterName() {
        return this.filterByName ? this.filterByName : 'name';
      }
    },
    methods: {
      newPage(i) {
        this.$emit('page', i);
        this.reloadItems(i);
      }
    }
  };
</script>
