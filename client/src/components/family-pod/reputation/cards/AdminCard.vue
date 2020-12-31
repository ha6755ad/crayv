<template>
  <div class="fill_size q-pa-md bg-background" style="min-height: 80vh">
    <div class="text-sm text-mb-sm text-weight-medium">Items you can award</div>
    <div class="text-xs text-mb-xs text-weight-light">Manage and issue scores, credentials, or experiences</div>
    <q-separator class="q-my-sm" color="white"></q-separator>
    <div class="row justify-center">
    <div class="col-12 col-md-6 col-lg-4 q-pa-sm" v-for="(page, i) in pages" :key="`page-${i}`">
      <q-card>
      <reputation-list :style-in="{maxHeight: '500px', overflowY: 'scroll'}" adding flat search-on can-edit :service-in="page.service" :title="'Manage ' + page.label" :query-in="page.query()"></reputation-list>

        <pending-list :style-in="{maxHeight: '500px', overflowY: 'scroll'}" :type-in="page.label" :title="page.label + ' Pending'" :query-in="page.pendingQuery()"></pending-list>

      </q-card>
    </div>
    </div>
  </div>
</template>

<script>
  import ReputationList from 'components/family-pod/reputation/cards/ReputationList';
  import PendingList from 'components/family-pod/reputation/cards/PendingList';

  export default {
    name: 'AdminCard',
    components: { PendingList, ReputationList },
    mixins: [],
    props: {
      serviceIn: String,
      queryAdders: Object,
      paramsAdders: Object
    },
    computed: {
      pages() {
        return [
          {
            label: 'Scores',
            service: 'fc-scores',
            query: () => {
              return {
                _id: { $in: this.lget(this.user, 'canIssueScores', [])}
              };
            },
            pendingQuery: () => {
              return {
                issuingModel: 'fc-scores',
                issuer: this.lget(this.user, '_id')
              };
            }
          },
          {
            label: 'Credentials',
            service: 'fc-credentials',
            query: () => {
              return {
                _id: { $in: this.lget(this.user, 'canIssueCredentials', [])}
              };
            },
            pendingQuery: () => {
              return {
                issuingModel: 'fc-credentials',
                issuer: this.lget(this.user, '_id')
              };
            }
          },
          {
            label: 'Experiences',
            service: 'fc-experiences',
            query: () => {
              return {
                _id: { $in: this.lget(this.user, 'canIssueExperiences', [])}
              };
            },
            pendingQuery: () => {
              return {
                issuingModel: 'fc-experiences',
                issuer: this.lget(this.user, '_id')
              };
            }
          }
        ];
      }
    }
  };
</script>

<style scoped>

</style>
