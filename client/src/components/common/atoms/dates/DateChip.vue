<template>
  <div :class="`flex items-center q-px-${hideText ? 'xs' : 'sm'} q-py-${hideText ? 'xs' : 'sm'} bg-${dark ? 'dark' : 'light'}`" :style="`border-radius:${borderRadius}; box-shadow:${boxShadow}; position: relative`">
    <div :style="{ height: size, width: size, borderRadius: '3px', display: 'flex', flexDirection: 'column', alignItems: 'flex-center' }" :class="`${dark ? bgIn ? 'bg-' + bgIn + ' text-dark' : 'bg-light' + ' text-dark' : bgIn ? 'bg-' + bgIn + ' text-light' : 'bg-dark' + ' text-light'} flex flex-center`"
    >
      <div>
      <div class="row justify-center items-center" style="font-size: .6rem">{{month}}</div>
      <div class="row justify-center items-center text-weight-bold" style="font-size: .8rem">{{day}}</div>
      </div>
    </div>
    <div v-if="!hideText" :class="textClass">{{date}}</div>
    <div class="t-r-a close_btn pointer flex flex-center bg-shade-4 text-white" v-if="removable" @click="$emit('remove', value)">
      <q-icon size="14px" color="white" name="mdi-close"></q-icon>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      removable: Boolean,
      dark: Boolean,
      bgIn: String,
      sizeIn: String,
      borderRadius: {
        type: String,
        default: '5px'
      },
      boxShadow: {
        type: String,
        default: '1px 1px 4px rgba(0,0,0,.4)'
      },
      hideText: Boolean,
      textClass: {
        type: String,
        default: 'text-xxs text-mb-xxs text-weight-medium q-ml-sm'
      },
      value: Date,
      format: {
        type: String,
        default: 'MMM DD, YYYY'
      }
    },
    computed: {
      size(){
        return this.sizeIn ? this.sizeIn : '40px';
      },
      month(){
        return this.getDateFormat(this.value, 'MMM');
      },
      day(){
        return this.getDateFormat(this.value, 'D');
      },
      date(){
        return this.getDateFormat(this.value, this.format);
      }
    }
  };
</script>

<style scoped lang="scss">
  .close_btn {
    height: 20px;
    width: 20px;
    border-radius: 10px;
  }
</style>
