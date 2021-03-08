<template>
  <q-item clickable @click="$emit('input')">
    <q-item-section avatar>
      <q-btn dense flat :icon="icon" :size="size" :color="color"></q-btn>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
  export default {
    name: 'AddListItem',
    props: {
      size: {
        type: String,
        default: 'xs'
      },
      color: {
        type: String,
        default: 'dark'
      },
      title: {
        type: String,
        defulat: 'Add New'
      },
      icon: {
        type: String,
        default: 'mdi-plus-circle'
      }
    }
  };
</script>
