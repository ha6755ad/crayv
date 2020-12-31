<template>
  <div id="Channel">
    <div class="q-pa-sm text-sm text-mb-sm text-weight-medium">{{lget(channel, 'name', 'Untitled Channel')}}</div>
    <messaging-card :message-list="lget(channelInfo, '_fastjoin.messages')" @sendingMessage="sendMessage"/>
  </div>
</template>

<script>
  import { models } from 'feathers-vuex';
  import MessagingCard from '../../molecules/MessagingCard';
  import {mapActions} from 'vuex';
  export default {
    name: 'Channel',
    components: {
      MessagingCard
    },
    props: {
      channel: Object
    },
    data() {
      return {
        channelInfo: null
      };
    },
    mounted() {
      if(this.channel) this.channelInfo = this.channel;
    },
    computed: {},
    watch: {
      channel: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal) {
            this.channelInfo = new models.api.BwChannels(newVal).clone();
          }
        }
      }
    },
    methods: {
      ...mapActions('bw-messages', {
        createMessage: 'create'
      }),
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
