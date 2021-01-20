<template>
  <q-card :flat="flat" :style="styleIn" class="fill_size">
      <q-img style="border-radius: inherit" class="fill_size" :src="imageSrc">
<!--        <div class="b-l-a" v-if="contentSlot">-->
          <slot name="content"></slot>
<!--        </div>-->
      </q-img>
    <template v-if="multiLength > 1">
      <q-btn size="xs" round flat
             class="__right-arrow text-dark bg-shade-2 text-white" @click.stop="forward"
             :style="!btnPosition ? {} : btnPosition === 'top' ? { top: '150px' } : btnPosition === 'bottom' ? { bottom: '150px'} : {}"
      >
        <q-icon name="mdi-menu-right" size="25px"/>
      </q-btn>
      <q-btn
        size="xs" round flat
        class="__left-arrow text-dark bg-shade-2 text-white" @click.stop="backward"
        :style="!btnPosition ? {} : btnPosition === 'top' ? { top: '150px' } : btnPosition === 'bottom' ? { bottom: '150px'} : {}"
      >
        <q-icon name="mdi-menu-left" size="25px"/>
      </q-btn>
    </template>
  </q-card>
</template>

<script>
  export default {
    name: 'MultiImageViewer',
    props: {
      btnPosition: String,
      flat: Boolean,
      value: [Array, String, Object],
      avatarPath: {
        type: String,
        default: 'avatar'
      },
      imgSize: {
        type: String,
        default: 'medium'
      },
      styleIn: [Object, String],
      defaultImg: String
    },
    data(){
      return {
        tab: 0
      };
    },
    computed: {
      multiLength(){
        return this.value && Array.isArray(this.value[this.avatarPath]) ? this.value[this.avatarPath].length : 0;
      },
      contentSlot(){
        if(this.$slots.content) return true;
        else return false;
      },
      imageSrc(){
        if(Array.isArray(this.value[this.avatarPath])){
          return this.getAvatar(this.value, this.avatarPath, this.imgSize, this.tab, this.defaultImg);
        } else {
          return this.getAvatar(this.value, this.avatarPath, this.imgSize, null, this.defaultImg);
        }
      }
    },
    methods: {
      forward(){
        let i = this.tab;
        if(i < this.multiLength - 1) this.tab++;
        else this.tab = 0;
      },
      backward(){
        let i = this.tab;
        if(i > 0) this.tab--;
        else this.tab = this.multiLength - 1;
      }
    }
  };
</script>

<style scoped lang="scss">
  .__right-arrow {
    position: absolute;
    top: 50%;
    right: 2%;
    transform: translateY(-100%);
    transition: transform .2s ease-out;

    &:hover {
      transform: translateY(-80%) scale(1.3)
    }
  }

  .__left-arrow {
    position: absolute;
    top: 50%;
    left: 2%;
    transform: translateY(-100%);
    transition: transform .2s ease-out;

    &:hover {
      transform: translateY(-80%) scale(1.3)
    }
  }
</style>
