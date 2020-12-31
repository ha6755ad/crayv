<template>
  <q-card flat>
    <div v-if="title || subTitle" class="q-pa-sm text-xs text-mb-sm text-weight-medium">
      <div>{{ title }}</div>
      <div class="text-xxs text-mb-xs text-weight-light">{{ subTitle }}</div>
    </div>
    <div v-if="addBtn" class="row justify-end">
      <q-btn size="sm" flat label="new" icon="mdi-plus" color="primary" @click="addDialog = true"></q-btn>
    </div>
    <div class="row">
      <div class="q-pa-lg text-italic text-xs text-mb-sm" v-if="!lget(activeItems, [0])">No Scores Selected...</div>
      <div class="q-pa-sm pointer" v-for="(score, i) in activeItems" :key="`active-score-${i}`"
           style="position: relative">
        <q-btn class="t-l-a" color="negative" icon="mdi-close" size="xs" flat dense @click="removeItem(i)"></q-btn>
        <default-avatar bordered bg-in="dark" :value="score">
          <template v-slot:menu>
            <q-menu>
              <div style="width: 300px">
                <score-card :value="score"></score-card>
              </div>
            </q-menu>
          </template>
        </default-avatar>
      </div>
    </div>
    <q-separator class="q-my-xs"></q-separator>
    <div class="q-pa-sm text-xxs text-mb-xs text-weight-medium">Search and Select Scores</div>
    <div class="row justify-center">
      <div style="width: 600px; max-width: 100%">
        <tag-picker v-model="tagFilter" service-in="fc-scores" placeholder="Filter by topic"
                    @input="scrollTab = -1"></tag-picker>
      </div>
    </div>
    <load-and-paginate
      :query-adders="queryAdders"
      :paginator="false"
      load-service="fc-scores"
      :load-watch="scrollTab"
      search search-placeholder="Search By Name..."
    >
      <template v-slot:list="scope">
        <div class="__score_scroll bg-background">
          <scroll-sensor id-in="discover_scores" v-model="scrollTab">
            <q-card flat>
              <template v-if="!grid">
                <q-list separator>
                  <q-item v-for="(score, i) in scope.items" :key="`item-${i}`" style="position: relative">
                    <q-btn class="t-r" size="sm" color="positive" dense flat v-if="isSelected(score)"
                           icon="mdi-checkbox-marked-outline"></q-btn>
                    <reputation-item
                      flat
                      @add="handleInput"
                      :value="score"
                    >
                    </reputation-item>
                  </q-item>
                </q-list>
              </template>
              <template v-else>
                <div class="row">
                  <div class="q-pa-sm col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2" v-for="(score, i) in scope.items"
                       :key="`item-${i}`">
                    <q-card>
                      <score-card @add="handleInput" :value="score"></score-card>
                    </q-card>
                  </div>
                </div>
              </template>
            </q-card>
          </scroll-sensor>
        </div>
      </template>
    </load-and-paginate>

    <q-dialog v-model="addDialog">
      <q-card style="width: 600px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="addDialog = false"/>
        <add-card></add-card>
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script>
  import {mapGetters} from 'vuex';
  import LoadAndPaginate from 'components/common/atoms/loading/LoadAndPaginate';
  import ScrollSensor from 'components/common/atoms/loading/ScrollSensor';
  import ReputationItem from 'components/family-pod/reputation/cards/ReputationItem';
  import ScoreCard from 'components/family-pod/reputation/cards/ScoreCard';
  import TagPicker from 'components/common/atoms/pickers/TagPicker';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import AddCard from 'components/family-pod/reputation/forms/AddCard';

  export default {
    name: 'DiscoverScores',
    components: { AddCard, DefaultAvatar, TagPicker, ScoreCard, ReputationItem, ScrollSensor, LoadAndPaginate },
    mixins: [],
    props: {
      addBtn: Boolean,
      title: String,
      subTitle: String,
      multiple: Boolean,
      emitValue: Boolean,
      grid: Boolean,
      value: [Object, Array]
    },
    data() {
      return {
        addDialog: false,
        scrollTab: -1,
        tagFilter: [],
        selected: null
      };
    },
    watch: {
      activeIds: {
        immediate: true,
        handler(newVal) {
          let newLength = newVal ? newVal.length : 0;
          if (newLength) {
            let active = this.activeItems ? this.activeItems.length : 0;
            if (newLength > active) {
              this.$store.dispatch('fc-scores/find', {
                query: { _id: { $in: newVal } }
              });
            }
          }
        }
      },
      value: {
        immediate: true,
        handler(newVal) {
          this.selected = newVal;
        }
      }
    },
    computed: {
      ...mapGetters('fc-scores', {
        findScores: 'find'
      }),
      activeIds() {
        if (this.value) {
          let list = Array.isArray(this.value) ? this.value : [this.value];
          return this.emitValue ? list : list.map(a => a._id);
        } else return [];
      },
      activeItems() {
        if (this.value) {
          let list = this.activeIds;
          return this.findScores({
            query: {
              _id: { $in: list }
            }
          }).data;
        } else return [];
      },
      queryAdders() {
        let query = {};
        if (this.lget(this.tagFilter, [0])) {
          query.tags = { $in: this.tagFilter };
        }
        return query;
      }
    },
    methods: {
      removeItem(i) {
        this.selected.splice(i, 1);
        this.$emit('input', this.selected);
      },
      isSelected(val) {
        return this.activeIds.includes(val._id);
      },
      selectedIndex(val) {
        return this.activeIds.map(a => JSON.stringify(a)).indexOf(JSON.stringify(val._id));
      },
      handleInput(val) {
        let idx = this.selectedIndex(val);
        console.log('input', idx);
        if (idx === -1) {
          let payload = val;
          if (this.emitValue) {
            payload = val._id;
          }
          if (this.multiple) {
            this.selected ? this.selected.push(payload) : this.selected = [payload];
          } else this.selected = payload;
        } else {
          console.log('splicing', idx);
          this.selected.splice(idx, 1);
        }
        this.$emit('input', this.selected);
      }
    }
  };
</script>

<style scoped lang="scss">
  .__score_scroll {
    position: relative;
    max-height: 500px;
    min-height: 200px;
    width: 100%;
  }
</style>
