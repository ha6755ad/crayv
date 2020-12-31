<template>
  <q-card style="width: 100%" flat>
    <q-card-section>
      <div class="row items-center q-mb-md">
        <div class="text-xs text-mb-sm text-weight-light">{{form._id ? 'Edit' : 'Add'}} Video</div>
        <q-space/>
        <q-btn size="sm" flat color="primary" label="save" icon="mdi-video-plus" @click="saveVideo"/>
      </div>
      <q-separator/>
      <q-input dense label="Video Author" v-model="form.author"/>
      <q-input dense label="Video Title" v-model="form.name"/>
      <q-input dense label="Video Description" v-model="form.description"/>
      <div class="row q-mt-lg no-wrap">
        <q-btn size="sm" icon="mdi-cloud-upload" @click="tab = 0" label="upload video" :color="tab === 0 ? 'accent' : 'grey-6'" flat :style="{borderBottom: tab === 0 ? 'solid 2px var(--q-color-accent)' : 'none', transition: 'border .3s ease-out'}"/>
        <q-separator vertical class="q-mx-xs" color="accent"/>
        <q-btn size="sm" icon="mdi-link-plus" @click="tab = 1" label="add a link" :color="tab === 1 ? 'accent' : 'grey-6'" flat :style="{borderBottom: tab === 1 ? 'solid 2px var(--q-color-accent)' : 'none', transition: 'border .3s ease-out'}"/>
      </div>
      <q-tab-panels v-model="tab">
        <q-tab-panel :name="0">
          <div class="col-12 q-gutter-sm">
            <vimeo-upload :value="form" :nameIn="form.name" :description-in="form.description" @input="addVideoUpload" @thumb="form.img = $event" :contentIn="form"></vimeo-upload>
          </div>
        </q-tab-panel>
        <q-tab-panel :name="1">
          <host-picker :vid-in="form" @host="form.host = $event" :value="form.embed" @input="getVideo"></host-picker>
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
    <q-card-section>
      <div class="col-12">
        <div class="row justify-center">
        <q-card :style="{ height: '300px', maxHeight: wide * .7 + 'px', width: '100%', maxWidth: '600px'}" flat class="bg-dark glossy">
          <div style="z-index: 10" class="text-0-8 text-white t-r">Preview</div>
          <div class="embed-container" v-if="form.embed && form.embed !== ''">
            <template>
              <iframe
                style="position: absolute; top: 0; left: 0; width: 100%; height: 300px;"
                :src="vidEmbed"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </template>
          </div>
        </q-card>
        </div>
      </div>
    </q-card-section>
    <div class="row justify-end q-px-md">
      <q-btn size="sm" flat color="primary" label="save" icon="mdi-video-plus" @click="saveVideo"/>
    </div>
  </q-card>
</template>
<script>
  import { mapState } from 'vuex';
  import {models} from 'feathers-vuex';
  import VimeoUpload from './Vimeo/VimeoUpload';
  import HostPicker from './HostPicker';

  export default {
    name: 'VideoForm',
    components: { HostPicker, VimeoUpload },
    props: {
      vidIn: Object,
      preferLink: Boolean
    },
    mounted(){
      if(this.preferLink) this.tab = 1;
      this.setAuthor();
      this.getWide();
      window.addEventListener('resize', () => this.getWide());
    },
    data() {
      return {
        wide: 400,
        authorTry: 0,
        tab: 0,
        form: new models.api.FvVideoUploads().clone()
      };
    },
    watch: {
      vidIn: {
        immediate: true,
        handler(newVal){
          this.form = new models.api.FvVideoUploads(newVal).clone();
        }
      }
    },
    computed: {
      ...mapState('auth', {user: 'user'}),
      vidId() {
        if (this.form.embed) {
          let id;
          if (this.form.host.toLowerCase() === 'youtube') {
            id = /(?:embed\/|\?v=|\.be\/)(.{11})/gi.exec(this.form.embed)[1];
          } else if (this.form.host.toLowerCase() === 'vimeo') {
            id = /(?:video\/|\?v=|\.be\/)(.{11})/gi.exec(this.form.embed)[1];
          }
          return id;
        } else return '';
      },
      vidEmbed() {
        if (this.form.host.toLowerCase() === 'youtube') {
          return 'https://www.youtube.com/embed/' + this.vidId;
        } else if (this.form.host.toLowerCase() === 'vimeo') {
          return this.form.embed;
        } else return '';
      },
    },
    methods: {
      getWide(){
        this.wide = this.$el.clientWidth;
      },
      setAuthor(){
        if(this.user && !this.form.author) {
          this.form.author = this.user.name;
        } else {
          this.authorTry++;
          if(this.authorTry < 10){
            setTimeout(() => {
              this.setAuthor();
            }, 2000);
          }
        }
      },
      async getVideo(link) {
        if (link.indexOf('youtube.com') > -1) {
          let videoId = /(?:embed\/|\?v=|\.be\/)(.{11})/gi.exec(link)[1];
          await this.$store.dispatch('fv-youtube/get', videoId)
            .then(res => {
              const vidSnip = res;
              console.log('vid', vidSnip);
              this.form.embed = 'https://www.youtube.com/embed/' + videoId;
              let thumbs = [{ name: 'default', active: true, url: vidSnip.thumbnails.default.url }, {
                name: 'medium',
                url: vidSnip.thumbnails.medium.url
              }, { name: 'standard', url: vidSnip.thumbnails.default.standard }];
              this.$successNotify(`Successfully retrieved video from ${this.lget(this.vidIn, 'host', 'host')}`);
              this.form.thumbnails = thumbs;
              this.form.name ? '' : this.form.name = vidSnip.title;
            }).catch(err => {
              this.$errNotify('Error getting video ' + err.message);
            });
        } else {
          let split = link.split('/');
          let id = split[split.length - 1];
          this.form.embed = 'https://www.player.vimeo.com/video/' + id;
        }
      },
      addVideoUpload(val) {
        console.log('adding upload', val);
        this.form = new models.api.FvVideoUploads(val).clone();
      },
      async saveVideo() {
        console.log('saving video', this.form);
        this.form.creator = this.user._id;
        await this.form.save()
          .then(res => {
            this.$emit('input', res);
            console.log('saved video', res);
            this.$q.notify({
              message: 'Your video has been added',
              caption: 'you can now use it in any of your content',
              timeout: 6000,
              color: 'primary'
            });
          }).catch(err => this.$errNotify(err.message));
      }
    }
  };
</script>

<style scoped lang="scss">
  .embed-container {
      position: relative;
      /*padding-bottom: 56.25%;*/
      /*padding-right: 1rem;*/
      /*padding-left: 1rem;*/
      /*height: 0;*/
      /*overflow: hidden;*/
      /*max-width: 100%;*/
  }
</style>
