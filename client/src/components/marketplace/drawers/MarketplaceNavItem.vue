<template>
  <q-item  clickable @click="$emit('input', value)">
    <q-item-section avatar>
      <!--            <q-btn push dense style="background: linear-gradient(16deg, var(&#45;&#45;q-color-primary), var(&#45;&#45;q-color-nice))">-->
      <div
        :style="{
              height: '36px',
              width: '36px',
              borderRadius: '30%',
              transition: 'all .4s ease-out',
              background: !value.active ? null : 'linear-gradient(166deg, var(--q-color-primary), var(--q-color-secondary))',
              boxShadow: value.active ? '0 0 8px rgba(0,0,0,.25)' : null
            }"
        class="q-pa-xs"
      >
        <component
          :color1="value.active ? 'white' : 'var(--q-color-primary)'"
          :color2="value.active ? 'white' : 'var(--q-color-primary)'"
          :color3="value.active ? 'white' : 'var(--q-color-secondary)'"
          :color4="value.active ? 'white' : 'var(--q-color-secondary)'"
          :is="value.iconComponent"
        ></component>
      </div>
      <!--            </q-btn>-->
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-weight-bold">{{ value.label }}</q-item-label>
      <q-item-label caption>{{ value.caption }}</q-item-label>
    </q-item-section>
    <q-item-section side v-if="$scopedSlots.side">
      <slot name="side"></slot>
    </q-item-section>
    <q-menu v-if="$scopedSlots.menu">
      <slot name="menu"></slot>
    </q-menu>
  </q-item>
</template>

<script>
  export default {
    name: 'MarketplaceNavItem',
    props: {
      value: Object
    }
  };
</script>

<style scoped>

</style>
