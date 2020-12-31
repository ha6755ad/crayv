<template>
  <div class="col-12">
    <q-card flat class="pa-4" color="transparent">
      <div class="row q-py-md items-center q-gutter-md">
        <div class="text-xxs text-mb-xs text-weight-light">Link Source</div>
        <!--            <div style="text-align: left">-->
        <!--              <p class="caption" style="margin-bottom: 5px; font-weight: 600">Provider</p>-->
        <q-chip class="bg-dark" dark>

          <q-avatar size="20px"><img :src="hostAvatar"></q-avatar>
          {{vidIn.host}}
          <q-menu>
            <q-list>
              <q-item v-for="(host, i) in Object.keys(hosts)" :key="i" @click="setHost(host)" clickable>
                <q-item-section avatar>
                  <q-avatar><img :src="hosts[host].avatar"></q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{host}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

          </q-menu>

        </q-chip>
      </div>
      <!--            </div>-->
      <q-input
        outlined
        ref="name"
        @input="$emit('newLink')"
        @keyup.enter="$emit('input', embed)"
        v-model="embed"
        :label="vidIn.host.toLowerCase() === 'vimeo' ? 'Vimeo URL' : 'YouTube URL'"
        :placeholder="vidIn.host.toLowerCase() === 'vimeo' ? 'https://vimeo.com/XXXXXXXXX' :  'https://www.youtube.com/watch?v=XXXXXXXXXXX'"
      >
        <template v-slot:append>
          <q-btn flat round size="xs" @click="$emit('input', embed)">
            <q-icon size="35px" name="mdi-video-plus" color="primary"/>
          </q-btn>
        </template>
      </q-input>
    </q-card>
  </div>
</template>

<script>
  import {Youtube} from './mixins/Youtube';

  export default {
    name: 'HostPicker',
    mixins: [Youtube],
    props: {
      vidIn: Object,
      value: String
    },
    data() {
      return {
        embed: '',
        host: 'youtube',
      };
    },
    watch: {
      vidIn: {
        immediate: true,
        handler(newVal){
          if(newVal) {
            this.host = newVal.host;
          }
        }
      },
      value: {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal !== oldVal) {
            this.embed = newVal;
          }
        }
      }
    },
    computed: {
      hostAvatar() {
        return this.hosts[this.vidIn.host.toLowerCase()] ? this.hosts[this.vidIn.host.toLowerCase()].avatar : '';
      },
      hosts() {
        return {
          youtube: {
            name: 'Youtube',
            avatar: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/follow/youtubeicon.png'
          },
          vimeo: {
            name: 'Youtube',
            avatar: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/follow/vim-icon.png'
          }
        };
      }
    },
    methods: {
      setHost(host) {
        this.$emit('host', host);
      },
    }
  };
</script>
