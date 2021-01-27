<template>
  <div class="row justify-center q-my-md" v-if="lget(value, contentPath, []).length">
    <q-card flat style="width: 100%" class="q-pa-sm">
    <video-content :id-in="`post-${lget(value, '_id', 'na')}`" @rmv="rmvVideo" :editing="editing" :videos-in="videos"></video-content>
    </q-card>
  </div>
</template>

<script>
  import VideoContent from 'components/common/video/VideoContent';
  import {mapGetters} from 'vuex';
  export default {
    name: 'PostVideos',
    components: { VideoContent },
    props: {
      contentPath: {
        type: String,
        default: 'videos'
      },
      fullContentPath: {
        type: String,
        default: 'videoList'
      },
      editing: Boolean,
      value: Object
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal) {
          if (newVal && newVal._id && (!Object.keys(newVal).includes(this.fullContentPath) || this.lget(newVal, this.contentPath, []).length > this.lget(newVal, this.fullContentPath, []).length)) {
            console.log('loading post videos');
            this.$store.dispatch('fv-video-uploads/find', {
              query: {
                _id: { $in: this.lget(newVal, this.contentPath, []) }
              }
            });
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters('fv-video-uploads', {findVideos: 'find'}),
      postVideos() {
        return this.findVideos({
          query: { _id: { $in: this.lget(this.value, this.contentPath, []) } }
        }).data.map(a => a.clone());
      },
      videos() {
        return this.lget(this.value, this.fullContentPath, this.postVideos);
      },
    },
    methods: {
      rmvVideo(idx){
        this.$emit('remove', idx);
      }
    }
  };
</script>
