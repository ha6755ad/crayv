<template>
  <div :id="idIn" class="__scroll_sensor">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      idIn: {
        required: true
      },
      value: Number
    },
    data() {
      return {
        height: 0
      };
    },
    watch: {
      idIn: {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal && newVal !== oldVal) {
            const addListener = (elIn, val) => {
              elIn.addEventListener('scroll', () => {
                let elem = document.getElementById(val);
                let height = elem.getBoundingClientRect().height;
                let top = elem.scrollTop;
                if (top > height - 3 && height > this.height) {
                  this.$emit('input', Math.max(this.value, 0) + 1);
                }
              });
            };
            let el = document.getElementById(newVal);
            if (el) {
              addListener(el, newVal);
            } else {
              setTimeout(() => {
                if (el) {
                  addListener(el, newVal);
                }
              }, 1000);
            }
          }
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .__scroll_sensor {
    height: 100%;
    width: 100%;
    position: relative;
    overflow-y: scroll;
  }
</style>
