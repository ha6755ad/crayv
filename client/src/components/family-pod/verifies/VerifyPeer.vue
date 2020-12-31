<template>
  <q-card flat class="q-pa-md">
    <div class="row q-my-md">
      <q-btn-group>
        <q-btn :size="$q.screen.lt.md ? 'sm' : ''" v-for="(tab, i) in tabs" :key="`btn-${i}`" :color="page === i ? 'accent' : 'grey-6'" @click="page = i" :label="tab.btn"/>
      </q-btn-group>
    </div>
    <q-separator/>
    <q-tab-panels animated v-model="page">
      <q-tab-panel :name="i" v-for="(tab, i) in tabs" :key="`tab-${i}`">
        <q-list separator>
          <q-item dense>
            <q-item-section avatar>
              <img src="https://ha6755ad-images.s3-us-west-1.amazonaws.com/fc_grid_color.svg">
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-sm text-mb-sm text-weight-medium">{{tab.label}}</q-item-label>
              <q-item-label caption class="text-xs text-mb-xs text-weight-medium">Powered by Family Chain - identity is about people.</q-item-label>
            </q-item-section>
          </q-item>
            <q-item v-for="(verify, i) in tab.verifies" :key="`verify-${i}`">
              <verify-card :verify="verify"/>
            </q-item>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script>
  import {mapGetters} from 'vuex';
  import VerifyCard from 'components/family-pod/verifies/cards/VerifyCard';

  export default {
    name: 'VerifyPeer',
    components: { VerifyCard },
    data(){
      return {
        page: 0
      };
    },
    watch: {
      user: {
        immediate: true,
        handler(newVal){
          if(newVal){
            this.loadVerifies();
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters('fc-verify', {findVerifies : 'find'}),
      tabs(){
        return [
          {
            label: 'Open Verification Requests',
            btn: 'open',
            verifies: this.activeVerifies
          },
          {
            label: 'Verified Requests',
            btn: 'verified',
            verifies: this.passedVerifies.filter(a => a.status === 'verified')
          },
          {
            label: 'Rejected Verification Requests',
            btn: 'rejected',
            verifies: this.passedVerifies.filter(a => a.status === 'fraud')
          },
          {
            label: 'Expired Verification Requests',
            btn: 'expired',
            verifies: this.passedVerifies.filter(a => a.status === 'closed')
          }
        ];
      },
      activeVerifies(){
        return this.findVerifies({
          query: { user: this.user._id, status: 'open' }
        }).data.map(a => a.clone());
      },
      passedVerifies(){
        return this.findVerifies({
          query: { user: this.user._id, status: { $nin: ['open'] }}
        }).data.map(a => a.clone());
      }
    },
    methods: {
      loadVerifies(){
        this.$store.dispatch('fc-verify/find', {
          query: {
            $limit: 50,
            user: this.user._id
          },
          $populateParams: { name: 'withAll' }
        }).catch(err => {
          console.log('load verify error', err);
          this.$errNotify('Issue getting verification requests - check your connection');
        });
      }
    }
  };
</script>
