<template>
  <div class="fill_size">
    <div class="row justify-end q-my-sm" v-if="paginatorTop">
      <btn-paginator :pages="Math.ceil(total / limit)" @input="newPage" :value="skip"></btn-paginator>
    </div>
    <div :class="searchClass" v-if="search">
      <div style="width: 600px; max-width: 100%">
        <search-item
          :outlined="outlined"
          v-model="searchInput"
          @clear="reloadItems(0)"
          @search="loadItems"
          :label="searchLabel"
          :placeholder="searchPlaceholder"
        ></search-item>
      </div>
    </div>
    <slot name="list" :items="stateItems"></slot>
    <div class="row justify-end q-my-sm" v-if="paginator && !paginatorTop">
      <btn-paginator :pages="Math.ceil(total / limit)" @input="newPage" :value="skip"></btn-paginator>
    </div>
  </div>
</template>
<script>
  import BtnPaginator from 'components/common/atoms/pagination/BtnPaginator';
  import {loadPaginatedMixin} from 'src/mixins/LoadPaginatedMixin';
  import SearchItem from 'components/common/atoms/search/SearchItem';
  const lisequal = require('lodash.isequal');

  export default {
    mixins: [loadPaginatedMixin],
    components: { SearchItem, BtnPaginator },
    props: {
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
      loadService: String,
      getterLimitIn: Number,
      actionLimitIn: Number,
      //you can simply increment the load event to trigger new load
      loadWatch: {
        required: false
      }
    },
    mounted() {
      if (this.loadOnMount) {
        console.log('load on mount', this.loadService);
        this.reloadItems(0);
      }
    },
    data() {
      return {
        searchInput: '',
        getterLimit: 25,
        actionLimit: 25
      };
    },
    watch: {
      searchInputIn: {
        immediate: true,
        handler(newVal, oldVal){
          if(typeof newVal === 'string' || typeof oldVal === 'string'){
            this.searchInput = newVal;
          }
        }
      },
      loadWatch: {
        immediate: true,
        handler(newVal, oldVal) {
          if ((newVal || newVal === 0) && !lisequal(newVal, oldVal)) {
            // YOU CAN PASS IN A NUMBER IF YOU WANT TO MANAGE SKIP PAGE WITH THIS
            console.log('load on watch', this.loadService);
            if ((typeof newVal === 'number' && newVal > -1)) {
              this.reloadItems(newVal);
            } else this.reloadItems(0);
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
    methods: {
      newPage(i) {
        this.$emit('page', i);
        this.reloadItems(i);
      }
    }
  };
</script>
