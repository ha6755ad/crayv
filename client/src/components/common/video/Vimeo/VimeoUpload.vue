<template>
  <div style="height: 100%; width: 100%; display: flex; align-items: center; justify-content: center">
    <template v-if="uri && uri !== ''">
      <!--      <v-text-field-->
      <!--        outlined rounded-->
      <!--        :value="uri"-->
      <!--        label="Video URL"-->
      <!--        append-icon="mdi-close"-->
      <!--        @click:append="clearUri"-->
      <!--      ></v-text-field>-->
      <div style="min-height: 100px; height: 100%; width: 100%; display: grid; align-items: center; justify-items: center">
        <template v-if="finished === 'processing'">
          <q-linear-progress
            stripe
            indeterminate
            color="primary"
          ></q-linear-progress>
          <br>
          <div class="text-center text-xs text-mb-sm">Preparing video for viewing<br>
            <span class="text-xxs text-mb-xs text-weight-light">You can continue working, it can take a few minutes</span>
          </div>
        </template>
        <q-btn outlined @click="clearUri" color="secondary">
          <q-icon left name="mdi-delete"/>
          {{finished}}&nbsp;- clear video
        </q-btn>
        <div style="display: flex;  justify-content: center; width: 100%; overflow-x: scroll">
          <q-card flat color="transparent" class="q-pa-sm">
            <div class="row text-xxs text-mb-xxs text-weight-light">Thumbnail</div>
            <q-img v-for="(thumb, idx) in form.thumbnails" :key="`thumb-${idx}`" :src="thumb.url" :style="{ height: '200px', width: 200/.5625 + 'px' }"></q-img>
          </q-card>
        </div>
      </div>
    </template>
    <template v-else>
      <q-card flat>
        <DragUpload :upload-file="false" v-model="filePath" @input="uploadVideo"
                    v-if="!filePath || typeof filePath === 'undefined' || !filePath.length"></DragUpload>
        <!--    <p>{{bytes_uploaded + ' ' + bytes_total}}</p>-->
        <div class="text-center" v-if="filePath && filePath.length && percentage < 100">
          <q-circular-progress
            size="100px"
            show-value
            :thickness=".25"
            font-size="14px"
            :value="Number(percentage)"
            color="secondary">
            {{percentage + '%'}}
          </q-circular-progress>
        </div>
      </q-card>
    </template>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';
  import {models} from 'feathers-vuex';
  import DragUpload from '../../uploads/DragUpload';

  const Vimeo = require('vimeo').Vimeo;
  const client = new Vimeo('fcab04874723d01838bf6fa9a6644a9d4b11b337', 'zHXkLdWmGFy6otDMAtQI2LbqkGFVCpdrrOCVlqVHt4vprmL8fahnCVQmORlNC9Sfy4MRrfZMcOqTCXV8adQOiBw7dqMGfZ+PCzQAOz2yVr77oRSXlEW9Nh+Nj5IMzotM', 'bd32f840c3c63352623d4dfd67c86e3b');

  export default {
    name: 'VimeoUpload',
    components: { DragUpload },
    props: {
      value: Object,
      nameIn: String,
      descriptionIn: String,
      contentIn: Object
    },
    data() {
      return {
        thumbIndex: 0,
        form: new models.api.FvVideoUploads().clone(),
        newUpload: false,
        finished: 'ready',
        // videoID: 'some-id',
        filePath: [],
        height: 500,
        uri: '',
        uriRef: '',
        bytes_total: 0,
        bytes_uploaded: 0,
        options: {},
        playerReady: false,
        thumbnails: [],
        baseURL: 'https://vimeo.com'
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal, oldVal){
          if(newVal && JSON.stringify(newVal) !== JSON.stringify(oldVal)){
            this.form = new models.api.FvVideoUploads(newVal).clone();
          }
        }
      }
    },
    computed: {
      name() {
        return this.nameIn && this.nameIn !== '' ? this.nameIn : 'Untitled';
      },
      description() {
        return this.descriptionIn && this.descriptionIn !== '' ? this.nameIn : 'Description goes here';
      },
      // videoID() {
      //   let string = this.value;
      //   let pieces = string.split('/');
      //   return pieces[pieces.length - 1];
      // },
      percentage() {
        return ((this.bytes_uploaded / this.bytes_total) * 100).toFixed(2);
      }
    },
    methods: {
      ...mapActions('fv-video-uploads', { createVideo: 'create', getVideo: 'get' }),
      getThumbs(id) {
        let self = this;
        client.request({
                         //eslint-disable-next-line-vue/script-indent
                         method: 'GET',
                         path: `/videos/${id}/pictures`,
                       },
                       function (error, body) {
                         //eslint-disable-next-line-no-console
                         console.log('error in getting thumbs', error, 'body', body);
                         if (error) {
                           console.error(error);
                           throw new Error(error);
                         }
                         if (body) {
                           self.form.thumbnails = body.data;
                           // if (self.newUpload) self.$emit('thumb', body.data[0].sizes[3].link);
                         }
                       });
      },
      async saveVideoUpload() {
        console.log('saving upload', this.form);
        this.form.creator = this.user._id;
        await this.form.save()
          .then(res => {
            console.log('save res', res);
            this.$emit('input', res);
            this.$q.notify({
              message: 'Upload Completed',
              caption: 'Keep it moving and we\'ll get your video ready to display',
              color: 'dark',
              textColor: 'light'
            });
          }).catch(err => this.$errNotify(err.message));
      },
      getProgress(uploaded, total) {
        this.bytes_uploaded = uploaded;
        this.bytes_total = total;
        if ((uploaded / total) > .99) {
          this.finished = 'processing';
        }
      },
      async uploadVideo() {
        console.log('uploading video');
        //eslint-disable-next-line-no-console
        console.log('uploading', this.filePath[0]);
        let file_path = this.filePath[0];
        let self = this;
        client.upload(
          file_path,
          {
            'name': this.name,
            'description': this.description
          },
          function (path) {
            if (path) {
              //eslint-disable-next-line-no-console
              console.log('Your video URI is: ' + path);
              self.form.uriRef = path;
              let splits = path.split('/');
              let id = parseInt(splits[splits.length - 1]);
              let link = 'https://player.vimeo.com/video/' + id;
              self.form.embed = link;
              self.getThumbs(id);
              console.log('getting uri', link);
              self.form.uri = link;
              self.form.status = 'processing';
              self.saveVideoUpload();
            }
          },
          function (bytes_uploaded, bytes_total) {
            self.getProgress(parseFloat(bytes_uploaded), parseFloat(bytes_total));
            console.log('getting progress', bytes_uploaded, bytes_total);
          },
          function (error) {
            //eslint-disable-next-line-no-console
            console.log('Failed because: ' + error);
            return error;
          }
        );
      },
      vimURL(string) {
        //eslint-disable-next-line-no-console
        console.log('vimURL', this.baseURL + string);
        return this.baseURL + string;
      },
      clearUri() {
        this.uri = '';
        this.filePath = [];
        this.$emit('input', '');
      },
      onReady() {
        this.playerReady = true;
      },
      play() {
        this.$refs.player.play();
      },
      pause() {
        this.$refs.player.pause();
      }
    }
  };
</script>
