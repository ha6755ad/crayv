<template>
  <div class="simpleColorSelector">

    <q-card flat
            style="min-width: 375px; min-height: 280px; text-align: center;">
      <q-card-section>
        <h3>{{colorLabel}}:</h3>
      </q-card-section>
      <q-card-section>
        <div class="row q-mb-5" style="justify-content: center">
          <color-pick v-bind="color.hsla" @input="updateColor"></color-pick>
        </div>
      </q-card-section>
    </q-card>

  </div>
</template>

<script>
  import ColorPick from './colorPick';

  export default {
    name: 'simpleColorSelector',
    components: {
      ColorPick: ColorPick
    },
    props: {
      colorObj: {
        type: Object,
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
      colorLabel: {
        type: String,
        default: 'Avatar Color'
      }
    },
    data() {
      return {
        defaultPrimary: '',
        defaultColor: {
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
        }
      };
    },
    computed: {
      color() {
        return this.colorObj;
      }
    },
    watch: {
      color: {
        deep: true,
        handler(value) {
          this.updateColor(value.hsla.h);
        }
      }
    },
    methods: {
      setDefaultColor() {
        Object.assign(this.color, this.defaultColor);
      },
      updateColor(hue) {
        this.color.hsla.h = Math.round(hue);
        let alpha = this.color.hsla.a;

        var Color = require('color');
        var ColorString = require('color-string');
        var colorVar = Color.hsl(this.color.hsla.h, this.color.hsla.s, this.color.hsla.l).alpha(this.color.hsla.a);
        let rgba = colorVar.rgb().object();
        rgba.r = Math.round(rgba.r);
        rgba['a'] = alpha === 1 ? 1 : rgba.alpha;
        delete rgba.alpha;

        let hsva = colorVar.hsv().object();
        hsva['a'] = alpha === 1 ? 1 : hsva.alpha;
        delete hsva.alpha;

        let hex = colorVar.hex();
        let hexa = ColorString.to.hex(Object.values(rgba));  // TODO: hexa not converting correctly

        let payload = {
          alpha: alpha,
          hex: hex,
          hexa: hexa,
          hsla: {
            h: this.color.hsla.h,
            s: this.color.hsla.s,
            l: this.color.hsla.l,
            a: this.color.hsla.a
          },
          hsva: hsva,
          hue: this.color.hsla.h,
          rgba: rgba
        };

        this.$emit('input', payload);
      }
    }
  };
</script>
