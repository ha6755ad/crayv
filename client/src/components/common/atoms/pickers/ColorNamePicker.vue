<template>
  <div :style="{height: height, width: width, maxHeight: '95vh', maxWidth: '95vw', overflow: 'scroll'}" class="q-pa-md">
    <div style="width: 450px; height: auto" class="q-pa-sm">
      <div class="row justify-around q-mb-xs">
        <div @click="$emit('input', color)" v-for="(color, i) in mainColors" :key="`main-color-${i}`"
             :class="`bg-${color} pointer __color_block ${hover === i  ? 'hover_block' : ''}`"
             style="height: 25px; width: 25%; border-radius: 2px" @mouseenter="hover = i" @mouseleave="hover = -1"
             @touchstart="hover = i" @touchstop="hover = -1"></div>
      </div>
      <div class="__color_grid pointer" :style="colorGridStyle">
        <div v-for="(color, i) in Object.keys(colors)" :key="`color-col-${i}`" class="__color_col">
          <div @click="$emit('input', block)" v-for="(block, idx) in colors[color]" :key="`block-${idx}`"
               style="height: 100%; width: 100%"
               :class="`__color_block bg-${block} ${hover === '' + i + idx ? 'hover_block' : ''} `"
               @mouseenter="hover = '' + i + idx" @mouseleave="hover = -1" @touchstart="hover = '' + i + idx"
               @touchstop="hover = -1">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: String,
      height: {
        type: String,
        default: '350px'
      },
      width: {
        type: String,
        default: '480px'
      },
      rootColors: {
        type: Array,
        default: function () {
          return ['ir-light-blue', 'ir-blue', 'ir-indigo', 'ir-deep-purple', 'ir-purple', 'ir-pink', 'ir-red', 'ir-orange', 'ir-yellow', 'ir-green', 'ir-lime', 'ir-light-green', 'ir-teal', 'ir-cyan', 'ir-blue-grey', 'ir-brown'];
        }
      }
    },
    data() {
      return {
        hover: -1
      };
    },
    computed: {
      mainColors() {
        return ['primary', 'secondary', 'accent'];
      },
      colorGridStyle() {
        return {
          gridTemplateColumns: `repeat(${Object.keys(this.colors).length}, 1fr)`
        };
      },
      colors() {
        let colorObj = {};
        this.rootColors.forEach(a => {
          for (let i = 1; i < 11; i++) {
            colorObj[a] ? colorObj[a].push(`${a}-${i}`) : colorObj[a] = [a];
          }
        });
        return colorObj;
      }
    }
  };
</script>

<style scoped lang="scss">
  .__color_grid {
    display: grid;
    position: relative;
    height: 100%;
    width: 100%;
    grid-template-rows: 100%;

    .__color_col {
      display: grid;
      height: 100%;
      width: 100%;
      grid-template-columns: 100%;
      grid-template-rows: repeat(14, 25px);

      .__color_block {
        transform: none;
        transition: .2s ease-out;
      }

      .hover_block {
        transform: scale(1.1);
      }
    }
  }
</style>
