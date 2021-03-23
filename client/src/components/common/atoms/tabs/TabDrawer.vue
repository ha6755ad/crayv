<template>
  <div class="__tab_drawer" :style="lget(attrs, 'divStyle', {})">
    <div
      class="flex items-center"
      v-for="(tab, i) in tabs" :key="`tab-${i}`"
      @mouseenter="hover = i"
      @mouseleave="hover = -1"
      @touchstart="hover = i"
      @touchend="hover = -1"
      @click="emitValue ? $emit('input', tab[optionValue]) : $emit('input', i)"
    >
      <div
        class="__img_card flex flex-center"
        :style="{
        transform: hover === i ? 'scale(1.1)' : null,
        background: isOn(tab, i) ? '#212121' : null,
        boxShadow: isOn(tab, i) ? '0 0 0 3px white' : null
      }">
        <q-img
          :style="{
          height: '80%',
          width: '80%',
          borderRadius: 0,
          filter: isOn(tab, i) ? 'brightness(0) invert(1)' : null
          }"
          contain
          :src="tab.avatar">
        </q-img>
        <q-tooltip anchor="center left" self="center right"
                   content-class="bg-white text-dark text-sm text-mb-sm text-weight-bold">
          {{ tab.label }}
        </q-tooltip>
      </div>
      <div v-if="on" class="bg-white q-pl-sm" style="height: 40px; max-height: 9vw; z-index: 0; padding-bottom: 12%;">
        <div class="text-sm text-mb-sm text-weight-bold">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TabDrawer',
    props: {
      tabs: Array,
      value: [Number, String],
      emitValue: Boolean,
      optionValue: { type: String, default: 'value' }
    },
    data() {
      return {
        hover: -1,
        on: false,
        active: -1
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal) {
          if (newVal !== this.active) this.active = newVal;
        }
      }
    },
    computed: {
      attrs() {
        return this.$attrs;
      }
    },
    methods: {
      isOn(tab, i) {
        if (this.emitValue) {
          return this.active === tab[this.optionValue];
        } else return this.active === i;
      }
    }
  };
</script>

<style scoped lang="scss">
  .__tab_drawer {
    position: fixed;
    bottom: 5%;
    right: 0;
    display: flex;
    flex-direction: column;
    z-index: 1000;

    .__img_card {
      height: 50px;
      width: 50px;
      border-radius: 50%;
      padding: 5%;
      max-height: 12vw;
      max-width: 12vw;
      background: white;
      box-shadow: 0 0 0 3px rgba(11, 11, 11, .7);
      position: relative;
      z-index: 1;
      cursor: pointer;
      transition: all .15s ease-out;
    }
  }
</style>
