<template>
  <div id="vimPlay" class="vimeoPlayer">
    <!--    <iframe :src="vidUrl" :style="{width: width, height: height}" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>-->
  </div>
</template>


<script>
  import Player from '@vimeo/player';

  export default {
    name: 'VimeoPlayer',
    props: {
      fileIn: String,
      videoURL: {
        type: String,
      // default: 'https://vimeo.com/396850478'
      },
      idIn: String,
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '100%'
      }
    },
    data() {
      return {
        // link: 'https://vimeo.com/397690590',
        player: null,
        vidWidth: 500,
        vidHeight: 300
      };
    },
    watch: {
      vidId: {
        immediate: true,
        handler(newVal) {
          if (newVal && newVal !== '')
            this.install();
        }
      }
    },
    computed: {
      vidId() {
        let splits = this.videoURL ? this.videoURL.split('/') : '';
        let id = splits ? splits[splits.length - 1] : '';
        return id;
      },
      vidUrl() {
        return 'https://player.vimeo.com/video/' + this.vidId;
      },
    },
    methods: {
      install() {
        this.player = new Player(this.$el, {
          id: this.vidId,
          height: this.vidHeight
        })
          .on('ended', function () {
            console.log('video ended!');
          });
      }
    },
    mounted() {
      this.vidWidth = document.getElementById('vimPlay').clientWidth;
      this.vidHeight = document.getElementById('vimPlay').clientHeight;
    },
  };
</script>


<style scoped>
  .vimeoPlayer {
    height: 100%;
    background-color: black;
  }
</style>
