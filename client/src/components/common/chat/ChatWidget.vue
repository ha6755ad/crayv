<template>
  <div :style="display > 0 ? {} : styleIn" class="chat_widget">
    <div class="__chat_button" :style="{background: color}" @click.stop="display > 0 ? display = 0 : display = 1">
      <q-icon :color="icon_color" style="transform: scaleX(-1);" size="24px" name="mdi-chat"/>
      <div class="__chat_hint" :style="!$attrs.hintOn ? {width: 0} : {}">
        <div class="__chat_hint_in">
          <slot name="hint"></slot>
        </div>
      </div>
    </div>
    <template v-if="$q.screen.gt.sm">
      <div class="__chat_container">
        <div class="__chat_wrapper">
          <div  v-if="display > 0">
<!--            <div :style="chatStyle" class="__chat_card">-->
              <div style="max-height: 80vh; max-width: 75vw; width: 1400px; height: 900px;">
                <global-app  @close="display = 0" app-name="Legacy Coin"></global-app>
              </div>
<!--            </div>-->
          </div>
        </div>
      </div>

    </template>
    <template v-else>
      <q-dialog maximized transition-show="slide-up" transition-hide="slide-down" :value="display > 0"
                @close="display = 0">
<!--        <q-card style="height: 100vh; width: 100vw">-->
<!--          <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="display = 0"/>-->
<!--          <chat></chat>-->
<!--        </q-card>-->
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="display = 0"/>
        <div style="height: 100vh; width: 100vw">
          <global-app @close="display = 0" app-name="Legacy Coin"></global-app>
        </div>
      </q-dialog>
    </template>

  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  // import {models} from 'feathers-vuex';
  // import {mapState, mapActions} from 'vuex';
  // import Chat from './Chat';
  import GlobalApp from '../../ir-chat/layouts/GlobalApp';


  export default {
    name: 'ChatWidget',
    components: {
      // Chat,
      GlobalApp,
    },
    props: {
      styleIn: Object,
      color: {
        type: String,
        default: '#101010'
      },
      icon_color: {
        type: String,
        default: 'light'
      }
    },
    data() {
      return {
        // 0 - none 1 - prompt 2 - full
        display: 0,
      };
    },
    async mounted() {


    },
    watch: {
      display: {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal === 0 && oldVal !== 0) {
            this.$store.dispatch('ir-chat-context/toggleChat', false);
          }
        }
      },
      chatOn: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.displayStageTwo();
          }
        }
      }
    },
    computed: {
      ...mapGetters('ir-chat-context', { chatOn: 'chatOn' }),
      ...mapGetters('auth', {user: 'user'}),
      chatStyle() {
        switch (this.display) {
          case(0):
            return {};
          case(1):
            return {
              height: 'auto',
              width: 'auto',
              transform: 'translateY(-10px)'
            };
          case(2):
            return {
              height: '700px',
              width: '400px'
            };
          default:
            return {};
        }
      },
    },
    methods: {
      ...mapActions(
        'ir-chat-layers', {
          loadLayers: 'find',
        }
      ),
      displayStageTwo() {
        this.display = 2;
      }
    },
  };
</script>

<style scoped lang="scss">
  .chat_widget {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background: #101010;
    border: 2px solid #fafafa;
    position: fixed;
    z-index: 1000;
    bottom: 1vw;
    right: 1vw;


    .__chat_button {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      position: relative;
      display: grid;
      align-items: center;
      justify-items: center;
      box-shadow: 1px 1px 4px rgba(0, 0, 0, .4);
      cursor: pointer;
      border: solid 2px #eeeeee;
      transition: .2s ease-out;

      &:hover {
        transform: scale(1.1);
        box-shadow: 1px 1px 10px rgba(0, 0, 0, .6);
      }

      .__chat_hint {
        position: absolute;
        top: 0;
        left: 0;
        transform: translate(-105%, -30%);
        width: 260px;
        max-width: 80vw;
        overflow: hidden;
        transition: all .25s ease-out;
        border-radius: 5px 5px 0 5px;
        box-shadow: 2px 2px 8px rgba(0, 0, 0, .6);

        .__chat_hint_in {
          position: relative;
          height: 100%;
          width: 100%;
          border-radius: 5px 5px 0 5px;
          background: #fafafa;

          &::after {
            content: ' ';
            position: absolute;
            transform: translateX(2px);
            top: 100%; /* At the bottom of the tooltip */
            right: -10px;
            border-width: 10px;
            border-style: solid;
            border-color: transparent transparent #fafafa #fafafa;
          }
        }
      }
    }

    .__chat_container {
      position: relative;
      height: 100%;
      width: 100%;

      .__chat_wrapper {
        position: absolute;
        /*bottom: 3vw;*/
        top: -50px;
        right: 0;
        transform: translate(-20px, -101%);
        /*right: 3vw;*/

        .__chat_box {

          .__chat_card {
            height: 0;
            width: 0;
            max-height: 80vh;
            max-width: 86vw;
            border-radius: 5px;
            box-shadow: 0 3px 6px #424242;
            position: relative;
            transition: all .2s ease-out;
            background: #fafafa;

            &::before {
              content: ' ';
              position: absolute;
              width: 0;
              height: 0;
              top: 100%;
              right: -2px;
              border: 12px solid;
              z-index: -1;
              border-color: rgba(0, 0, 0, .3) rgba(0, 0, 0, .3) transparent transparent;
            }

            &::after {
              content: ' ';
              position: absolute;
              transform: translateY(-2px);
              top: 100%; /* At the bottom of the tooltip */
              right: 0;
              border-width: 10px;
              border-style: solid;
              border-color: #fafafa #fafafa transparent transparent;
            }
          }
        }
      }
    }
  }

  .__chat_prompt {
    text-decoration: underline;
    cursor: pointer;

    .__wait_ball {
      height: 10px;
      width: 10px;
      margin: 0 5px 0 5px;
      border-radius: 50%;
      background: #101010;
      -webkit-animation-name: pulsate-bck
    }
  }

  .pulsate-bck {
    -webkit-animation: pulsate-bck .5s ease-in-out infinite both;
    animation: pulsate-bck .5s ease-in-out infinite both
  }

  /* ----------------------------------------------
* Generated by Animista on 2020-4-18 16:48:36
* Licensed under FreeBSD License.
* See http://animista.net/license for more info.
* w: http://animista.net, t: @cssanimista
* ---------------------------------------------- */

  @-webkit-keyframes pulsate-bck {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1)
    }
    50% {
      -webkit-transform: scale(.6);
      transform: scale(.6)
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1)
    }
  }

  @keyframes pulsate-bck {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1)
    }
    50% {
      -webkit-transform: scale(.6);
      transform: scale(.6)
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1)
    }
  }
</style>
