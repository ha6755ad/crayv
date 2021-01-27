<template>
  <div id="post_images" class="fill_size q-pa-sm" :style="{position: 'relative', maxHeigth: wide * 2 + 'px', overflowY: 'scroll'}">
    <q-btn v-if="editing" round size="sm" push class="t-l" icon="mdi-close" color="negative" @click="$emit('remove', imgIndex)"></q-btn>
    <div class="row justify-center q-px-sm q-my-md" v-if="imgLength">
      <q-card style="width: 100%;" flat>
      <q-img style="width: 100%; position: relative;" :src="getAvatar(value, contentPath, 'large', imgIndex)">
        <q-btn v-if="imgLength > 1" flat round size="sm" @click="nextImg" class="next-btn text-light" style="background: rgba(0,0,0,.5)">
          <q-icon name="mdi-chevron-right" size="24px"></q-icon>
        </q-btn>
        <q-btn v-if="imgLength > 1" flat round size="sm" @click="backImg" class="back-btn text-light" style="background: rgba(0,0,0,.5)">
          <q-icon size="24px" name="mdi-chevron-left"></q-icon>
        </q-btn>
      </q-img>
      </q-card>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PostImages',
    props: {
      contentPath: {
        type: String,
        default: 'images'
      },
      editing: Boolean,
      value: Object
    },
    mounted(){
      this.getWide();
      window.addEventListener('resize', () => {
        this.getWide();
      });
    },
    data(){
      return {
        imgIndex: 0,
        wide: 500
      };
    },
    computed: {
      imgLength() {
        return this.lget(this.value, this.contentPath) ?  this.lget(this.value, this.contentPath, []).length : 0;
      },
    },
    methods: {
      getWide(){
        let el = document.getElementById('post_images');
        if(el){
          let rect = el.getBoundingClientRect();
          this.wide = rect.width;
        }
      },
      nextImg() {
        if (this.imgLength - 1 > this.imgIndex) this.imgIndex++;
        else this.imgIndex = 0;
      },
      backImg() {
        if (this.imgLength > 0) this.imgIndex--;
        else this.imgIndex = this.imgLength - 1;
      }
    }
  };
</script>

<style scoped lang="scss">
  .next-btn {
    position: absolute;
    right: 3px;
    top: 50%;
    transform: translate(0, -50%);
    background: rgba(255, 255, 255, .4);
  }

  .back-btn {
    position: absolute;
    left: 3px;
    top: 50%;
    transform: translate(0, -50%);
    background: rgba(255, 255, 255, .4);
  }
</style>
