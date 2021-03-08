<template>
  <q-list separator>
    <template v-if="productsIn.length">
    <template v-for="(item, i) in productsIn">
      <q-item :key="`product-${i}`" clickable @click="$emit('select', item)">
        <q-item-section avatar>
          <q-avatar>
            <img :src="getAvatar(item, 'images', 'large', 0)">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label :class="`text-${activeIds.includes(item._id) ? 'accent' : ''}`">{{item.name}}</q-item-label>
          <q-item-label caption>{{$dollarString(lget(item, 'price.basePrice'), $getCurrencyPrefix(lget(item, 'price.currency')), 2)}}}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon :name="activeIds.includes(item._id) ? 'mdi-check-box-outline' : 'mdi-checkbox-blank-outline'" color="primary"/>
        </q-item-section>
      </q-item>
    </template>
    <q-item v-if="productPaginate < productsIn.length">
      <div class="row justify-end">
        <q-btn label="show more" size="sm" flat @click="$emit('paginate')"/>
      </div>
    </q-item>
    </template>
    <template v-else>
      <q-card style="height: 250px" flat class="flex flex-center text-xs text-mb-xs text-weight-bold">
        <span>No Products - <q-btn @click="$emit('input')" flat label="Add Some"/></span>
      </q-card>
    </template>
  </q-list>
</template>

<script>
  export default {
    name: 'ProductPicker',
    props: {
      productsIn: Array,
      activeIds: Array,
      productPaginate: {
        type: Number,
        default: 10
      }
    }
  };
</script>
