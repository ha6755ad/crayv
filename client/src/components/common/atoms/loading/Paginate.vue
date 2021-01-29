<template>
  <div class="fill_size">
    <div class="row justify-end q-my-sm" v-if="paginatorTop && (total > limit)">
      <btn-paginator
        :dark="dark"
        :pages="pages"
        v-model="page"
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
    <slot name="list" :items="useItems"></slot>
    <div class="row justify-end q-my-sm" v-if="paginator && !paginatorTop && (total > limit)">
      <btn-paginator
        :dark="dark"
        :pages="pages"
        v-model="page"
      ></btn-paginator>
    </div>
    <slot name="bottom" :total="total"></slot>
  </div>
</template>
<script>
  import BtnPaginator from 'components/common/atoms/pagination/BtnPaginator';
  import SearchItem from 'components/common/atoms/search/SearchItem';


  export default {
    name: 'Paginate',
    mixins: [],
    components: { SearchItem, BtnPaginator },
    props: {
      filter: Function,
      qidIn: String,
      dark: Boolean,
      searchInputIn: String,
      paginator: {
        type: Boolean,
        default: false
      },
      optionsIn: Array,
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
      limit: { type: Number, default: 15 },
      useTagPath: { type: String },
    },
    mounted() {
      // this.$watch('qidIn', (newVal) => {
      //   // if (newVal) this.itemsQid = newVal;
      // }, { immediate: true });
    },
    data() {
      return {
        searchInput: '',
        page: 0
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
      pages(){
        return Math.ceil(this.total / this.limit);
      },
      useItems(){
        let list = this.optionsIn ? this.optionsIn : [];
        let filteredList = this.total > this.limit ? list.filter((a,i) => {
          return i >= this.limit * this.page && i < (this.limit * (this.page + 1));
        }) : list;
        let keyList = [this.filterName];
        if(this.useTagPath) keyList.push(this.useTagPath);
        return this.searchAndMatch(filteredList, this.searchInput, keyList);
      },
      total(){
        return this.optionsIn ? this.optionsIn.length : 0;
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
