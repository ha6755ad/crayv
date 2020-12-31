<template>
  <div
    :style="{padding: pad, position: 'relative', display: 'flex', flexDirection: 'row', justifyContent: 'center', height: pix * 5 + 'px', width: pix * 5 + 'px'}">
    <!--            <v-row>-->
    <!--                <v-col class="mt-12">-->
    <span @click.stop="dialog = true" :style="midSizing(cat ? cat.color : '#fafafa')">
      <q-icon v-if="midIcon" :name="midIcon" size="50px"></q-icon>
    </span>


    <!--                    <CommsBar :iconWidth="pix * 2.5"></CommsBar>-->
    <!--                </v-col>-->
    <!--                <v-col>-->
    <div  class="__nodes" v-for="(node, index) in nodes" :key="node._id" :style="{
                'height': pix + 'px',
                'width': pix + 'px',
                'border-radius': '50%',
                'position': 'absolute',
                'overflow': 'visible',
                'top': '50%',
                'left': '50%',
                'list-style': 'none',
                'margin-left': pix * -.55 + 'px',
                'margin-top': pix * -.5 + 'px',
                'transform': roundy(node, index),
                'border': '1px solid' + cat ? cat.color : '#424242'
                }" @click="selectNode(node._id, index)" :node="node" :id="node._id">
      <default-avatar :size-in="pix + 'px'" :value="node" :avatar-path="nodeAvatarPath"></default-avatar>
      <div style="position: relative" v-if="activeId + index === node._id + index">
      <detail-card no-img flat @tree="$emit('node', node)" closable class="__detail_card" chat-off :value="node" />
      </div>
    </div>


    <!--                </v-col>-->
    <!--            </v-row>-->
  </div>
</template>

<script>
  import DefaultAvatar from './avatars/DefaultAvatar';
  import DetailCard from './users/DetailCard';

  export default {
    name: 'NodeCircle',
    props: {
      nodeAvatarPath: {
        type: String,
        default: 'avatar'
      },
      midAvatar: String,
      midIcon: String,
      pix: {
        type: Number,
        default: 75
      },
      spacer: {
        type: Number,
        default: 1.6
      },
      pad: {
        type: String,
        default: '10%'
      },
      cat: {
        type: Object,
        default: function () {
          return { color: '#424242'};
        }
      },
      nodeIn: Object,
      nodes: {
        type: Array
      }
    },
    components: {
      DetailCard,
      DefaultAvatar
    // CommsBar
    },
    data() {
      return {
        activeId: null,
        angle: 360,
        transform: '',
        start_angle: 360,
        hactive: false,
        dialog: false,
        searchPop: false,
        searchField: null,
        windowWidth: 0,
        windowHeight: 0,
        imgBall: false,

      };
    },
    mounted() {
      this.$nextTick(function () {
        window.addEventListener('resize', this.getWindowWidth);
        window.addEventListener('resize', this.getWindowHeight);

        //Init
        this.getWindowWidth();
        this.getWindowHeight();
      });

    },
    beforeDestroy() {
      window.removeEventListener('resize', this.getWindowWidth);
      window.removeEventListener('resize', this.getWindowHeight);
    },

    computed: {
      nodeList() {
        let num = this.nodes.length;
        return Array(num).fill('http://lorempixel.com/100/100/people');
      },

      cardHeight() {
        return this.pix * 5 + 'px';
      },
      transEffect() {
        return '{\'transform\' : \'scale(2)\'}';
      },
      spacing() {
        return this.pix * this.spacer;
      },
      tranSize() {
        return this.pix / 4;
      },
      shadow() {
        return this.pix * .1;
      },
      // circleSize() {
      //
      // },
      listLength() {
        return this.nodes.length;
      },
      offsetAngle() {
        return this.angle / this.listLength;
      },
      lgSpacing() {
        return this.spacer * 1.5;
      },
      midSize() {
        return this.pix * .8 + 'px';
      },
      midMargin() {
        return this.pix * -.4 + 'px';
      },
      commIcons() {
        return {
          'position': 'absolute',
          'width': '135',
          'left': '41.5%',
          'top': '25%',
          'margin-left': this.midMargin,
          'margin-top': this.midMargin
        };
      }

    },
    methods: {
      midSizing(color) {
        return {
          'position': 'absolute',
          'border-radius': '100%',
          'width': this.midSize,
          'height': this.midSize,
          'left': '50%',
          'top': '50%',
          'margin-left': this.midMargin,
          'margin-top': this.midMargin,
          'background-color': (this.midIcon || this.midAvatar) ? 'none' : color || 'white',
          'background-image': this.midAvatar ? 'url(' + this.midAvatar + ')' : 'none',
          'background-size': 'cover'

        };
      },
      roundy(user, index) {
        let rotate = this.start_angle + (this.offsetAngle * index || 0);
        let trnsfm = 'rotate(' + rotate + 'deg) translate(0px, -' + this.spacing + 'px) rotate(-' + rotate + 'deg)';

        return user.transform = trnsfm;
      },
      selectNode(id, index) {
        let element = document.getElementById(id);
        let rotate = this.start_angle + (this.offsetAngle * index || 0);
        if (!this.imgBall) {
          element.style.zIndex = 1000;
          element.style.transform = 'none';
          this.imgBall = !this.imgBall;
          this.activeId = id;
        } else {
          element.style.zIndex = 0;
          element.style.transform = 'rotate(' + rotate + 'deg) translate(0px, -' + this.spacing + 'px) rotate(-' + rotate + 'deg)';
          this.imgBall = !this.imgBall;
          this.activeId = null;
        }


      },
      popOn() {
        this.hactive = !this.hactive;
      //console.log(this.hactive)
      },
      getWindowWidth() {
      // this.windowWidth = document.documentElement.clientWidth;
      // this.pix = this.windowWidth / (this.windowWidth / 100)
      },

      getWindowHeight() {
        this.windowHeight = document.documentElement.clientHeight;
      },

      // remove(node) {
      //   const index = this.nodes.indexOf(node.id)
      //   if (index >= 0) this.nodes.splice(index, 1)
      // },
      toggle(node) {
        const i = this.nodes.indexOf(node);

        if (i > -1) {
          this.nodes.splice(i, 1);
        } else {
          this.nodes.push(node);
        }
      },
    }
  };
</script>

<style scoped lang="scss">

  .round-cards {

  }
  .__nodes {
    transition: all .2s ease-out;
  }

  .round-cards:hover {
    transform: scale(2);
    transition: all 300ms;
    z-index: 1000;
  }

  .__detail_card {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 100%);
    width: 300px;
    z-index: 1;
  }

  @media (max-width: 800px) {
    .__detail_card {
      position: fixed;
      bottom: 0;
      left: 5%;
      width: 90%;
      transform: none;
    }
  }


</style>
