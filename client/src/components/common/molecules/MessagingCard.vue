<template>
  <div class="bg-background" style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: flex-end">
    <q-card-section class="q-pa-none bg-background" style="overflow: auto">
      <Messaging :messageList="messageList" ></Messaging>
    </q-card-section>
    <div style="width: 100%">
      <TextEditor v-bind.sync="MessageInput"
                  @save="sendMessage"
      >
      </TextEditor>

      <!--        <q-input standout="bg-secondary text-white"-->
<!--                 v-model="MessageInput.Input"-->
<!--                 @input="typingNotify"-->
<!--                 :hint="inputLabel"-->
<!--                 autogrow-->
<!--                 style="overflow: scroll;">-->
<!--          <template v-slot:append>-->
<!--            <q-btn @click="sendMessage" round dense flat icon="send"/>-->
<!--          </template>-->
<!--        </q-input>-->
    </div>
  </div>
</template>

<script>
  import Messaging from '../atoms/Messaging.vue';
  import TextEditor from '../atoms/messaging/textEditor.vue';

  const defaultEditedMessage = () => {
    return {
      Input: '',
    };
  };

  export default {
    name: 'MessagingCard',
    components: {Messaging, TextEditor},
    props: {
      messageList: {
        type: Array
      },
    },
    data() {
      return {
        MessageInput: defaultEditedMessage(),
      };
    },
    computed: {
    },
    watch: {
    },
    methods: {
      sendMessage() {
        if (this.MessageInput.Input) {
          this.$emit('sendingMessage', this.MessageInput.Input);
          this.MessageInput = defaultEditedMessage();
        }
      },
    },
  };
</script>

<style scoped lang="scss">
#messaging-card {
  .cardst {
    width: 100%;
  }
}

</style>
