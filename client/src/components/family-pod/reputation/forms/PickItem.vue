<template>
  <q-card flat class="q-pa-md">
    <div v-if="!hideTitle" class="text-sm text-mb-sm row items-center">Choose Score
      <q-space></q-space>
      <q-btn flat label="new" dense color="primary" icon="mdi-plus" @click="addDialog = true"></q-btn>
    </div>
    <q-list separator style="width: 100%" v-if="stateItems && !paginateLoading">
      <q-item style="width: 100%">
        <q-item-section>
        <q-input placeholder="Search Scores" style="width: 100%" v-model="searchInput" @keyup.enter="loadItems(searchInput)" outlined rounded dense>
          <template v-slot:prepend>
            <q-btn style="transition: all .3s ease-out" round size="sm" :flat="!searchInput"
                   :color="searchInput ? 'primary' : ''" icon="mdi-magnify" @click="loadItems(searchInput)"></q-btn>
          </template>
        </q-input>
        </q-item-section>
      </q-item>
      <q-item v-for="(item, i) in stateItems" :key="`item-${i}`" clickable @click="toggleItem(item)">
        <reputation-item hide-votes :value="item">
        <template v-slot:side>
          <q-icon size="25px" :color="isSelected(item) ? 'green-7' : 'grey-5'" name="mdi-checkbox-marked-outline"></q-icon>
        </template>
        </reputation-item>
      </q-item>
    </q-list>

    <template v-if="paginateLoading">
      <div style="width: 100%; height: 150px" class="flex flex-center">
        <div>
          <q-spinner size="80px"></q-spinner>
        </div>
      </div>
    </template>

    <template v-else-if="!stateItems || !stateItems.length">
      <div style="width: 100%; height: 150px" class="flex flex-center">
        <div class="text-sm text-mb-sm text-italic">You don't have any {{typeIn}} scores</div>
      </div>
    </template>

    <q-dialog v-model="addDialog">
      <q-card style="width: 700px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="editDialog = false"/>
        <add-card :service-in="serviceIn" @input="selectItem"></add-card>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
  import {loadPaginatedMixin} from 'src/Mixins/LoadPaginatedMixin';
  import AddCard from 'components/family-pod/reputation/forms/AddCard';
  import ReputationItem from 'components/family-pod/reputation/cards/ReputationItem';
  import {mapGetters} from 'vuex';

  export default {
    name: 'PickItem',
    components: { ReputationItem, AddCard },
    mixins: [loadPaginatedMixin],
    props: {
      hideTitle: Boolean,
      multiple: Boolean,
      emitValue: Boolean,
      optionValue: {
        type: String,
        default: '_id'
      },
      queryIn: Object,
      typeIn: String,
      requireSave: Boolean,
      serviceIn: String,
      value: {
        required: false
      }
    },
    mounted(){
      this.reloadItems(0);
    },
    data() {
      return {
        addDialog: false,
        searchInput: '',
        selected: null
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal) {
          this.selected = newVal;
        }
      }
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      loadService() {
        return this.serviceIn;
      },
      queryAdders(){
        let query = this.queryIn;
        if(!this.queryIn){
          query = {
            subject: this.lget(this.user, '_id')
          };
        }
        return query;
      },
      type(){
        return this.lget(this.value, 'type', 'peer');
      },
    },
    methods: {
      toggleItem(val){
        if(this.isSelected(val)){
          this.deselectItem(val);
        } else this.selectItem(val);
      },
      selectItem(val) {
        if (this.emitValue) {
          if (this.multiple) {
            this.selected ? this.selected.push(val[this.optionValue]) : this.selected = [val[this.optionValue]];
          } else this.selected = val[this.optionValue];
        } else {
          if (this.multiple) {
            this.selected ? this.selected.push(val) : this.selected = [val];
          } else this.selected = val;
        }
        if (!this.requireSave) {
          this.$emit('input', this.selected);
        }
      },
      deselectItem(val){
        if(this.selected) {
          let id = val[this.optionValue];
          let list = this.emitValue ? this.selected : this.selected.map(a => a[this.optionValue]);
          let idx = list.indexOf(id);
          if(idx > -1){
            this.selected.splice(idx, 1);
          }
          if (!this.requireSave) {
            this.$emit('input', this.selected);
          }
        }
      },
      isSelected(val) {
        if (this.selected) {
          if (this.emitValue) {
            if (this.multiple) {
              return this.selected.includes(val[this.optionValue]);
            } else return this.selected === val[this.optionValue];
          } else {
            if (this.multiple) {
              return this.selected.map(a => a[this.optionValue]).includes(val[this.optionValue]);
            } else return this.selected[this.optionValue] === val[this.optionValue];
          }
        } else return false;
      }
    }
  };
</script>
