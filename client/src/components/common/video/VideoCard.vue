<template>
  <div :id="id" class="bg-transparent __video_card pointer" @click="$emit('input')" :style="{ gridTemplateRows: rows }">
    <q-card class="bg-black glossy __video_container"
            :style="{ minWidth: '250px', height: vidHeight, width: width, maxWidth: '100%' }">

      <div class="t-r-a q-pa-xs" style="z-index: 10; display: flex; background: transparent">
        <q-btn size="sm" dense flat icon="mdi-pencil-box" @click="editDialog = true" class="bg-dark text-light q-mx-xs"
               v-if="canEdit"/>
        <q-btn size="sm" dense flat icon="mdi-delete" class="bg-dark text-light q-mx-xs" @click="rmvVideo"
               v-if="canEdit"/>
        <q-btn size="sm" dense flat icon="mdi-arrow-expand" class="bg-dark text-light q-mx-xs"
               @click="fullScreen = true"/>
      </div>
      <!--      <template v-if="vidIn.host.toLowerCase() === 'vimeo'">-->
      <!--        <VimeoPlayer-->
      <!--          idIn="player_in_podcast"-->
      <!--          :videoURL="vidIn.embed">-->
      <!--        </VimeoPlayer>-->
      <!--      </template>-->
      <template v-if="sized">
        <iframe
          :id="vidIn._id"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: inherit"
          :src="vidIn.embed + '?muted=0&autoplay=1&loop=1&autopause=0'"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </template>
      <template v-else>
        <div class="fill_size flex flex-center">
          <q-skeleton :height="height" square />
        </div>
      </template>
    </q-card>
    <div class="q-pa-sm" v-if="!noLabel">
      <div class="row">
        <default-avatar size="40px" :value="lget(vidIn, '_fastjoin.creator')">
        </default-avatar>
        <div class="col q-ml-sm">
          <div class="text-weight-medium text-1-3 text-left" style="white-space: nowrap; text-overflow: ellipsis">
            {{ vidIn.name }}
          </div>
          <div class="text-weight-light text-1 text-left" style="white-space: nowrap; text-overflow: ellipsis">
            {{ vidIn.author }}
          </div>
          <div class="text-weight-light text-grey-8 text-0-8 text-left">{{ createdDate }}</div>
        </div>
      </div>

      <!--    <slot name="content-overlay"></slot>-->
    </div>

    <q-dialog :maximized="true" transition-show="slide-up" transition-hide="slide-down" v-model="fullScreen">
      <q-card flat class="bg-transparent">
        <q-btn dense size="sm" flat icon="mdi-close" class="bg-dark text-light t-r-f" @click="fullScreen = false"/>
        <video-viewer :videos-in="[vidIn]"/>
      </q-card>
    </q-dialog>


    <q-dialog :maximized="$q.screen.lt.sm" v-model="editDialog">
      <q-card style="width: 600px; max-width: 100vw">
        <video-form :vid-in="vidIn"></video-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
// import VimeoPlayer from './Vimeo/VimeoPlayer';
  import {mapGetters} from 'vuex';
  import VideoForm from './VideoForm';
  import VideoViewer from 'components/common/video/VideoViewer';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';

  export default {
    name: 'VideoCard',
    components: { DefaultAvatar, VideoViewer, VideoForm },
    // components: {VimeoPlayer},
    props: {
      vidIn: Object,
      id: {
        type: String,
        default: 'videoCard'
      },
      noLabel: Boolean
    },
    mounted() {
      this.getWide();
      window.addEventListener('resize', () => this.getWide());
    },
    data() {
      return {
        sized: false,
        fullScreen: false,
        editDialog: false,
        wide: 400
      };
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      canEdit() {
        return this.vidIn.creator === this.lget(this.user, '_id') || this.isWhitelist(this.lget(this.user, 'email'));
      },
      createdDate() {
        return this.getDateFormat(this.vidIn.createdAt, 'MMM-DD YYYY');
      },
      rows(){
        return this.noLabel ? 'auto' : 'auto 80px';
      },
      height() {
        if (this.$attrs.height) {
          return this.$attrs.height;
        } else return this.vidHeight;
      },
      vidHeight() {
        return parseInt(this.width) * .57 + 'px';
      },
      width() {
        return this.$attrs.width ? this.$attrs.width : parseInt(this.wide) + 'px';
      },
    },
    methods: {
      rmvVideo() {
        let payload = this.vidIn;
        this.$q.dialog({
          cancel: true,
          title: 'Remove Video',
          message: 'Are you sure you want to remove this video?'
        }).onOk(async () => {
          await this.$store.dispatch('fv-video-uploads/remove', payload._id)
            .then(res => {
              console.log('rmv video', res);
              this.$q.notify({
                color: 'info',
                message: 'Video removed'
              }).catch(err => this.$errNotify(err.message));
            });
        });
      },
      getWide() {
        let el = document.getElementById(this.id);
        if (el) {
          this.sized = true;
          this.wide = Math.max(el.getBoundingClientRect().width, 250);
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .__video_card {
    max-width: 98vw;
    max-height: 78vw;
    width: 100%;
    display: grid;
    grid-template-columns: 100%;
    position: relative;
    grid-template-rows: auto 80px;

    .__video_container {
      max-width: 95vw;
    }
  }
</style>
