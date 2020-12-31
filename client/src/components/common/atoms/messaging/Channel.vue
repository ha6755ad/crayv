<template>
  <div id="Channel">
    <div class="q-pa-sm text-sm text-mb-sm text-weight-medium">{{lget(channel, 'name', 'Untitled Channel')}}</div>
    <messaging-card :limit="limit" @more="reloadMessages(skip + 1)" :message-list="stateMessages" @sendingMessage="sendMessage"/>
  </div>
</template>

<script>
  import { models } from 'feathers-vuex';
  import MessagingCard from './MessagingCard';
  import {mapActions, mapGetters} from 'vuex';
  export default {
    name: 'Channel',
    components: {
      MessagingCard
    },
    props: {
      channel: Object,
      messagesIn: Array,
      limit: {
        type: Number,
        default: 25
      }
    },
    data() {
      return {
        channelInfo: new models.api.BwChannels().clone(),
        skip: 0,
      };
    },
    mounted() {

    },
    watch: {
      channel: {
        immediate: true,
        deep: true,
        handler(newVal, oldVal) {
          let newId = this.lget(newVal, '_id');
          let oldId = this.lget(oldVal, '_id');
          if (newId && newId !== oldId) {
            if(!this.messagesIn) this.loadInMessages();
            console.log('channel newVal', newVal);
            this.channelInfo = new models.api.BwChannels(newVal).clone();
          }
        }
      }
    },
    computed: {
      ...mapGetters('bw-messages', {findMessages: 'find'}),
      stateMessages(){
        return this.findMessages({
          query: {
            $sort: { createdAt: -1 },
            channel: this.channel._id
          }
        }).data.map(a => a.clone());
      }
    },
    methods: {
      ...mapActions('bw-messages', {
        createMessage: 'create', loadMessages: 'find'
      }),
      reloadMessages(i){
        this.skip = i;
        this.loadInMessages();
      },
      loadInMessages(){
        let query = {
          $limit: this.limit,
          $skip: this.skip * this.limit,
          $sort: { createdAt: -1 },
          channel: this.channel._id
        };
        this.loadMessages({ query: query });
      },
      sendMessage(val) {
        let newMessage = {
          message: val,
          sender: this.$lget(this.user, '_id', null),
          channel: this.$lget(this.channel, '_id', undefined)
        };
        this.createMessage(newMessage)
          .then(() => this.$emit('newMessage'))
          .catch(err => console.error(err));
      }
    }
  };
</script>

<style scoped lang="scss">
  #Channel {
    height: 100%;
  }
</style>
