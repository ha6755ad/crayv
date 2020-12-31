<template>
  <q-card class="__chat_window">
    <div class="row items-center">
      <q-btn icon="mdi-arrow-left" round push color="dark" @click="activeChannel = null" v-if="activeChannel"/>
      <div v-else class="text-xs text-mb-md text-weight-bold q-px-sm">Your Channels</div>
    </div>
    <q-separator class="q-my-sm"/>
    <q-card flat v-if="!activeChannel">
      <q-list>
        <q-item dense>
          <pod-picker label="Filter by Pod..." v-model="podFilter"></pod-picker>
        </q-item>
        <q-item clickable @click="addDialog = true">
          <q-item-section avatar>
            <q-icon name="mdi-plus-circle"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Add Channel</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator/>
        <template v-for="(channel, i) in stateChannels">
          <channel-item :key="`channel-${i}`" :channel="channel" @select="selectChannel(channel)"></channel-item>
          <q-separator :key="`sep-${i}`"/>
        </template>
      </q-list>
    </q-card>
    <div class="fill_size" v-else style="display: flex; flex-direction: column; overflow-y: scroll">
      <channel :channel="activeChannel"></channel>
    </div>

    <q-dialog v-model="addDialog" @close="podFilter = null">
      <q-card style="width: 400px; max-width: 100vw" class="q-pa-md">
        <q-btn size="sm" dense flat class="t-r-f bg-dark text-light" icon="mdi-close" @click="addDialog = false"/>
        <q-card class="q-pa-md">
          <div class="text-xs text-mb-sm text-weight-medium">Add Channel</div>
          <div class="row justify-center">
            <div class="col-12 q-gutter-lg">
              <pod-picker named-query="withMembers" label="Add Channel in Pod" v-model="podFilter"></pod-picker>
              <template v-if="podFilter">
                <channel-form :pod-in="podFilter" @input="addDialog = false"></channel-form>
              </template>
            </div>
          </div>
        </q-card>
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import ChannelItem from 'components/common/atoms/messaging/Channeltem';
  import Channel from 'components/common/atoms/messaging/Channel';
  import PodPicker from 'components/pods/forms/PodPicker';
  import ChannelForm from 'components/channels/ChannelForm';

  export default {
    name: 'Chat',
    components: { ChannelForm, PodPicker, Channel, ChannelItem },
    async mounted() {
      if (!this.stateChannels || !this.stateChannels.length) {
        await this.loadChannels({
          query: {
            _id: { $in: this.lget(this.user, 'channels', []) }
          },
          $populateParams: { name: 'withPod' }
        });
      }
    },
    data() {
      return {
        addDialog: false,
        activeChannel: null,
        podFilter: null
      };
    },
    watch: {

    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters('bw-channels', { findChannels: 'find' }),
      ...mapGetters('bw-messages', { findMessages: 'find' }),
      ...mapGetters('bw-pods', { findPods: 'find' }),
      stateChannels() {
        let query = {
          $sort: { updatedAt: -1 },
          // _id: { $in: this.lget(this.user, 'channels', []) }
          channelUsers: { $in: [this.user._id] }
        };
        if (this.podFilter) {
          query.pod = this.podFilter._id;
        }
        return this.findChannels({
          query: query
        }).data.map(a => a.clone());
      }
    },
    methods: {
      ...mapActions('bw-channels', { loadChannels: 'find' }),
      selectChannel(channel) {
        this.activeChannel = channel;
      }
    }
  };
</script>

<style scoped lang="scss">
  .__chat_window {
    width: 500px;
    max-width: 100vw;
    height: 100%;
    max-height: 100vh;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: auto auto 1fr;
  }
</style>
