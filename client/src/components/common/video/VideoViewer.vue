<template>
  <q-card :id="id" class="bg-black" flat :style="{ height: wide * .57 + 'px', width: '100%', transition: 'all .3s ease-out' }">
    <q-resize-observer @resize="getWide()"/>
    <!--    <div class="__slide" :style="slideOn ? { width: '100%' } : { width: 0 }"></div>-->
    <template v-if="videosIn.length > 1">
      <q-btn class="__slide_btn left" flat round size="lg" icon="mdi-chevron-left" color="white" @click="tabLeft"/>
      <q-btn class="__slide_btn right" flat round size="lg" icon="mdi-chevron-right" color="white" @click="tabRight"/>
    </template>
    <template v-for="(vid, i) in videosIn">
      <div :style="vidContainer" :key="`vid-${i}`" v-if="tab === i">
        <iframe
          :id="vid._id"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          :src="vid.embed + '?muted=0&autoplay=1&loop=1&autopause=0'"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    </template>
  </q-card>
</template>

<script>
  export default {
    name: 'VideoViewer',
    props: {
      id: {
        type: String,
        default: 'videoviewer'
      },
      videosIn: Array
    },
    mounted(){
      this.getWide();
      window.addEventListener('resize', () => this.getWide());
    },
    data() {
      return {
        opacity: 1,
        tab: 0,
        wide: 800
      };
    },
    computed: {
      vidContainer() {
        return {
          height: '100%',
          width: '100%',
          zIndex: 1,
          opacity: this.opacity,
          transition: 'opacity .25s ease-out'
        };
      }
    },
    methods: {
      getWide(){
        let el = document.getElementById(this.id);
        this.wide = el.clientWidth;
      },
      tabLeft() {
        this.opacity = 0;
        setTimeout(() => {
          this.tab > 0 ? this.tab-- : this.tab = this.videosIn.length - 1;
          this.opacity = 1;
        }, 250);
      },
      tabRight() {
        this.opacity = 0;
        setTimeout(() => {
          this.opacity = 1;
          this.tab < this.videosIn.length - 1 ? this.tab++ : this.tab = 0;
        }, 250);
      }
    }
  };
</script>

<style scoped lang="scss">
  .__slide {
    background: linear-gradient(16deg, $dark 75%, $primary);
    z-index: 3;
    position: absolute;
    top: 0;
    height: 100%;
    transition: all .2s linear;
  }

  .__slide_btn {
    position: absolute;
    z-index: 2;
    top: 50%;
    transform: translate(0, -50%);
  }

  .left {
    left: 2%;
  }

  .right {
    right: 2%;
  }
</style>
