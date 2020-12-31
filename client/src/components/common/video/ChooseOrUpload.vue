<template>
  <q-card flat class="bg-transparent" style="width: 100%">

    <div class="row justify-end" v-if="requireSave">
      <q-btn @click="save(selected)" flat icon="mdi-content-save" size="sm" label="Add Videos" color="dark"/>
    </div>

    <div class="q-my-sm" v-if="displayVideos && displayVideos.length">
      <div class="row justify-center text-xxs text-mb-xxs text-weight-light">
        Selected Videos
      </div>
      <div class="row justify-center" style="min-height: 150px">
        <q-card flat style="width: 250px; max-width: 95vw">
          <video-content editing @rmv="rmvVideo" :videos-in="displayVideos"/>
        </q-card>
      </div>
    </div>

    <div class="row q-mb-sm">
      <q-btn @click="tab = 0" label="Video Library" icon="mdi-cursor-default-click" flat
             :color="tab === 0 ? 'accent' : 'grey-7'"/>
      <q-separator vertical/>
      <q-btn @click="tab = 1" label="add new" icon="mdi-video-plus" flat :color="tab === 1 ? 'accent' : 'grey-7'"/>
    </div>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel :name="0">
        <div class=" q-pa-md text-xs text-mb-sm text-weight-light">Your Videos</div>
        <div class=" q-pa-md text-xxs text-mb-xs text-weight-light">Click title to add</div>
        <video-library :videos-in="stateVideos" @input="handleInput" :sm="sm" :md="md" :lg="lg"
                       :xl="xl"></video-library>
      </q-tab-panel>
      <q-tab-panel :name="1">
        <video-form :prefer-link="preferLink"  @input="handleInput"></video-form>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script>
  import VideoForm from './VideoForm';
  import VideoLibrary from './VideoLibrary';
  import {mapActions, mapGetters} from 'vuex';
  import VideoContent from 'components/common/video/VideoContent';

  export default {
    name: 'ChooseOrUpload',
    components: { VideoContent, VideoLibrary, VideoForm },
    props: {
      requireSave: {
        type: Boolean,
        default: true
      },
      value: { Object, Array, String },
      multiple: Boolean,
      emitValue: Boolean,
      optionValue: {
        type: String,
        default: '_id'
      },
      preferLink: Boolean,
      col: { type: [Number, String], default: '12' },
      sm: { type: [Number, String], default: '6' },
      md: { type: [Number, String], default: '4' },
      lg: { type: [Number, String], default: '3' },
      xl: { type: [Number, String], default: '3' },
    },
    async mounted() {
      await this.loadVideoUploads({
        query: {
          $limit: 25,
          creator: this.user._id
        }
      }).then(res => {
        if (!res.data || !res.data.length) this.tab = 1;
      }).catch(err => {
        console.log('error loading videos', err);
      });
    },
    data() {
      return {
        tab: 0,
        selected: null
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            if(this.emitValue) {
              if (this.multiple) {
                let val = this.stateVideos.filter(a => newVal.includes(a._id));
                this.selected = val;
              } else {
                let val = this.stateVideos.filter(a => newVal === a._id);
                this.selected = val;
              }
            } else this.selected = newVal;
          }
        }
      }
    },
    computed: {
      ...mapGetters('fv-video-uploads', { findVidFiles: 'find' }),
      displayVideos() {
        if (this.selected && typeof this.selected !== 'undefined') {
          if (Array.isArray(this.selected)) return this.selected;
          else return [this.selected];
        } else return [];
      },
      stateVideos() {
        // let query;
        // if (!this.filterForContent) {
        //   query = {
        //     _id: { $nin: this.contentVidList },
        //     creator: this.lget(this.user, 'hasPerson')
        //   };
        // } else {
        let query = {
          $limit: 25,
          creator: this.lget(this.user, '_id')
        };
        // }
        return this.findVidFiles({
          query: query
        }).data.map(a => a.clone());
      },
    },
    methods: {
      ...mapActions('fv-video-uploads', { loadVideoUploads: 'find' }),
      rmvVideo(i) {
        this.selected.splice(i, 1);
        if(!this.requireSave) this.save();
      },
      handleInput(val) {
        let value = val;
        if (this.multiple) {
          this.selected ? this.selected.push(value) : this.selected = [value];
        } else {
          this.selected = value;
        }
        if(!this.requireSave) this.save();
      },
      save() {
        let payload;
        if (this.multiple) {
          payload = this.emitValue ? this.selected.map(a => a[this.optionValue]) : this.selected;
        } else {
          payload = this.emitValue ? this.selected[this.optionValue] : this.selected;
        }
        this.tab = 0;
        this.$emit('input', payload);
      }
    }
  };
</script>

<style scoped lang="scss">

</style>
