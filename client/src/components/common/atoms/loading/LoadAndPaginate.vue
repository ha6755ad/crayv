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
          :rounded="rounded"
          :outlined="outlined"
          v-model="searchInput"
          :label="searchLabel"
          :placeholder="searchPlaceholder"
        ></search-item>
      </div>
    </div>
    <slot name="list" :items="items"></slot>
    <div class="row justify-end q-my-sm" v-if="paginator && !paginatorTop">
      <btn-paginator
        :dark="dark"
        :pages="itemsPages"
        v-model="itemsCurrentPage"
      ></btn-paginator>
    </div>
  </div>
</template>
<script>
  import BtnPaginator from 'components/common/atoms/pagination/BtnPaginator';
  // import {loadPaginatedMixin} from 'src/mixins/LoadPaginateMixin';
  import SearchItem from 'components/common/atoms/search/SearchItem';
  import {makeFindPaginateMixin} from '@ionrev/iy-common-client-lib';
  // import $lcamelCase from 'lodash.camelcase';
  // const { makeFindPaginateMixin } = Mixins;


  export default {
    mixins: [makeFindPaginateMixin({
      name: 'items',
      service() {
        return this.loadService;
      },
      query() {
        return this.query;
      },
      params() {
        return this.paramsAdders;
      },
      makeFindMixinOptions() {
        return {
          queryWhen() {
            return this.loadWatch ? this.loadWatch : this.loadOnMount;
          }
        };
      }
    })],
    components: { SearchItem, BtnPaginator },
    props: {
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
      getterLimitIn: Number,
      actionLimitIn: Number,
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
        getterLimit: 25,
        actionLimit: 25,
        // itemsQid: 'items'
      };
    },
    watch: {
      searchInputIn: {
        immediate: true,
        handler(newVal, oldVal) {
          if (typeof newVal === 'string' || typeof oldVal === 'string') {
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
      getterLimitIn: {
        immediate: true,
        handler(newVal) {
          if (typeof newVal === 'number') {
            this.getterLimit = newVal;
          }
        }
      },
      actionLimitIn: {
        immediate: true,
        handler(newVal) {
          if (typeof newVal === 'number') {
            this.actionLimit = newVal;
          }
        }
      }
    },
    computed: {
      paginateLoading() {
        return this.$store.state[this.loadService]['isFindPending'];
      },
      // stateItems(){
      //   return this[$lcamelCase(this.name)].map(a => a.clone());
      // },
      filterName() {
        return this.filterByName ? this.filterByName : 'name';
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
        console.log('change in query', query);
        return { ...query, ...this.queryAdders };
      },
    },
    methods: {
      newPage(i) {
        this.$emit('page', i);
        this.reloadItems(i);
      }
    }
  };
</script>
