<template>
  <div>
    <div
      class="bg-white"
      :style="{
      transition: 'all .15s',
      width: '60px',
      borderRadius: menu ? '5px 5px 0 0' : '5px',
      transform: menu ? 'translate(0, 2px)' : null,
      border: 'solid 1px rgba(0,0,0,.4)',
      borderBottom: menu ? 'none' : 'solid 1px rgba(0,0,0,.4)'
    }">
      <q-btn @click="menu = !menu" :icon-right="`mdi-menu-${menu ? 'up' : 'down'}`" dense flat
             icon="mdi-filter-variant"></q-btn>
    </div>
    <q-slide-transition>
      <div class="q-pa-sm" v-if="menu" style="border: solid 1px rgba(0,0,0,.4); border-radius: 0 8px 8px 8px">
       <slot name="top"></slot>
        <div class="row justify-center q-my-sm">
          <q-input style="width: 100%" @input="$emit('input', $event)" :value="value" :placeholder="placeholder" rounded filled>
            <template v-slot:prepend>
              <q-icon name="mdi-magnify"></q-icon>
            </template>
          </q-input>
        </div>
        <slot name="bottom"></slot>
      </div>
    </q-slide-transition>
  </div>
</template>

<script>
  export default {
    name: 'TopFilter',
    props: {
      placeholder: { type: String },
      value: String
    },
    data() {
      return {
        menu: true,
      };
    },
  };
</script>

<style scoped>

</style>
