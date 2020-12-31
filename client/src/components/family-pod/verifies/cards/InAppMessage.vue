<template>
  <q-item>
    <q-item-section avatar>
      <default-avatar :value="sent_from"/>
    </q-item-section>
    <q-item-section>
      <link-card :id="String(lget(messageIn, '_id', 'message-link'))" text-color="dark" sub-title="You'll need to text or email it to them" :title="`${lget(sent_from, 'name', lget(sent_from, 'username'))} is requesting a reset password link.`" :url="'You are receiving this password reset link to reset your password. You\'ll need to reset using a device and browser you have used on Legacy before. If you cannot do this, you\'ll need to reset via email instead. Here\'s your reset link ' + messageIn.body + `&check=${fromId}`"/>
      <div class="row">
        <a v-if="lget(sent_from, 'phone.number.e164')" :href="`sms: ${lget(sent_from, 'phone.number.e164')}`" style="text-decoration: none">
          <q-btn class="q-mx-xs" dense color="blue" flat size="sm" label="text" icon="mdi-cellphone-message"/>
        </a>
        <a v-if="isEmailRule(lget(sent_from, 'email'))" :href="`mailto:${lget(sent_from, 'email')}`" style="text-decoration: none">
          <q-btn class="q-mx-xs" dense color="accent" flat size="sm" label="email" icon="mdi-email"/>
        </a>
      </div>
    </q-item-section>
    <q-item-section side>
      <q-btn color="negative" size="sm" dense flat icon="mdi-delete" @click="deleteMessage"/>
    </q-item-section>
  </q-item>
</template>


<script>
  import { mapGetters } from 'vuex';
  import LinkCard from 'components/common/atoms/LinkCard';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  export default {
    name: 'InAppMessage',
    components: { DefaultAvatar, LinkCard },
    props: {
      messageIn: Object
    },
    watch: {
      fromId: {
        immediate: true,
        handler(newVal){
          if(newVal){
            this.$store.dispatch('users/get', newVal);
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', {user: 'user'}),
      ...mapGetters('users', {getUser: 'get'}),
      fromId(){
        return this.lget(this.messageIn, 'from');
      },
      toId(){
        return this.lget(this.messageIn, 'to');
      },
      sent_from(){
        return this.getUser(this.fromId);
      },
      sent_to(){
        return this.getUser(this.toId);
      }
    },
    methods: {
      deleteMessage(){
        this.$store.dispatch('in-app-messages/remove', this.messageIn._id);
      }
    }
  };
</script>
