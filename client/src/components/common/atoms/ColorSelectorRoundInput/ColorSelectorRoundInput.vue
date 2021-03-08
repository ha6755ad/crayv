<template>
  <div id="ColorSelectorRoundInput" v-bind="$attrs['div-attrs']">
    <color-selector-round :colorObj="value"
                          @input="colorUpdater"
                          :name="path"
                          v-bind="$attrs['attrs']"
                          v-on="listeners">
      <template v-for="slot in slots" v-slot:[slot]="slotProps">
        <slot :name="slot" :key_name="path" v-bind="slotProps"></slot>
      </template>
    </color-selector-round>
  </div>
</template>

<script>
  import colorSelectorRound from '../colorSelectorRound/colorSelectorRound';

  export default {
    name: 'ColorSelectorRoundInput',
    inheritAttrs: false,
    components: {colorSelectorRound},
    props: {
      value: {
        type: [Object, String],
        required: false,
        default: function () {
          return {
            hue: 0,
            alpha: 1,
            hex: '#FF0000',
            hexa: '#FF0000',
            hsla: {
              h: 0,
              s: 1,
              l: 0.5,
              a: 1
            },
            hsva: {
              h: 0,
              s: 100,
              v: 100,
              a: 1
            },
            rgba: {
              r: 255,
              g: 0,
              b: 0,
              a: 1
            }
          };
        }
      },
      path: String,
      slots: {
        type: Array,
        default() {
          return [];
        }
      },
    },
    data() {
      return {};
    },
    watch: {
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // attrs defaults
          this.$lset(newVal, 'attrs.label', this.lget(newVal, 'attrs.label', 'label'));

          // div-attrs defaults
          this.$lset(newVal, 'div-attrs.class', this.lget(newVal, 'div-attrs.class', 'col-12'));
        }
      },
    },
    computed: {
      listeners() {
        // eslint-disable-next-line no-unused-vars
        const {input, ...listeners} = this.$listeners;
        return listeners;
      },
    },
    methods: {
      colorUpdater(color) {
        // eslint-disable-next-line no-console
        // console.log('New color', color);
        if ((JSON.stringify(this.value) !== JSON.stringify(color))) {
          this.$emit('input', color);
        }
      }
    }
  };
</script>

<style scoped lang="scss" src="./_ColorSelectorRoundInput.scss">
</style>
