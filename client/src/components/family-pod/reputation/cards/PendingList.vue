<template>
  <q-card flat class="q-pa-md">
    <div class="text-xs text-mb-sm">Review & Approve Scores</div>

    <div>
      <q-btn-group flat rounded size="xs">
        <q-btn flat size="xs" v-for="(type, i) in types" :key="`btn-${i}`" :label="type.label" @click="setTab(i)" :color="tab === i ? 'nice' : 'grey-5'">
          <div class="__underline" :style="tab === i ? {background: 'var(--q-color-nice)'} : {width: 0}"></div>
        </q-btn>
      </q-btn-group>
    </div>

    <div class="q-my-xs row justify-center">
     <q-input v-model="searchInput" @keyup.enter="searchInput ? loadItems(searchInput) : ''" dense rounded outlined style="width: 400px; max-width: 90%">
       <template v-slot:prepend>
         <q-btn style="transition: all .3s ease-out" round size="sm" :flat="!searchInput" :color="searchInput ? 'blue' : ''" icon="mdi-magnify" @click="searchInput ? loadItems(searchInput) : ''"></q-btn>
       </template>
     </q-input>
   </div>
    <q-card flat :style="styleIn" v-if="!paginateLoading && stateItems && stateItems.length">
    <q-list separator>
      <template v-for="(item, i) in stateItems">
        <pending-card :key="`pending-${i}`" :value="item"></pending-card>
        <q-separator :key="`sep-${i}`" v-if="i < stateItems.length - 1"></q-separator>
      </template>
    </q-list>
    </q-card>
    <div v-else-if="paginateLoading" class="flex flex-center" style="width: 100%; height: 100px">
      <q-spinner color="secondary" size="50px"></q-spinner>
    </div>
    <div v-else>
      <div class="flex flex-center" style="width: 100%; height: 60px">
        <div class="text-sm text-mb-sm text-italic">
          No {{ types[tab].label }} items
        </div>
      </div>
    </div>
  </q-card>
</template>

<script>
  import {loadPaginatedMixin} from 'src/Mixins/LoadPaginatedMixin';
  import PendingCard from 'components/family-pod/reputation/forms/PendingCard';

  export default {
    name: 'PendingList',
    components: { PendingCard },
    mixins: [loadPaginatedMixin],
    props: {
      styleIn: Object,
      queryIn: Object,
      stopLoad: Boolean
    },
    mounted() {
      console.log('load', this.queryIn);
      if(!this.stopLoad) this.reloadItems(0);
    },
    data() {
      return {
        tab: 0,
        searchInput: '',
        starter: true,
        loadService: 'fc-reputation-issue'
      };
    },
    watch: {
      paginateLoading: {
        immediate: true,
        handler(newVal, oldVal){
          if(oldVal && !newVal && this.total === 0){
            if(this.tab !== 1 && this.starter) {
              this.starter = false;
              this.setTab(1);
            }
          }
        }
      }
    },
    computed: {
      filterByName(){
        return '_fastjoin.issuing.name';
      },
      types() {
        return [
          {
            label: 'Pending',
            status: 'pending'
          },
          {
            label: 'Accepted',
            status: 'accepted',
          },
          {
            label: 'Rejected',
            status: 'rejected'
          }
        ];
      },
      queryAdders() {
        let query = Object.assign({}, this.queryIn);
        query.status = this.types[this.tab].status;
        return query;
      }
    },
    methods: {
      setTab(i) {
        this.tab = i;
        if (!this.stateItems || !this.stateItems.length) {
          this.reloadItems(0);
        }
      }
    }
  };
</script>
