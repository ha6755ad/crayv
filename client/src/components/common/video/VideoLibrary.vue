<template>
  <div id="vid-library" :class="`row q-col-gutter-sm`" style="width: 100%">
    <div v-for="(file, i) in videosIn" :key="i"
         :class="`col-${col} col-sm-${sm} col-md-${md} col-lg-${lg} col-xl-${xl}`" @click="vidClick(file, i)">
      <q-card :dark="$attrs.dark" flat style="width: 100%"
      >
        <div class="row justify-center" style="width: 100%">
            <video-card :vid-in="file" :width="400"/>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
  import VideoCard from './VideoCard';
  import { mapGetters} from 'vuex';

  export default {
    name: 'VideoLibrary',
    components: { VideoCard },
    props: {
      videosIn: Array,
      col: { type: [Number, String], default: '12' },
      sm: { type: [Number, String], default: '6' },
      md: { type: [Number, String], default: '4' },
      lg: { type: [Number, String], default: '3' },
      xl: { type: [Number, String], default: '3' },
    },
    mounted() {

    },
    data() {
      return {};
    },
    watch: {},
    computed: {
      ...mapGetters('auth', { user: 'user' }),
    },
    methods: {
      vidClick(vid) {
        this.$emit('input', vid);
      },
    }
  };
</script>
