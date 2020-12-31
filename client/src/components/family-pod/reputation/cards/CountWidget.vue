<template>
  <div>
    <div class="flex text-xxs text-mb-xxs text-weight-light">
      <div>{{ dollarString(upVotes.length, '', 0) }} Supporters</div>
      <q-btn dense flat size="xs" icon="mdi-eye" @click="change(true)">
        <q-tooltip content-class="bg-dark text-light text-xxs text-mb-xxs">See Supporters</q-tooltip>
      </q-btn>
    </div>
    <div class="flex justify-end text-right text-xxs text-mb-xxs text-weight-light">
      <div>{{ dollarString(downVotes.length, '', 0) }} Detractors</div>
      <q-btn dense flat size="xs" icon="mdi-eye" @click="change(false)">
        <q-tooltip content-class="bg-dark text-light text-xxs text-mb-xxs">See Detractors</q-tooltip>
      </q-btn>
    </div>

    <q-dialog v-model="fullDialog">
      <q-card style="width: 700px; max-width: 100vw" class="q-pa-md">
        <q-btn class="t-r-f bg-dark text-light" dense flat icon="mdi-close" @click="fullDialog = false"/>
        <div class="text-xs text-mb-xs text-weight-medium row items-center">
          <div>{{activeVotes.length}} {{ activeVotes.length === 1 ? 'person' : 'people' }} <q-btn dense :size="$q.screen.lt.sm ? 'sm' : ''" :label="`${up ? 'Agree' : 'Disagree'}${ activeVotes.length === 1 ? 's' : ''}`" :color="up ? 'positive' : 'negative'" flat :icon="up ? 'mdi-check' : 'mdi-cancel'" push @click="change(!up)"></q-btn> with my {{type}}</div>
          <q-space></q-space>
          <default-avatar :class="$q.screen.gt.xs ? '' : 't-r'" :value="lget(value, '_fastjoin.issuing')"></default-avatar>
          </div>
        <q-separator class="q-my-sm"></q-separator>
        <div class="row justify-center">
          <q-input :placeholder="`Search People`" style="width: 400px; max-width: 95%" v-model="searchInput" @keyup.enter="loadItems(searchInput)" outlined rounded dense>
            <template v-slot:prepend>
              <q-btn style="transition: all .3s ease-out" round size="sm" :flat="!searchInput"
                     :color="searchInput ? 'primary' : ''" icon="mdi-magnify" @click="loadItems(searchInput)"></q-btn>
            </template>
          </q-input>
        </div>
        <div class="row justify-center">
          <div>
            <node-circle :pix="pix" :mid-avatar="getAvatar(lget(value, '_fastjoin.issuing'), 'avatar', 'small')" :nodes="stateItems">
            </node-circle>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import {loadPaginatedMixin} from 'src/Mixins/LoadPaginatedMixin';
  import NodeCircle from 'components/common/atoms/NodeCircle';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';

  export default {
    name: 'CountWidget',
    components: { DefaultAvatar, NodeCircle },
    mixins: [loadPaginatedMixin],
    props: {
      value: Object,
      serviceIn: String,
    },
    mounted(){
      this.pix = Math.max(50, window.innerWidth / 15);
      window.addEventListener('resize', () => {
        this.pix = Math.max(50, window.innerWidth / 15);
      });
    },
    data() {
      return {
        pix: 50,
        up: true,
        fullDialog: false,
        ids: [],
        searchInput: ''
      };
    },
    watch: {
      value: {
        immediate: true,
        async handler(newVal, oldVal) {
          let newId = this.$lget(newVal, '_id', '*');
          let oldId = this.$lget(oldVal, '_id', '!');
          if (newId && newId !== oldId) {
            await this.$store.dispatch(`${this.recordService}/find`, {
              query: {
                subject: this.lget(this.value, 'issuing')
              }
            });
          }
        }
      }
    },
    computed: {
      activeVotes(){
        return this.up ? this.upVotes : this.downVotes;
      },
      upVotes() {
        return this.lget(this.value, 'upVotes', []);
      },
      downVotes() {
        return this.lget(this.value, 'downVotes', []);
      },
      queryAdders() {
        let query = {};
        if (this.up) {
          query._id = { $in: this.upVotes };
        } else {
          query._id = { $in: this.downVotes };
        }
        return query;
      },
      stateRecords() {
        return this.$store.getters[`${this.recordService}/find`]({
          query: {
            $sort: { active: 1 },
            subject: this.lget(this.value, 'issuing')
          }
        });
      },
      type() {
        if (this.serviceIn.indexOf('score') > -1) return 'Score';
        else if (this.serviceIn.indexOf('credential') > -1) return 'Credential';
        else if (this.serviceIn.indexOf('experience') > -1) return 'Experience';
        else return 'Invalid Service';
      },
      loadService() {
        return 'users';
      },
      issueService() {
        if (this.serviceIn.indexOf('score') > -1) return 'fc-score-issue';
        else if (this.serviceIn.indexOf('credential') > -1) return 'fc-credential-issue';
        else if (this.serviceIn.indexOf('experience') > -1) return 'fc-experience-issue';
        else return 'Invalid Service';
      },
      recordService() {
        if (this.serviceIn.indexOf('score') > -1) return 'fc-score-records';
        else if (this.serviceIn.indexOf('credential') > -1) return 'fc-credential-records';
        else if (this.serviceIn.indexOf('experience') > -1) return 'fc-experience-records';
        else return 'Invalid Service';
      },
    },
    methods: {
      change(val){
        this.up = val;
        this.reloadItems(0);
        this.fullDialog = true;
      }
    }
  };
</script>
