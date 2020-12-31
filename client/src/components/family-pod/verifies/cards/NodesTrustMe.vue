<template>
  <div class="fill_size">
    <div class="q-pa-md">
    <div class="text-xs text-mb-sm text-weight-medium">People who trust you to verify them</div>
      <q-separator class="q-my-sm"/>
      <div class="text-xxs text-mb-xs text-weight-light">If you don't want to be this person's trusted verifier, remove yourself.</div>
    <div class="q-pa-xl text-xs text-mb-sm text-italic text-weight-light" v-if="!verifyContacts || !verifyContacts.length">
      No one here yet
    </div>
    </div>
    <div class="q-my-md row no-wrap"  style="width: 100%; overflow-x: scroll">
    <q-card style="min-width: 220px; height: 180px" class="q-ma-xs" v-for="(contact, i) in verifyContacts" :key="`contact-${i}`">
      <q-btn dense flat icon="mdi-close" color="red" @click="removeNode(contact)" class="t-r" size="sm"/>
      <detail-card  chat-off :value="contact"/>
    </q-card>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import DetailCard from 'components/common/atoms/users/DetailCard';

  export default {
    name: 'NodesTrustMe',
    components: { DetailCard },
    watch: {
      user: {
        immediate: true,
        handler(newVal){
          if(newVal && newVal._id){
            this.$store.dispatch('users/find', {
              query: {
                verifiers: { $in: [newVal._id]}
              }
            });
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters('users', { findUsers: 'find'}),
      verifyContacts(){
        return this.findUsers({
          query: {
            verifiers: { $in: [this.lget(this.user, '_id')]}
          }
        }).data.map(a => a.clone());
      }
    },
    methods: {
      removeNode(node){
        let verifiers = node.verifiers.map(a => JSON.stringify(a));
        let idx = verifiers.indexOf(JSON.stringify(this.user._id));
        if(idx > -1){
          verifiers.splice(idx, 1);
          this.$store.dispatch('users/patch', [node._id, {verifiers: verifiers}])
            .then(() => {
              this.$successNotify('Removed you from verifiers');
            });
        }
      }
    }
  };
</script>
