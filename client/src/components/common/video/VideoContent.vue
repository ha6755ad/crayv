<template>
  <q-card class="pointer" flat style="width: 100%">


    <template v-for="(vid, idx) in videoList">
      <div style="width: 100%; position: relative" :key="`vid-${idx}`" v-if="vidIndex === idx">
        <q-btn v-if="editing" class="t-l" dense flat icon="mdi-close" color="red" @click="$emit('rmv', idx)"/>
        <!--        <q-media v-if="vidIndex === idx" :vid-in="vid" :size="280"></q-media>-->
        <video-card :vid-in="vid" :id="`${idIn}-${idx}`" :no-label="!showLabel"></video-card>
        <q-btn size="sm" v-if="videoList.length > 1" color="light" flat round class="__vid_btn __right" @click.stop="vidIndex < videoList.length - 1 ? vidIndex++ : vidIndex = 0">
          <q-icon size="18px" name="mdi-chevron-right"/>
        </q-btn>
        <q-btn size="sm" v-if="videoList.length > 1" color="light" flat round  class="__vid_btn __left" @click.stop="vidIndex > 0 ? vidIndex-- : vidIndex = videoList.length - 1">
          <q-icon size="18px" name="mdi-chevron-left"/>
        </q-btn>
      </div>
    </template>

    <q-dialog :maximized="true" transition-show="slide-up" transition-hide="slide-down" v-model="fullScreen">
      <q-btn dense size="sm" flat icon="mdi-close" class="bg-dark text-light t-r-f" @click="fullScreen = false"/>
      <video-viewer :videos-in="videosIn"/>
    </q-dialog>

  </q-card>
</template>

<script>
  import {models} from 'feathers-vuex';
  import VideoCard from '../video/VideoCard';
  import {mapGetters, mapState} from 'vuex';
  import VideoViewer from './VideoViewer';

  export default {
    name: 'VideoContent',
    components: {
      VideoViewer,
      VideoCard
    },
    props: {
      showLabel: Boolean,
      idIn: {
        type: String,
        default: 'video_content'
      },
      videosIn: Array,
      editing: Boolean,
    },
    data() {
      return {
        fullScreen: false,
        editDialog: false,
        videoDialog: false,
        vidIndex: 0,
      };
    },
    computed: {
      ...mapState('auth', { user: 'user' }),
      ...mapGetters('content', { findContent: 'find' }),
      videoList(){
        return this.videosIn;
      },
      canEdit(){
        return this.vidIn.creator === this.lget(this.user, '_id') || this.isWhitelist(this.lget(this.user, 'email'));
      }
    },
    methods: {
      async editContent(content) {
        this.form = new models.api.Content(content).clone();
        await this.form.save()
          .then(res => {
            console.log('VideoContent >> content updated', res);
            this.$q.notify({ message: 'Updated Content', icon: 'mdi-check', color: 'success' });
          }).catch(err => {
            this.$errNotify(err.message);
          });
      },
      removeContent(content){
        this.$q.dialog({
          cancel: true,
          title: `Delete ${content.name}?`,
          message: 'This will remove this content from all communities'
        }).onOk(() => {
          this.$store.dispatch('content/remove', content._id);
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  .__add_vid {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .__vid_btn {
    position: absolute;
    top: 50%;
    background: rgba(255,255,255,.3);
    transform: translateY(-50%);
  }

  .__right {
    right: 2px
  }

  .__left {
    left: 2px
  }
</style>
