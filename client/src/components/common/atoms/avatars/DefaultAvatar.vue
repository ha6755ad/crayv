<template>
  <q-avatar :square="square" :size="sizeIn" :class="`${avatar ? 'bg-transparent' : dark ? bgIn ? 'bg-' + bgIn + ' text-dark' : 'bg-light' + ' text-dark' : bgIn ? 'bg-' + bgIn + ' text-light' : 'bg-dark' + ' text-light'}`" :style="{borderRadius: square ? '4px' : '', boxShadow: bordered ? `0 0 0 3px ${bgIn ? 'var(--q-color-' + bgIn + ')' : dark ? '#fafafa' : '#101010'}` : 'none'}">
    <template v-if="avatar" >
      <img :src="avatar">
    </template>
    <template v-else-if="icon">
      <span>
      <q-icon :name="icon" :size="(parseFloat(sizeIn ? sizeIn : 60) / 1.5) + 'px'" :color="dark ? 'light' : ''"></q-icon>
      </span>
    </template>
    <template v-else>
      <span>{{lget(value, namePath, lget(value, backupNamePath, '!')).charAt(0)}}</span>
    </template>
    <slot name="menu"></slot>
  </q-avatar>
</template>

<script>
  export default {
    name: 'DefaultAvatar',
    props: {
      defaultAvatar: String,
      square: Boolean,
      namePath: {
        type: String,
        default: 'name'
      },
      backupNamePath: {
        type: String,
        default: 'username'
      },
      icon: String,
      avatarPath: {
        type: String,
        default: 'avatar'
      },
      dark: Boolean,
      sizeIn: String,
      value: Object,
      bgIn: String,
      bordered: Boolean
    },
    computed: {
      avatar(){
        if(Array.isArray(this.lget(this.value, this.avatarPath))){
          return this.getAvatar(this.value,  this.avatarPath, 'small', 0, this.defaultAvatar);
        } else {
          return this.getAvatar(this.value, this.avatarPath, 'small', null, this.defaultAvatar);
        }
      }
    }
  };
</script>
