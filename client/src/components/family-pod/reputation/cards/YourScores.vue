<template>
  <q-page :class="`bg-background q-pa-${$q.screen.name}`">
    <div class="q-pa-sm">
      <div class="q-pa-sm text-xs text-mb-sm text-weight-medium">You have {{total}} score{{total === 1 ? '' : 's'}}</div>
    <div class="row">
      <div class="q-ma-sm" v-for="(score, i) in stateItems" :key="`my-score-${i}`">
        <default-avatar bordered bg-in="dark" :value="lget(score, '_fastjoin.issuing')">
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
    </div>
    <div class="row justify-center">
      <div class="col-12 col-md-6 col-lg-4 q-pa-sm" v-for="(page, i) in pages" :key="`page-${i}`">
        <q-card>
          <div class="q-pa-md">
            <div class="text-sm text-mb-sm text-weight-medium">{{ page.label }}</div>
            <div class="text-xs text-mb-xs text-weight-light">{{ page.description }}</div>
          </div>
          <q-separator class="q-my-sm"></q-separator>

          <div class="row justify-end" v-if="isMobile">
            <q-btn
              size="sm"
              flat
              :label="tab.includes(i) ? 'Hide' : 'View'"
              :icon="tab.includes(i) ? 'mdi-eye-off' : 'mdi-eye'"
              color="primary"
              @click="toggleTab(i)"></q-btn>
          </div>

          <div class="__mobile_expand"
               :style="isMobile ? tab.includes(i) ? {} : { height: 0, overflow: 'hidden' } : {}">

            <reputation-list v-if="page.list" v-bind="page.list"></reputation-list>

            <pending-list v-if="page.pending" v-bind="page.pending"></pending-list>

          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ReputationList from 'components/family-pod/reputation/cards/ReputationList';
  import PendingList from 'components/family-pod/reputation/cards/PendingList';
  import {loadPaginatedMixin} from 'src/Mixins/LoadPaginatedMixin';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import ScoreCard from 'components/family-pod/reputation/cards/ScoreCard';

  export default {
    name: 'YourScores',
    mixins: [loadPaginatedMixin],
    components: { ScoreCard, DefaultAvatar, PendingList, ReputationList },
    mounted() {
      this.reloadItems(0);
      this.altReloadItems(0);
      this.$q.screen.lt.md ? this.isMobile = true : this.isMobile = false;
      window.addEventListener('resize', () => {
        this.$q.screen.lt.md ? this.isMobile = true : this.isMobile = false;
      });
    },
    data() {
      return {
        tab: [],
        isMobile: false,
        loadService: 'fc-score-issue',
      };
    },
    computed: {
      ...mapGetters('fc-scores', { findScores: 'find' }),
      queryAdders() {
        return { _id: { $in: this.lget(this.user, 'scores', [])}};
      },
      pages() {
        return [
          {
            label: 'Manage Scores',
            description: 'Review and accept scores',
            list: false,
            pending: {
              styleIn: { maxHeight: '80vh', overflowY: 'scroll' },
              queryIn: {
                issuingModel: 'fc-scores',
                subject: this.lget(this.user, '_id')
              }
            }
          },
          {
            label: 'Issue Scores',
            description: 'Scores you manage',
            list: {
              // styleIn: { maxHeight: '500px', overflowY: 'scroll' },
              adding: true,
              flat: true,
              searchOn: true,
              canEdit: true,
              serviceIn: 'fc-scores',
              queryIn: {
                _id: { $in: this.lget(this.user, 'canIssueScores', []) }
              },
            },
            pending: {
              // styleIn: { maxHeight: '500px', overflowY: 'scroll' },
              queryIn: {
                issuingModel: 'fc-scores',
                issuer: this.lget(this.user, '_id')
              }
            }
          },
          {
            label: 'Explore',
            description: 'Search and request scores',
            list: {
              // styleIn: { maxHeight: '80vh', overflowY: 'scroll' },
              adding: true,
              flat: true,
              searchOn: true,
              canEdit: true,
              serviceIn: 'fc-scores',
              queryIn: {
                privacy: 'public'
              }
            },
            pending: false
          }
        ];
      }
    },
    methods: {
      toggleTab(i) {
        let list = this.tab;
        let idx = list.indexOf(i);
        if (idx > -1) list.splice(idx, 1);
        else list.push(i);
        this.tab = list;
      }
    }
  };
</script>

<style scoped lang="scss">
  .__mobile_expand {
    transition: all .3s ease-out;
    height: 70vh;
    overflow-y: scroll;
  }
</style>
