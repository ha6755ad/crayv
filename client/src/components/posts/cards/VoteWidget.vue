<template>
  <div style="display: flex; align-items: center">
    <q-icon @mouseenter="up = true" @mouseleave="up = false" @touchstart="up = true" @touchend="up = false" :style="up ? {transform: 'scale(1.2)'} : {}" :size="size" name="mdi-menu-up" color="positive" class="__vote_btn pointer" @click="upVote">
      <q-tooltip content-class="bg-dark text-light text-xxs text-mb-xs">Up Vote</q-tooltip>
      </q-icon>
    <div :class="`text-${parseInt(size) > 25 ? 'xs' : 'xxs'} text-mb-${parseInt(size) > 25 ? 'xs' : 'xxs'} text-weight-bold`">
      {{score}}
    </div>
    <q-icon @mouseenter="down = true" @mouseleave="down = false" @touchstart="down = true" @touchend="down = false" :style="down ? {transform: 'scale(1.2)'} : {}" :size="size" name="mdi-menu-down" color="negative" class="__vote_btn pointer" @click="downVote">
      <q-tooltip content-class="bg-dark text-light text-xxs text-mb-xs">Down Vote</q-tooltip>
      </q-icon>
  </div>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    name: 'VoteWidget',
    props: {
      size: {
        type: String,
        default: '40px'
      },
      service: String,
      subject: Object,
      namedQuery: String
    },
    data(){
      return {
        up: false,
        down: false,
        upVoted: false,
        downVoted: false,
        local: {}
      };
    },
    watch: {
      subject: {
        deep: true,
        immediate: true,
        handler(newVal){
          if(newVal) {
            this.local = Object.assign({}, newVal);
            this.upVoted = false;
            this.downVoted = false;
          }
        }
      }
    },
    computed: {
      ...mapState('auth', { user: 'user' }),
      score(){
        let ups = this.lget(this.subject, 'upVotes', []).length;
        let downs = this.lget(this.subject, 'downVotes', []).length;
        return ups - downs;
      },
      downVotes(){
        return this.lget(this.local, 'downVotes', []);
      },
      downIndex(){
        let downVotes = this.downVotes;
        if(downVotes){
          return downVotes.map(a => JSON.stringify(a)).indexOf(JSON.stringify(this.lget(this.user, '_id')));
        } else return -1;
      },
      upVotes(){
        return this.lget(this.local, 'upVotes', []);
      },
      upIndex(){
        let upVotes = this.upVotes;
        if(upVotes){
          return upVotes.map(a => JSON.stringify(a)).indexOf(JSON.stringify(this.lget(this.user, '_id')));
        } else return -1;
      }
    },
    methods: {
      upVote() {
        let params = {};
        if (this.namedQuery) params.$populateParams = { name: this.namedQuery };
        this.$store.dispatch(`${this.service}/patch`, [this.lget(this.subject, '_id'), {
          $addToSet: { upVotes: this.lget(this.user, '_id') },
          $pull: { downVotes: this.lget(this.user, '_id') }
        }, params])
          .then(() => {
            this.$successNotify('Up Voted');
          // if(this.downIndex > -1) this.local.downVotes.splice(this.downIndex, 1);
          // if(!this.upIndex > -1) this.upVotes ? this.local.upVotes.push(this.user._id) : this.local.upVotes = [this.user._id];
          })
          .catch(err => this.$errNotify(err.message));
      },
      downVote() {
        let params = {};
        if (this.namedQuery) params.$populateParams = { name: this.namedQuery };
        this.$store.dispatch(`${this.service}/patch`, [this.lget(this.subject, '_id'), {
          $pull: { upVotes: this.lget(this.user, '_id') },
          $addToSet: { downVotes: this.lget(this.user, '_id') }
        }, params])
          .then(() => {
            this.$successNotify('Down Voted');
          // if(this.upIndex > -1) this.local.upVotes.splice(this.upIndex, 1);
          // if(!this.downIndex > -1) this.downVotes ? this.local.downVotes.push(this.user._id) : this.local.downVotes = [this.user._id];
          })
          .catch(err => this.$errNotify(err.message));
      }
    }
  };
</script>

<style scoped lang="scss">
  .__vote_btn {
    transition: all .12s ease-out;
  }
</style>
