<template>
  <div>
    <q-item clickable @click="$emit('select')">
      <q-item-section avatar>
        <default-avatar :value="fullPod"/>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-weight-bold">{{ channel.name }}</q-item-label>
        <q-item-label caption :class="unread ? 'text-weight-bold' : ''" v-html="lastMessage"></q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import {models} from 'feathers-vuex';

  export default {
    name: 'ChannelItem',
    components: {
      DefaultAvatar,
    },
    props: {
      channel: Object,
    },
    data() {
      return {
        channelInfo: null,
        skip: 0,
        limit: 25
      };
    },
    async mounted() {
      if (this.channel) {
        this.channelInfo = this.channel;
      }
    },
    watch: {
      channel: {
        immediate: true,
        deep: true,
        handler(newVal, oldVal) {
          let newId = this.lget(newVal, '_id');
          let oldId = this.lget(oldVal, '_id');
          if (newId && newId !== oldId) {
            this.loadInMessages();
            if (!newVal.fullPod) this.$store.dispatch('bw-pods/get', newVal.pod);
            console.log('channel newVal', newVal);
            this.channelInfo = new models.api.BwChannels(newVal).clone();
          }
        }
      }
    },
    computed: {
      ...mapGetters('bw-messages', { findMessages: 'find' }),
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters('bw-pods', { getPod: 'get' }),
      fullPod() {
        return this.lget(this.channel, 'fullPod', this.getPod(this.lget(this.channel, 'pod')));
      },
      stateMessages() {
        return this.findMessages({
          query: {
            $sort: { createdAt: -1 },
            channel: this.channel._id
          }
        }).data.map(a => a.clone());
      },
      lastMessage() {
        return this.sanitize(this.lget(this.stateMessages, [0, 'message']));
      },
      unread() {
        let message = this.lget(this.stateMessages, [0, 'message']);
        return !this.lget(message, 'seenBy', []).includes(this.user._id);
      }
    },
    methods: {
      ...mapActions('bw-messages', {
        createMessage: 'create', loadMessages: 'find'
      }),
      loadInMessages() {
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
