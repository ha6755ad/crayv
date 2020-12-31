<template>
  <div id="messaging" class="q-pa-md row justify-center">
    <div v-if="messageList" class="scroll-up" style="width: 100%;">
      <div v-for="(message, i) in messages" :id="`message${i}`" :key="message._id">
        <q-chat-message
          :name="`${lget(message, '_fastjoin.sender.name', lget(message, '_fastjoin.sender.username'))}`"
          :stamp="formatDatTime(message.createdAt)"
          :sent="message.sender === $store.getters['auth/user']._id"
          size="10"
          label-sanitize
          name-sanitize
          stamp-sanitize
          text-color="white"
          :bg-color="`${message.sender === $store.getters['auth/user']._id ? 'purple' : 'grey-9'}`"
        >
          <div v-html="sanitize(message.message)"></div>
          <template v-slot:avatar>
            <default-avatar :value="lget(message, '_fastjoin.sender')"></default-avatar>
          </template>
        </q-chat-message>
      </div>
    </div>
    <template v-else-if="!messageList">
      <div class="flex flex-center q-pa-md">
        <div class="row justify-center">
          <q-spinner-grid color="accent" size="50px"/>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
//TODO: We need to add in the <q-spinner-dots size="2rem"  show up above when someone is typing
  import {mapActions} from 'vuex';
  import {date} from 'quasar';
  import DefaultAvatar from '../avatars/DefaultAvatar';


  export default {
    name: 'Messaging',
    components: { DefaultAvatar },
    props: {
      messageList: {
        type: Array
      },
    },
    data() {
      return {
        stars: 4,
        senderStyle: 'q-message-avatar q-message-avatar--sent',
        receiverStyle: 'q-message-avatar q-message-avatar--received',
        senderBtnStyle: 'float: right;',
        receiverBtnStyle: '',
      };
    },
    watch: {
      messages: {
        immediate: true,
        handler(newVal, oldVal){
          let newLength = newVal ? newVal.length : 0;
          let oldLength = oldVal ? oldVal.length : 0;
          if(newLength && newLength !== oldLength){
            newVal.forEach(message => {
              let seenBy = this.lget(message, 'seenBy', []);
              if(!seenBy.includes(this.user._id)) {
                let id = this.lget(message, '_id');
                this.$store.dispatch('bw-messages/patch', [id, {
                  $addToSet: { seenBy: this.user._id }
                }]);
              }
            });
          }
        }
      }
    },
    computed: {
      messages() {
        let newList = this.messageList;
        return newList ? newList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
      },
    },
    methods: {
      ...mapActions('auth', {
        authenticate: 'authenticate'
      }), formatDatTime(val) {
        const now = Date.now();
        const datetime = date.extractDate(val, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
        let hours = date.getDateDiff(now, datetime, 'hours');
        let min = date.getDateDiff(now, datetime, 'minutes');
        let days = date.getDateDiff(now, datetime, 'days');
        let months = date.getDateDiff(now, datetime, 'months');
        if (min < 60) {
          return '' + min + ' minutes ago';
        } else if (min < 60 * 24) {
          return '' + hours + ' hours ago';
        } else if (min < 60 * 24 * 30) {
          return '' + days + ' days ago';
        } else if (min < 60 * 24 * 365) {
          return '' + months + ' months ago';
        } else {
          return `${datetime}`;
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  #messaging {
    width: 100%;
    height: 100%;
    min-height: 200px;

    .scroll-up {
      height: 100%;
      overflow: auto;
      display: flex;
      flex-direction: column-reverse;
    }
  }
</style>
