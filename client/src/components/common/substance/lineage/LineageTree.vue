<template>
  <div class="fill_size">
    <div class="row q-pa-md bg-white text-md text-mb-md text-weight-medium">
      <div>Your Network</div>
      <q-space/>
      <div>
        <div class="text-xxxs text-mb-xxs text-weight-light">
          <div>See a problem with your score?</div>
          <div class="row justify-end">
          <q-btn size="sm" flat label="fix it" @click="runFix"/>
          </div>
        </div>
      </div>
      </div>
    <q-separator color="primary"/>
    <div class="row q-pa-md">
      <div class="col-12 col-md-6 q-pa-sm">
      <q-card style="width: 100%">
        <link-card title="Your Invite Link" sub-title="Use this to invite people" :url="url"/>
        <q-item>

          <q-item-section>
            <template v-for="(item, i) in scoreboardItems">
            <div class="row items-center text-xs text-mb-sm text-weight-light"  :key="`scorboarditem-${i}`">
              <div>{{ item.label }}</div>
              <q-space/>
              <div class="text-weight-medium text-sm text-mb-md">{{item.value}}</div>
            </div>
            <q-separator :key="`separator-${i}`"/>
            </template>
          </q-item-section>
        </q-item>
      </q-card>
      </div>
      <div class="col-12 col-md-6 q-pa-sm">

      </div>
    </div>
    <div class="q-pa-md row">
      <div class="col-12 col-sm-6 col-lg-3">
        <detail-card show-lineage chat-off :value="lget(userScorecard, 'fullUser')"/>
      </div>
    </div>
    <div class="q-pa-md">
      <div class="q-pa-md text-xs text-mb-sm text-weight-medium">Invited By</div>
      <div class="row">
        <template v-if="parentNode">
          <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <detail-card show-lineage chat-off @tree="userScorecard = parentNode" :value="parentNode.fullUser"/>
          </div>
        </template>
        <template v-else>
          <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <q-card class="q-pa-md text-sm text-mb-sm text-italic">
              {{ lget(userScorecard, 'fullUser.name', lget(userScorecard, 'fullUser.username', 'Who')) }} came here all on their own
            </q-card>
          </div>
        </template>
      </div>
    </div>
    <div class="q-pa-md">
<!--      TODO: write pagination-->
      <div class="q-pa-md text-xs text-mb-sm text-weight-medium">Direct Invites</div>
      <div class="row">
        <template v-if="nodes">
        <div v-for="(node, i) in nodes" :key="`node-${i}`" class="q-pa-sm col-12 col-sm-6 col-md-4 col-lg-3">
          <detail-card show-lineage @tree="userScorecard = node" :value="node.fullUser" chat-off/>
        </div>
        </template>
        <template v-else>
          <div class="text-sm text-mb-sm text-italic">
          {{lget(userScorecard, 'fullUser.name', lget(userScorecard, 'fullUser.username', 'This person'))}} hasn't invited anyone who has joined
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import DetailCard from 'components/common/atoms/users/DetailCard';
  import LinkCard from 'components/common/atoms/LinkCard';

  export default {
    name: 'LineageTree',
    components: { LinkCard, DetailCard },
    props: {
      lineageIn: Object,
    },
    async mounted() {
      await this.$store.dispatch('lc-scorecard/get', [this.user.scorecard, { $populateParams: { name: 'nextGenWithUser' } }])
        .then(res => {
          console.log('scorecard res', res);
          this.userScorecard = res.clone();
        // this.nodes = this.lget(res, 'referredList', []);
        // this.parentNode = this.lget(res, 'fullReferredBy', null);
        }).catch(err => {
          console.log('error getting scorecard', err.message);
        });
    },
    data() {
      return {
        parentNode: null,
        nodes: [],
        userScorecard: null
      };
    },
    watch: {
      userScorecard: {
        immediate: true,
        handler(newVal, oldVal) {
          let newId = this.lget(newVal, '_id', 0);
          let oldId = this.lget(oldVal, '_id', 1);
          if(newId && newId !== oldId){
            this.genTree(newVal);
            this.parentNode = this.lget(newVal, 'fullReferredBy', null);
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters('lc-scorecard', { getScorecard: 'get'}),
      scorecard(){
        if(this.lget(this.user, 'scorecard')) {
          return this.lget(this.user, 'fullScorecard', this.getScorecard(this.user.scorecard));
        } else return null;
      },
      scoreboardItems(){
        let score = 0;
        this.lget(this.scorecard, 'referred', []).forEach((r, i) => {
          score += Math.min(i, 100);
        });
        return [
          {
            label: 'Direct Referrals',
            value: this.lget(this.scorecard, 'referred', []).length
          },
          {
            label: 'LGCY Earned',
            value: score
          },
          {
            label: 'LGCY for your next referral',
            value:  Math.max(this.levelOne.count + 1, 1)
          },
          {
            label: 'Total Network Score',
            value: this.networkValue
          }
        ];
      },
      url(){
        return `${process.env.VUE_APP_URL ? process.env.VUE_APP_URL : 'https://www.legacycoin.co'}/join?referrer=${this.lget(this.user, 'scorecard')}`;
      },
      networkValue(){
        let TenGenTotal = 0;
        this.lget(this.lineageIn, 'levels', []).forEach(level => {
          TenGenTotal += this.lget(level, 'users', []).length;
        });
        return Math.max(this.lget(this.userScorecard, 'network', 0), TenGenTotal);
      },
      levelOne(){
        return {
          score: this.lget(this.lineageIn, 'directCoins', 0),
          count: this.lget(this.lineageIn, 'userGen.referred', []).length
        };
      }
    },
    methods: {
      async runFix(){
        this.$isLoading('Assessing Score');
        await this.$store.dispatch('dashboard/create', {type: 'fix', user: this.user})
          .then(res => {
            this.$isLoading(false);
            console.log('calc res', res);
            this.$infoNotify(`Your network score has been checked and has been set to ${res.network}`);
          })
          .catch(err => {
            this.$isLoading(false);
            console.log('scorecard calc error', err);
            this.$errNotify('Error fixing your network score');
          });
      },
      async genTree(scorecard) {
        console.log('lineage tree', scorecard);
        await this.$store.dispatch('lineage-tree/create', {
          childPath: 'referred',
          nodeService: 'lc-scorecard',
          startNode: scorecard
        })
          .then(res => {
            console.log('lineage tree res', res);
            this.nodes = res;
          }).catch(err => {
            console.log('error generating nodes', err);
          });
      }
    }
  };
</script>
