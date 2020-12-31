<template>
  <div style="width: 100%">
    <q-input :dense="dense" rounded :outlined="outlined" @keyup.enter="$emit('search', value)" @input="$emit('input', $event)" :value="value" :label="label" :placeholder="placeholder" clearable @clear="$emit('clear')">
      <template v-slot:prepend>
        <q-btn style="transition: all .4s ease-out" round :flat="!value || !value.length" :color="color" @click="$emit('search', value)" :push="value && typeof value !== 'undefined'" icon="mdi-magnify"/>
      </template>
    </q-input>
  </div>
</template>

<script>
  export default {
    name: 'SearchItem',
    props: {
      dense: Boolean,
      label: String,
      outlined: {
        type: Boolean,
        default: true
      },
      value: String,
      color: {
        type: String,
        default: 'dark'
      },
      placeholder: {
        type: String,
        default: 'Search...'
      }
    }
  };
</script>
