<template>
  <div class="col-12">
    <q-select
      :behavior="behavior"
      ref="select"
      :label="$attrs.label"
      use-input
      @focus="stateItems && stateItems.length ? '' : loadItems()"
      @keyup.enter="runSearch(searchInput)"
      @input="newInput"
      @input-value="newSearchInput"
      :options="lget(me, optionValue) ? stateItems.filter(a => a[optionValue] !== me[optionValue]) : stateItems"
      :option-label="$attrs.optionLabel"
      :multiple="multiple"
      :hide-selected="hideSelected"
      :value="activeItems"
      :emit-value="emitValue"
      >

      <template v-slot:no-option>
        <q-item clickable @click="$emit('empty')">
          <q-item-section class="text-italic text-grey">
            {{ emptyMessage ? emptyMessage : 'No Results Found' }}
          </q-item-section>
        </q-item>
      </template>

      <template v-slot:before-options v-if="beforeMessage">
        <q-item clickable @click="$emit('before')">
          <q-item-section class="text-italic text-grey">
            {{ beforeMessage }}
          </q-item-section>
        </q-item>
      </template>

      <template v-slot:append v-if="searchInput">
        <q-btn size="sm" @click.stop="runSearch(searchInput)" color="dark" round push icon="mdi-magnify"></q-btn>
      </template>

      <template v-slot:selected-item="scope" v-if="chip">
        <q-chip removable @remove="multiple ? removeItem(scope.opt, scope.index) : removeItem(scope.opt)">
          <default-avatar v-if="optionAvatar" :value="activeItem" :avatar-path="optionAvatar"
                          :name-path="optionLabel"></default-avatar>
          {{ lget(activeItem, [optionLabel], lget(activeItem, [backupLabel])) }}
        </q-chip>
      </template>

      <template v-slot:option="{opt}" v-if="!hideOptions">
        <q-item clickable @click="newInput(opt)">
          <q-item-section avatar v-if="optionAvatar">
            <default-avatar v-if="optionAvatar" :value="opt" :avatar-path="optionAvatar"
                            :name-path="optionLabel"></default-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $attrs.prefix }}&nbsp;{{ opt[optionLabel] }}</q-item-label>
            <q-item-label caption v-if="optionSubtitle">
              {{ $attrs.captionPrefix }}&nbsp;{{ opt[optionSubtitle] }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              v-if="multiple && selected && selected.length && emitValue ? selected.map(a => lget(a, optionValue)).includes(opt[optionValue]) : lget(selected, optionValue) === lget(opt, optionValue)"
              dense flat icon="mdi-checkbox-marked-outline" color="green-6"></q-btn>
          </q-item-section>
        </q-item>
      </template>

    </q-select>
  </div>
</template>

<script>


  import {loadPaginatedMixin} from 'src/mixins/LoadPaginatedMixin';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import {SelectMixin} from 'src/mixins/SelectMixin';

  export default {
    name: 'SearchQuery',
    components: { DefaultAvatar },
    mixins: [loadPaginatedMixin, SelectMixin],
    props: {
      beforeMessage: String,
      behavior: String,
      chip: Boolean,
      emptyMessage: String,
      value: [Array, String, Object, Number],
      namedQuery: String,
      hideSelected: Boolean,
      hideOptions: Boolean,
      queryIn: Object,
      me: Object,
      multiple: Boolean,
      service: String,
      emitValue: Boolean,
      optionAvatar: String,
      optionLabel: String,
      backupLabel: String,
      optionSubtitle: String,
      optionValue: {
        type: String,
        default: '_id'
      }
    },
    data() {
      return {
        searchQuery: true,
        searchInput: '',
        items: null,
        selected: null
      };
    },
    watch: {
      searchInput: {
        immediate: true,
        handler(newVal, oldVal) {
          let newLength = newVal && newVal.length ? newVal.length : 0;
          let oldLength = oldVal && oldVal.length ? oldVal.length : 0;
          if (newLength > oldLength && newLength % this.searchOnCount === 0) {
            this.loadItems(newVal);
          }
        }
      },
      activeIds: {
        immediate: true,
        async handler(newVal) {
          let list = this.stateItems ? this.stateItems.map(a => String(a[this.optionValue])) : [];

          let load = false;
          if (this.stateItems && this.stateItems.length) {
            newVal.forEach(id => {
              if (!list.indexOf(String(id)) > -1) {
                load = true;
              }
            });
          } else load = true;
          if (load) {
            await this.$store.dispatch(`${this.service}/find`, {
              query: {
                _id: { $in: newVal }
              }
            });
          }
        }
      }
    },
    computed: {
      filterByName() {
        return this.optionLabel ? this.optionLabel : 'name';
      },
      queryAdders() {
        return this.queryIn;
      },
      paramsAdders() {
        return {
          $populateParams: { name: this.namedQuery }
        };
      },
      loadService() {
        return this.service;
      },
      searchOnCount() {
        return this.$attrs.searchOnCount ? this.$attrs.searchOnCount : 3;
      }
    },
    methods: {
      async runSearch(val) {
        this.loadItems(val)
          .then(() => {
            this.$refs.select.hidePopup();
            this.$refs.select.showPopup();
          });
      },
      newSearchInput(val) {
        this.searchInput = val;
        this.$refs.select.showPopup();
      },
      newInput(val) {
        this.handleInput(val);
        this.$refs.select.updateInputValue('');
      }
    }
  };
</script>
