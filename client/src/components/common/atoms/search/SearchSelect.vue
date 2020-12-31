<template>
  <q-card flat>
    <div class="q-pa-md text-sm text-mb-sm text-weight-light">{{ title }}</div>
    <div class="q-pa-md">
    <search-query
      :option-subtitle="optionSubtitle"
      v-if="listSelected"
      :limit="limit"
      :service="service"
      :optionLabel="optionLabel"
      :optionAvatar="optionAvatar"
      :optionSubtitle="optionDescription"
      :label="label"
      hideSelected
      @input="searchQueryInput"
      @before="$emit('before')"
      @empty="$emit('empty')"
      @data="items = $event"
      :emit-value="emitValue"
      :named-query="namedQuery"
      :query-in="queryIn"
      :before-message="beforeMessage"
      :empty-message="emptyMessage"
      avatar></search-query>
    <search-item :outlined="outlined" v-else v-model="searchInput" @clear="reloadItems(0)" @search="loadItems"
                 :label="label"></search-item>
    </div>
    <div :class="searchContainerClass" :style="searchContainerStyle">
      <small-search
        :grid-view="gridView"
        :cols="cols" :sm="sm" :md="md" :lg="lg" :xl="xl"
        :items="useItems"
      >
        <template v-slot:card="scope">
          <q-card flat class="pointer" @click="handleInput(scope.item)" style="width: 100%">
            <q-btn class="t-r" size="sm" dense push icon="mdi-checkbox-marked-outline" color="positive"
                   v-if="isSelected(scope.item)"/>
            <slot name="card" :item="scope.item"></slot>
          </q-card>
        </template>
      </small-search>
    </div>
    <div class="row">
      <q-btn label="load more" icon-right="mdi-menu-down" color="primary" flat size="sm"
             @click="reloadItems(skip + 1)" v-if="total > limit"/>
    </div>
    <div class="row justify-end" v-if="requireSave">
      <q-btn label="Save" icon="mdi-content-save" color="primary" push @click="saveFilter"/>
    </div>
  </q-card>
</template>

<script>
  import SmallSearch from './SmallSearch';
  import SearchQuery from './SearchQuery';
  import {loadPaginatedMixin} from 'src/mixins/LoadPaginatedMixin';
  import SearchItem from 'components/common/atoms/search/SearchItem';

  export default {
    name: 'SearchSelect',
    mixins: [loadPaginatedMixin],
    components: { SearchItem, SearchQuery, SmallSearch },
    props: {
      searchContainerClass: String,
      searchContainerStyle: {
        type: [Object, String],
        default: 'max-height: 60vh; overflow-y: scroll'
      },
      optionSubtitle: String,
      label: {
        type: String,
        default: 'Search...'
      },
      getterLimitIn: Number,
      actionLimitIn: Number,
      outlined: Boolean,
      items: [],
      queryIn: Object,
      beforeMessage: String,
      emptyMessage: String,
      service: String,
      multiple: Boolean,
      requireSave: Boolean,
      title: String,
      gridView: Boolean,
      value: [Object, Array, String],
      cols: { type: Number, default: 12 },
      sm: { type: Number, default: 6 },
      md: { type: Number, default: 6 },
      lg: { type: Number, default: 6 },
      xl: { type: Number, default: 6 },
      emitValue: Boolean,
      optionValue: {
        type: String,
        default: '_id'
      },
      optionAvatar: {
        type: String,
        default: 'avatar'
      },
      optionLabel: {
        type: String,
        default: 'name'
      },
      optionDescription: {
        type: String,
        default: 'description'
      },
      namedQuery: String,
      listSelected: Boolean,
      noLoad: Boolean
    },
    mounted() {
      if (!this.noLoad) this.reloadItems(0);
      if (this.$attrs.limit) this.limit = this.$attrs.limit;
    },
    data() {
      return {
        searchInput: '',
        selected: null,
        noPaginateGetter: true,
        getterLimit: 10,
        actionLimit: 10
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal) {
          if (this.emitValue) {
            if (!this.multiple) {
              let idx = this.useItems ? this.useItems.map(a => a[this.optionValue]).indexOf(newVal) : -1;
              if (idx > -1) this.selected = this.lget(this.useItems, [idx]);
              else this.selected = null;
            } else {
              if (this.useItems && newVal) {
                if (!this.emitValue) {
                  this.selected = this.useItems.filter(a => newVal.includes(a));
                } else {
                  this.selected = this.useItems.filter(a => newVal.includes(a[this.optionValue]));
                }
              } else return [];
            }
          } else this.selected = newVal;
        }
      },
      getterLimitIn: {
        immediate: true,
        handler(newVal){
          if(typeof newVal === 'number'){
            this.getterLimit = newVal;
          }
        }
      },
      actionLimitIn: {
        immediate: true,
        handler(newVal){
          if(typeof newVal === 'number'){
            this.actionLimit = newVal;
          }
        }
      }
    },
    computed: {
      useItems() {
        if (this.listSelected) {
          return this.selected;
        } else {
          let itemsLength = this.items ? this.items.length : 0;
          let stateItemsLength = this.stateItems ? this.stateItems.length : 0;
          if (itemsLength && stateItemsLength) return [...this.stateItems, ...this.items];
          else if (itemsLength) return this.items;
          else if (stateItemsLength) return this.stateItems;
          else return [];
        }
      },
      loadService() {
        return this.service;
      }
    },
    methods: {
      queryAdders() {
        return this.queryIn ? this.queryIn : {};
      },
      paramsAdders() {
        return this.namedQuery ? { $populateParams: { name: this.namedQuery } } : {};
      },
      isSelected(val) {
        if (Array.isArray(this.selected)) {
          return this.optionValue ? this.selected.map(a => JSON.stringify(a[this.optionValue])).includes(JSON.stringify(val[this.optionValue])) : this.selected.includes(val);
        } else {
          return this.emitValue ? this.selected === val[this.optionValue] : this.selected === val;
        }
      },
      saveFilter() {
        this.$emit('input', this.selected);
      },
      searchQueryInput(val) {
        if (this.emitValue) {
          let payload = this.$arrayFilterZero(this.stateItems.filter(a => this.lget(a, this.optionValue) === val), val);
          this.selectOption(payload);
        } else this.selectOption(val);
      },
      selectOption(val) {
        if (!this.multiple) {
          let payload = this.emitValue ? this.lget(val, this.optionValue, val) : val;
          this.selected = val;
          this.$emit('input', payload);
        } else {
          let list = this.selected ? this.emitValue ? this.selected.map(a => this.lget(a, this.optionValue, a)) : this.selected : [];
          let item = this.emitValue ? this.lget(val, this.optionValue, val) : val;
          let idx = list.indexOf(item);
          if (idx > -1) {
            list.splice(idx, 1);
            this.selected.splice(idx, 1);
          } else {
            list ? list.push(item) : list = [item];
            this.selected ? this.selected.push(val) : this.selected = [val];
          }
          console.log('emit multiple', list);
          this.$emit('input', list);
        }
      },
      handleInput(item) {
        console.log('search select input');
        this.selectOption(item);
        if (!this.requireSave) {
          this.$emit('input', item);
        }
      }
    }
  };
</script>
