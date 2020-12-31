<template>
  <q-card flat>
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label class="text-xs text-mb-sm text-weight-medium">Notifications</q-item-label>
          <q-item-label caption class="text-xxs text-mb-xs text-weight-medium">People requesting help reseting their password</q-item-label>
        </q-item-section>
      </q-item>
      <q-card v-for="(message, i) in stateInAppMessages" :key="`message-${i}`">
        <in-app-message :message-in="message"/>
      </q-card>
    </q-list>
  </q-card>
</template>

<script>
  import { mapGetters } from 'vuex';
  import InAppMessage from 'components/family-pod/verifies/cards/InAppMessage';

  export default {
    name: 'InAppMessages',
    components: { InAppMessage  },
    mounted(){
      this.findResets();
    },
    computed: {
      ...mapGetters('auth', {user: 'user'}),
      ...mapGetters('in-app-messages', {findMessages: 'find'}),
      stateInAppMessages(){
        return this.findMessages({
          query: {
            to: { $in: [this.user._id] }
          }
        }).data.map(a => a.clone());
      }
    },
    methods: {
      findResets(){
        this.$store.dispatch('in-app-messages/find', {
          query: {
            $limit: 25,
            $sort: { createdAt: -1 },
            to: { $in: [this.user._id] }
          }
        }).then(res => {
          console.log('found in app messages', res);
        }).catch(err => {
          console.log('Error finding messages', err);
        });
      }

    }
  };
</script>
