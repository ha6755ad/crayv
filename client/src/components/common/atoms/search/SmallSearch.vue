<template>
  <div class="fill_size">
    <div class="text-sm text-mb-sm text-weight-medium">{{title}}</div>
    <div class="text-xs text-mb-xs text-weight-light">{{caption}}</div>
    <q-separator/>
    <div class="row q-py-md bg-background" v-if="gridView">
      <div :class="`col-${cols} col-sm-${sm} col-md-${md} col-lg-${lg} col-xl-${xl} q-pa-sm`" v-for="(item, i) in items" :key="`item-${i}`">
        <slot name="card" :item="item"></slot>
      </div>
    </div>

    <q-list style="padding: 0" class="bg-white q-py-md" v-else separator>
      <q-item style="padding: 0" v-for="(item, i) in items" :key="`item-${i}`" clickable>
        <slot name="card" :item="item"></slot>
      </q-item>
    </q-list>
  </div>
</template>

<script>
  export default {
    name: 'SmallSearch',
    props: {
      items: {
        type: Array,
        default: () => {
          return [];
        }
      },
      gridView: Boolean,
      title: String,
      caption: String,
      cols: { type: Number, default: 12 },
      sm: { type: Number, default: 6 },
      md: { type: Number, default: 6 },
      lg: { type: Number, default: 6 },
      xl: { type: Number, default: 6 },
    }
  };
</script>
