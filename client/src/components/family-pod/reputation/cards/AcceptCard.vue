<template>
  <div class="fill_size q-pa-md bg-background" style="min-height: 80vh">
    <div class="text-sm text-mb-sm text-weight-medium">Your Awards</div>
    <div class="text-xs text-mb-xs text-weight-light">Review your scores, credentials, or experiences</div>
    <q-separator class="q-my-sm" color="white"></q-separator>
    <div class="row justify-center">
      <div class="col-12 col-md-6 col-lg-4 q-pa-sm" v-for="(page, i) in pages" :key="`page-${i}`">
        <q-card>
          <pending-list :style-in="{maxHeight: '80vh', overflowY: 'scroll'}" :type-in="page.label" :title="page.label + ' Pending'" :query-in="page.pendingQuery()"></pending-list>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
  import PendingList from 'components/family-pod/reputation/cards/PendingList';

  export default {
    name: 'AcceptCard',
    components: { PendingList },
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
            pendingQuery: () => {
              return {
                issuingModel: 'fc-scores',
                subject: this.lget(this.user, '_id')
              };
            }
          },
          {
            label: 'Credentials',
            service: 'fc-credentials',
            pendingQuery: () => {
              return {
                issuingModel: 'fc-credentials',
                subject: this.lget(this.user, '_id')
              };
            }
          },
          {
            label: 'Experiences',
            service: 'fc-experiences',
            pendingQuery: () => {
              return {
                issuingModel: 'fc-experiences',
                subject: this.lget(this.user, '_id')
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
