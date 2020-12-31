<template>
  <div id="colorSelectorRound">

    <q-card>
      <q-card-section class="flex">
        <h5 class="headline q-my-none">{{colorLabel}}:</h5>
        <q-space></q-space>
        <q-btn @click="setDefaultColor">
          Default Color
        </q-btn>
      </q-card-section>
      <q-card-section>


        <div class="row q-mb-md" style="justify-content: center">
          <color-pick v-bind="newColor.hsla"
                      :step="step"
                      :mouseScroll="mouseScroll"
                      :variant="variant"
                      :disabled="disabled"
                      :initiallyCollapsed="initiallyCollapsed"
                      @input="updateColor"></color-pick>
        </div>

        <q-list bordered class="rounded-borders">
          <q-expansion-item v-model="expanded"
                            label="More Options ...">
            <q-card class="row q-mt-sm">
              <q-card-section class="col">
                <div class="row" style="justify-content: end">
                  <div class="col-5" style="justify-content: end">
                    <p class="q-px-none" style="justify-content: flex-end;">Saturation</p>
                  </div>
                  <div class="col">
                    <q-slider v-model="newColor.hsla.s"
                              hint="0 % to 100 % (Default 100 %)"
                              :step="0.01"
                              :min="0.00"
                              :max="1.00"
                              label-always></q-slider>
                  </div>
                </div>
                <div class="row" style="justify-content: end">
                  <div class="col-5" style="justify-content: end">
                    <p class="q-px-none" style="justify-content: flex-end;">Luminosity</p>
                  </div>
                  <div class="col">
                    <q-slider v-model="newColor.hsla.l"
                              hint="0 % to 100 % (Default 50%)"
                              :step="0.01"
                              :min="0.00"
                              :max="1.00"
                              label-always></q-slider>
                  </div>
                </div>
                <div class="row" style="justify-content: end">
                  <div class="col-5">
                    <p class="q-px-none" style="justify-content: flex-end;">Opacity (Alpha)</p>
                  </div>
                  <div class="col">
                    <q-slider v-model="newColor.hsla.a"
                              hint="0.00 to 1.00 (Default 1.00)"
                              :step="0.01"
                              :min="0.00"
                              :max="1.00"
                              label-always></q-slider>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>

      </q-card-section>
    </q-card>

  </div>
</template>

<script>
  import ColorPick from './colorPick';

  const tinycolor = require('tinycolor2');


  const getDefaultData = () => {
    return {
      expanded: false,
      defaultPrimary: '',
      newColor: {
        hsla: {
          h: 0,
          s: 1,
          l: 0.5,
          a: 1
        }
      }
    };
  };

  export default {
    name: 'colorSelectorRound',
    components: {
      ColorPick: ColorPick
    },
    props: {
      colorObj: {
        type: [Object, String],
        required: true,
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
      step: {
        type: Number,
        default: 2,
      },
      mouseScroll: {
        type: Boolean,
        default: false,
      },
      variant: {
        type: String,
        default: 'collapsible', // collapsible | persistent
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      initiallyCollapsed: {
        type: Boolean,
        default: false,
      },
      colorLabel: {
        type: String,
        default: 'Color Picker'
      }
    },
    data() {
      return getDefaultData();
    },
    watch: {
      colorObj: {
        deep: true,
        immediate: true,
        handler(value) {
          let new_color;
          if (typeof value === 'object') {
            new_color = value;
          } else if (typeof value === 'string') {
            var color = tinycolor(value);
            new_color = {
              hsla: color.toHsl()
            };
          } else {
            new_color = Object.assign({}, new_color, this.defaultColor);
          }
          Object.assign(this.newColor.hsla, new_color.hsla);
        }
      },
      newColor: {
        deep: true,
        handler(value) {
          this.updateColor(value.hsla.h);
        }
      }
    },
    methods: {
      setDefaultColor() {
        Object.assign(this.$data, getDefaultData());
      },
      updateColor(hue) {
        this.newColor.hsla.h = Math.round(hue);
        let alpha = this.newColor.hsla.a;

        var colorVar = tinycolor({
          h: this.newColor.hsla.h,
          s: this.newColor.hsla.s,
          l: this.newColor.hsla.l,
          a: this.newColor.hsla.a
        });
        let rgba = colorVar.toRgb();

        let hsva = colorVar.toHsv();

        let hex = colorVar.toHexString();
        let hexa = colorVar.toHex8String();

        let payload = {
          alpha: alpha,
          hex: hex,
          hexa: hexa,
          hsla: {
            h: this.newColor.hsla.h,
            s: this.newColor.hsla.s,
            l: this.newColor.hsla.l,
            a: this.newColor.hsla.a
          },
          hsva: hsva,
          hue: hue,
          rgba: rgba
        };

        this.$emit('input', payload);
      }
    }
  };
</script>


<style scoped lang="scss" src="./_colorSelectorRound.scss">
</style>
