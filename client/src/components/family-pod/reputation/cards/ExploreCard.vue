<template>
  <div class="fill_size q-pa-md bg-background" style="min-height: 80vh">
    <div class="text-sm text-mb-sm text-weight-medium">Explore Items</div>
    <div class="text-xs text-mb-xs text-weight-light">Explore  and request credentials, or experiences</div>
    <q-separator class="q-my-sm" color="white"></q-separator>
    <div class="row justify-center">
      <div class="col-12 col-md-6 col-lg-4 q-pa-sm" v-for="(page, i) in pages" :key="`page-${i}`">
        <q-card>
          <reputation-list :style-in="{maxHeight: '70vh', overflowY: 'scroll'}" adding flat search-on can-edit :service-in="page.service" :title="'Explore ' + page.label" :query-in="page.query()"></reputation-list>

        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
  import ReputationList from 'components/family-pod/reputation/cards/ReputationList';

  export default {
    name: 'ExploreCard',
    components: { ReputationList },
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
                privacy: 'public'
              };
            },
          },
          {
            label: 'Credentials',
            service: 'fc-credentials',
            query: () => {
              return {
                privacy: 'public'
              };
            },
          },
          {
            label: 'Experiences',
            service: 'fc-experiences',
            query: () => {
              return {
                privacy: 'public'
              };
            },
          }
        ];
      }
    }
  };
</script>

<style scoped>

</style>
