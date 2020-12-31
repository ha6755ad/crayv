<template>
  <q-card flat class="q-pa-sm">

    <div class="q-px-xs row items-center no-wrap" style="width: 100%; overflow: scroll" v-if="tabs">
      <template v-for="(st, i) in types">
        <q-btn
          style="line-height: 1.2"
          dense
          size="sm"
          flat
          :key="`st-${i}`"
          :label="`${st.label} (${$dollarString(st.total, '', 0)})`"
          @click="typeFilter = st.value" :color="typeFilter === st.value ? 'primary' : 'grey-8'"
        >
          <div class="__underline bg-primary" :style="typeFilter === st.value ? {} : {width: 0}"></div>
        </q-btn>
        <div style="height: 30px" class="q-mx-xs" :key="`sep-${i}`" v-if="i < types.length - 1">
          <q-separator vertical></q-separator>
        </div>
      </template>
    </div>

    <div v-if="title" class="q-pa-md text-sm text-mb-sm">
      <div class="row items-center">
        <div>
          <div>{{ title }}</div>
          <div v-if="subtitle" class="text-weight-light text-xs text-mb-xs">{{subtitle}}</div>
        </div>
        <q-space></q-space>
        <q-btn v-if="adding" size="sm" round unelevated icon="mdi-plus" color="dark" @click="addDialog = true"></q-btn>
      </div>
      <q-separator class="q-mt-sm"></q-separator>
    </div>

    <div class="row q-mb-md" v-if="searchOn">
      <div style="width: 600px; max-width: 95%">
      <search-item @search="loadItems" v-model="searchInput" @clear="reloadItems(0)" placeholder="Search Scores"></search-item>
      </div>
    </div>

    <div :style="styleIn" v-if="stateItems && stateItems.length && !paginateLoading">
      <q-card flat style="width: 100%">
        <q-list separator style="width: 100%">
          <template  v-for="(item, i) in stateItems">
          <reputation-item :key="`order-${i}`"  @rmv="rmvItem(i)" :can-edit="canEdit" :flat="flat" :value="item">
            <template v-slot:side>
              <slot name="side" :slot-scope="item"></slot>
            </template>
          </reputation-item>
          </template>
        </q-list>
      </q-card>
    </div>
    <template v-else-if="paginateLoading">
      <div style="width: 100%; height: 120px" class="flex flex-center">
        <div>
          <q-spinner size="80px"></q-spinner>
        </div>
      </div>
    </template>

    <template v-else>
      <div style="width: 100%; height: 100px" class="flex flex-center">
        <div class="text-sm text-mb-sm text-italic">No Scores</div>
      </div>
    </template>

    <div class="row justify-end" v-if="total > limit">
      <btn-paginator :pages="Math.ceil(total / limit)" @input="reloadItems" :value="skip"></btn-paginator>
    </div>

    <q-dialog v-model="addDialog">
      <q-card style="width: 600px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="addDialog = false"/>
        <add-card></add-card>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
  import ReputationItem from 'components/family-pod/reputation/cards/ReputationItem';
  import {loadPaginatedMixin} from 'src/Mixins/LoadPaginatedMixin';
  import BtnPaginator from 'components/common/atoms/pagination/BtnPaginator';
  import AddCard from 'components/family-pod/reputation/forms/AddCard';
  import SearchItem from 'components/common/atoms/search/SearchItem';

  export default {
    name: 'ReputationList',
    components: { SearchItem, AddCard, BtnPaginator, ReputationItem },
    mixins: [loadPaginatedMixin],
    props: {
      tabs: Boolean,
      removable: Boolean,
      styleIn: Object,
      queryIn: {
        type: Object,
        default: () => {
          return {};
        }
      },
      adding: Boolean,
      searchOn: Boolean,
      canEdit: Boolean,
      flat: Boolean,
      title: String,
      subtitle: String,
      serviceIn: String,
      stopLoad: Boolean
    },
    mounted() {
      if(!this.stopLoad) this.reloadItems(0);
      if(this.tabs) this.typeFilter = 'peer';
    },
    data() {
      return {
        typeFilter: null,
        tagFilter: null,
        addDialog: false,
        searchInput: '',
        getterLimit: 10,
        actionLimit: 10
      };
    },
    watch: {

    },
    computed: {
      types(){
        return [
          { label: 'Peer', value: 'peer', total: this.peerScores.total },
          { label: 'Credentials', value: 'credential', total: this.credentialScores.total },
          { label: 'Experiences', value: 'experience', total: this.experienceScores.total },
        ];
      },
      loadService() {
        return this.serviceIn ? this.serviceIn : 'fc-scores';
      },
      getterAdders(){
        let query = null;
        if(this.typeFilter && typeof this.typeFilter === 'string' && this.typeFilter.length){
          query = { type: this.typeFilter };
        }
        return query;
      },
      queryAdders() {
        // let type = this.serviceIn.split('-')[1];
        let query = this.queryIn;
        return query;
      },
      peerScores(){
        let query = Object.assign({}, this.queryAdders);
        query.type = 'peer';
        return this.$store.getters[`${this.loadService}/find`]({
          query: query
        });
      },
      credentialScores(){
        let query = Object.assign({}, this.queryAdders);
        query.type = 'credential';
        return this.$store.getters[`${this.loadService}/find`]({
          query: query
        });
      },
      experienceScores(){
        let query = Object.assign({}, this.queryAdders);
        query.type = 'experience';
        return this.$store.getters[`${this.loadService}/find`]({
          query: query
        });
      }
    },
    methods: {
      rmvItem(i){
        this.$emit('rmv', i);
      }
    }
  };
</script>
