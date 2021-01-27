<template>
  <q-card flat class="q-pa-sm">
    <div class="row q-my-md" v-if="form.videos && form.videos.length">
      <div style="width: 400px; max-width: 100%" >
        <post-videos @remove="rmvVideo" editing :value="form"></post-videos>
      </div>
    </div>
    <div class="row q-my-md" v-if="form.images && form.images.length">
      <div style="width: 400px; max-width: 100%">
        <post-images @remove="rmvImg" editing :value="form"></post-images>
      </div>
    </div>
    <emoji-input @keyup.enter="send" :input-attrs="{ style: 'width: 100%', autogrow: true, type: 'textarea', filled: true, label: label }" v-model="form.body">
      <template v-slot:prepend>
        <q-btn flat round :icon="prependIcon" @click="$emit('prepend')"></q-btn>
      </template>
      <template v-slot:append>
        <slot name="append"></slot>
      </template>
    </emoji-input>
    <div style="display: flex; justify-content: flex-end; width: 100%">
      <q-btn size="sm" dense flat icon="mdi-image" @click="imageDialog = true"></q-btn>
      <q-btn size="sm" dense flat icon="mdi-video-plus" @click="videoDialog = true"></q-btn>
    </div>

    <div class="row justify-end q-my-sm" v-if="form.body">
      <q-btn color="blue" size="sm" push label="post" icon="mdi-check" @click="send"></q-btn>
    </div>

      <q-dialog v-model="videoDialog" :maximized="$q.screen.lt.sm" transition-hide="slide-down" transition-show="slide-up">
        <q-card style="width: 600px; max-width: 100vw">
          <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="videoDialog = false"/>
          <choose-or-upload :require-save="false" prefer-link emit-value :cols="12" :sm="12" :md="12" :lg="12" :xl="12" v-model="form.videos" multiple></choose-or-upload>
        </q-card>
      </q-dialog>

      <q-dialog v-model="imageDialog">
        <q-card>
          <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="imageDialog = false"/>
          <q-card>
            <multi-image-upload @input="setImages" add-label="Add Images" v-model="form.images"></multi-image-upload>
          </q-card>
        </q-card>
      </q-dialog>
  </q-card>
</template>

<script>
  import { models } from 'feathers-vuex';
  import { mapGetters } from 'vuex';
  import ChooseOrUpload from 'components/common/video/ChooseOrUpload';
  import MultiImageUpload from 'components/common/substance/images/MultiImageUpload';
  import PostVideos from 'components/posts/cards/PostVideos';
  import PostImages from 'components/posts/cards/PostImages';
  import EmojiInput from 'components/common/atoms/messaging/EmojiInput';


  export default {
    name: 'CommentForm',
    components: { EmojiInput, PostImages, PostVideos, MultiImageUpload, ChooseOrUpload },
    props: {
      commentIn: Object,
      parentIn: Object,
      parentModel: String,
      service: String,
      prependIcon: {
        type: String,
        default: 'mdi-chat'
      },
      label: {
        type: String,
        default: 'Add Comment'
      }
    },
    mounted(){
      let form;
      if(this.commentIn) {
        form = new models.api.byServicePath[this.service](this.commentIn);
      } else {
        form = new models.api.byServicePath[this.service];
      }
      this.form = form.clone();
    },
    data(){
      return {
        form: { },
        imageDialog: false,
        videoDialog: false
      };
    },
    computed: {
      ...mapGetters('auth', {user: 'user'})
    },
    methods: {
      setImages(val){
        this.form.images = val;
      },
      rmvVideo(i){
        this.form.videos.splice(i, 1);
      },
      rmvImg(i){
        this.form.images.splice(i, 1);
      },
      send() {
        if (this.form.body || this.form.images.length || this.form.videos.length) {
          if(!this.form.parent) this.form.parent = this.parentIn._id;
          if(!this.form.parentModel) this.form.parentModel = this.parentModel;
          let params = {
            $populateParams: { name: 'withVideos' }
          };
          if (this.namedQuery) params.$populateParams = { name: this.namedQuery };
          this.form.save(params)
            .then(res => {
              console.log('commented', res);
              this.$successNotify('Thanks');
              this.$emit('input', res);
              let newForm = new models.api.byServicePath[this.service];
              newForm.clone ? this.form = newForm.clone() : this.form = {};
            })
            .catch(err => this.$errNotify(err.message));
        } else this.$infoNotify('You need some content there');
      }
    }
  };
</script>
