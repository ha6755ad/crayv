<template>
  <div class="bg-background" style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; padding-bottom: 40px">
    <div class="q-pa-none bg-background" style="overflow: auto">
      <div class="row jusity-center q-my-sm" v-if="messageList && messageList.length > limit - 1">
        <q-chip color="primary" icon="mdi-plus" label="load more" clickable @click="$emit('more')"/>
      </div>
      <Messaging :pagesIn="pagesIn" @page="pageUp" :messageList="messageList" ></Messaging>
    </div>
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
  import Messaging from './Messaging.vue';
  import TextEditor from './textEditor';

  const defaultEditedMessage = () => {
    return {
      Input: '',
    };
  };

  export default {
    name: 'MessagingCard',
    components: {Messaging, TextEditor},
    props: {
      limit: {
        type: Number,
        default: 25
      },
      pagesIn: Number,
      pageIn: Number,
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
      pageUp(){
        this.$emit('page', this.pageIn + 1);
      },
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
