<template>
  <div id="colorpicker-component">
    <div class="rcp"
         :class="{ dragging: isDragging, disabled: disabled }"
         :tabindex="disabled ? -1 : 0"
         @keyup.enter="selectColor"
         @keydown.up.right.prevent="rotate($event, true)"
         @keydown.down.left.prevent="rotate($event, false)">
      <div class="rcp__palette" :class="isPaletteIn ? 'in' : 'out'" ref="palette">
        <canvas></canvas>
      </div>

      <div class="rcp__rotator"
           :style="{
                'pointer-events': disabled || isPressed || !isKnobIn ? 'none' : null,
                transform: `rotate(${ssrHue}deg)`,
            }"
           @dblclick.self="rotateToMouse"
           @click.self="rotateToMouse"
           v-on="mouseScroll ? { wheel: onScroll } : null"
           ref="rotator">
        <div class="rcp__knob" :class="isKnobIn ? 'in' : 'out'" @transitionend="hidePalette"></div>
      </div>

      <div class="rcp__ripple" :class="{ rippling: isRippling }" :style="{ borderColor: color }"></div>

      <button type="button"
              class="rcp__well"
              :class="{ pressed: isPressed }"
              :style="{ backgroundColor: color }"
              @animationend="togglePicker"
              @click="selectColor"></button>
    </div>

  </div>
</template>

<script>
  import fillColorWheel from '@radial-color-picker/color-wheel';
  import Rotator from '@radial-color-picker/rotator';

  export default {
    rcp: null,
    name: 'colorPick',
    props: {
      h: {
        default: 0,
      },
      s: {
        default: 1,
      },
      l: {
        default: 0.5,
      },
      a: {
        default: 1,
      },
      step: {
        default: 2,
      },
      mouseScroll: {
        default: false,
      },
      variant: {
        default: 'collapsible', // collapsible | persistent
      },
      disabled: {
        default: false,
      },
      initiallyCollapsed: {
        default: false,
      },
    },
    data() {
      return {
        ssrHue: 0,
        isPaletteIn: !this.initiallyCollapsed,
        isKnobIn: !this.initiallyCollapsed,
        isPressed: false,
        isRippling: false,
        isDragging: false,
      };
    },
    computed: {
      color() {
        return `hsla(${this.h}, ${this.s * 100}%, ${this.l * 100}%, ${this.a})`;
      },
    },
    watch: {
      h: function (angle) {
        this.rcp.angle = angle;
      },
    },
    created() {
      // update the SSR value once when the component is created
      // prevents knob jumping when using Server Side Rendering
      // where the knob's position is updated only after the client-side code is executed (on mount)
      this.ssrHue = this.h;
    },
    mounted() {
      // ignore testing code that will be removed by dead code elimination for production
      /* istanbul ignore next */
      if (process.env.NODE_ENV === 'development' && this.initiallyCollapsed && this.variant === 'persistent') {
        // eslint-disable-next-line no-console
        console.warn(
          'Incorrect config: using variant="persistent" and :initiallyCollapsed="true" at the same time is not supported.'
        );
      }

      const isConicGradientSupported = getComputedStyle(this.$refs.palette).backgroundImage.includes('conic');

      // ignore conic-gradient support & polyfill
      /* istanbul ignore else */
      if (!isConicGradientSupported) {
        fillColorWheel(this.$refs.palette.firstElementChild, this.$el.offsetWidth || 280);
      }

      this.rcp = new Rotator(this.$refs.rotator, {
        angle: this.h,
        onRotate: this.updateColor,
        onDragStart: () => {
          this.isDragging = true;
        },
        onDragStop: () => {
          this.isDragging = false;
        },
      });
    },
    methods: {
      onScroll(ev) {
        if (this.isPressed || !this.isKnobIn) return;

        ev.preventDefault();

        if (ev.deltaY > 0) {
          this.rcp.angle += this.step;
        } else {
          this.rcp.angle -= this.step;
        }

        this.updateColor(this.rcp.angle);
      },
      rotate(ev, isIncrementing) {
        if (this.disabled || this.isPressed || !this.isKnobIn) return;

        let multiplier = isIncrementing ? 1 : -1;

        if (ev.ctrlKey) {
          multiplier *= 6;
        } else if (ev.shiftKey) {
          multiplier *= 3;
        }

        this.rcp.angle += this.step * multiplier;
        this.updateColor(this.rcp.angle);
      },
      updateColor(hue) {
        this.$emit('input', hue);
      },
      rotateToMouse(ev) {
        if (this.isPressed || !this.isKnobIn) return;

        this.rcp.setAngleFromEvent(ev);
      },
      selectColor() {
        this.isPressed = true;

        if (this.isPaletteIn && this.isKnobIn) {
          this.$emit('change', this.h);
          this.isRippling = true;
        } else {
          this.isPaletteIn = true;
        }
      },
      togglePicker() {
        if (this.variant !== 'persistent') {
          if (this.isKnobIn) {
            this.isKnobIn = false;
          } else {
            this.isKnobIn = true;
            this.isPaletteIn = true;
          }
        }

        this.isRippling = false;
        this.isPressed = false;
      },
      hidePalette() {
        if (!this.isKnobIn) {
          this.isPaletteIn = false;
        }
      },
    },
    beforeDestroy() {
      this.rcp.destroy();
      this.rcp = null;
    },
  };
</script>

<style scoped src="./_colorPick.scss" lang="scss">
</style>
