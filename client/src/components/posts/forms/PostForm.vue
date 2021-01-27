<template>
  <q-card flat class="q-pa-sm bg-transparent" style="border-radius: 10px">
    <q-btn v-if="posting" class="t-r" dense push size="xs" color="blue" icon="mdi-minus"
           @click="posting = false"></q-btn>
    <div class="col-12 q-gutter-md">
      <template v-if="posting">
        <q-card class="q-pa-md">
        <template v-if="lget(form, 'videos', []).length">
          <post-videos @remove="rmvVideo" :value="form" editing></post-videos>
        </template>
        <template v-if="lget(form, 'images', []).length">
          <post-images @remove="rmvImg" :value="form" editing></post-images>
        </template>
        <div class="q-px-sm">
        <q-input bg-color="white" label="Post Title" :input-class="`text-sm text-mb-md text-weight-${form.title ? 'medium' : 'light'}`"
                 v-model="form.title" placeholder="Add Title"></q-input>
        </div>
        <text-editor save-off div-class="" @img="imageDialog = true" @video="videoDialog = true" :editor="editor"
                     :placeholder="placeholder" send-icon="mdi-check" v-model="form.body"
                     @save="savePost"></text-editor>
        <div class="row justify-end">
          <q-btn size="sm" push color="primary" label="post" icon="mdi-check" @click="savePost"></q-btn>
        </div>
        </q-card>
      </template>
      <template v-else>
        <q-input bg-color="white" v-model="form.title" @click="posting = true" placeholder="Post something..." @focus="posting = true"
                 input-class="text-sm text-mb-md text-weight-light" outlined rounded>
          <template v-slot:prepend>
            <q-icon color="blue" name="mdi-thought-bubble"></q-icon>
          </template>
        </q-input>
      </template>
    </div>

    <q-dialog v-model="videoDialog" :maximized="$q.screen.lt.sm" transition-hide="slide-down" transition-show="slide-up">
      <q-card style="width: 600px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="videoDialog = false"/>
        <choose-or-upload :require-save="false" prefer-link emit-value :cols="12" :sm="12" :md="12" :lg="12" :xl="12" v-model="form.videos"
                          multiple></choose-or-upload>
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
  import {models} from 'feathers-vuex';
  import TextEditor from 'components/common/atoms/messaging/textEditor';
  import MultiImageUpload from 'components/common/substance/images/MultiImageUpload';
  import ChooseOrUpload from 'components/common/video/ChooseOrUpload';
  import PostVideos from 'components/posts/cards/PostVideos';
  import PostImages from 'components/posts/cards/PostImages';

  export default {
    name: 'PostForm',
    components: { PostImages, PostVideos, ChooseOrUpload, MultiImageUpload, TextEditor },
    props: {
      startPosting: Boolean,
      podIn: Object,
      postIn: Object,
      placeholder: {
        type: String,
        default: 'Pour your heart out...'
      }
    },
    mounted(){
      if(this.startPosting) this.posting = true;
      if(this.postIn) this.form = new models.api.BwPosts(this.postIn).clone();
    },
    data() {
      return {
        form: new models.api.BwPosts().clone(),
        posting: false,
        imageDialog: false,
        videoDialog: false,
      };
    },
    computed: {
      editor() {
        return {
          toolbar: [
            [
              {
                label: this.$q.lang.editor.align,
                icon: this.$q.iconSet.editor.align,
                fixedLabel: true,
                list: 'only-icons',
                options: ['left', 'center', 'right', 'justify']
              },
            ],
            [
              {
                label: 'Style',
                list: 'only-icons',
                fixedLabel: true,
                options: ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript', 'removeFormat'],
              }
            ],
            [
              {
                icon: this.$q.iconSet.uploader.upload,
                fixedIcon: true,
                list: 'no-icons',
                options: ['insert_img', 'insert_video_url']
              }
            ],
            [
              {
                label: this.$q.lang.editor.formatting,
                icon: this.$q.iconSet.editor.formatting,
                list: 'no-icons',
                options: [
                  'p',
                  'h1',
                  'h2',
                  'h3',
                  'h4',
                  'h5',
                  'h6',
                  'code'
                ]
              },
              {
                label: this.$q.lang.editor.fontSize,
                icon: this.$q.iconSet.editor.fontSize,
                fixedLabel: true,
                fixedIcon: true,
                list: 'no-icons',
                options: [
                  'size-1',
                  'size-2',
                  'size-3',
                  'size-4',
                  'size-5',
                  'size-6',
                  'size-7'
                ]
              },
            ],

            [
              {
                icon: this.$q.iconSet.editor.unorderedList,
                list: 'no-icons',
                options: [
                  'quote',
                  'unordered',
                  'ordered',
                  'outdent',
                  'indent'
                ]
              },
            ],
          ],
          fonts: {
            arial: 'Arial',
            arial_black: 'Arial Black',
            comic_sans: 'Comic Sans MS',
            courier_new: 'Courier New',
            impact: 'Impact',
            lucida_grande: 'Lucida Grande',
            times_new_roman: 'Times New Roman',
            verdana: 'Verdana'
          },
          definitions: {
            insert_video_url: {
              label: 'Video',
              tip: 'Insert Video',
              icon: 'video_call',
              handler: () => {
                this.videoDialog = true;
              }
            },
            insert_img: {
              label: 'Image',
              tip: 'Insert Image',
              icon: 'insert_photo',
              handler: () => {
                this.imageDialog = true;
              } // this.insertImg // handler will call insertImg() method
            },
          }
        };
      }
    },
    methods: {
      rmvVideo(i){
        this.form.videos.splice(i, 1);
      },
      rmvImg(i){
        this.form.images.splice(i, 1);
      },
      setImages(val){
        this.form.images = val;
      },
      savePost() {
        console.log('save post', this.form);
        if(!this.form.pod) this.form.pod = this.podIn._id;
        if (this.form.body || this.form.title || ((this.form.images && this.form.images.length) || (this.form.videos && this.form.videos.length))) {
          console.log('saving post', this.form);
          this.form.save({
            $populateParams: { name: 'withVideos' }
          })
            .then(res => {
              this.$emit('input', res.clone());
              console.log('got one', res);
              // this.form = new models.api.BwPosts().clone();
              this.posting = false;
            }).catch(err => this.$errNotify(err.message));
        } else {
          this.$infoNotify('You didn\'t post anything');
        }
      }
    }
  };
</script>
