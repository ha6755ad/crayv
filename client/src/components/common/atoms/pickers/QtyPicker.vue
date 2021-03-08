<template>
  <div class="__picker text-xxxs text-mb-xxxs">
    <span> Qty: {{value}} <q-icon name="mdi-menu-down" size="10px" class="q-ml-xs"/> </span>
    <q-menu>
      <q-list separator>
      <q-item v-for="i in 100 * hundreds" :key="i" clickable @click="$emit('input', i)">
        <div class="row justify-center" style="width: 30px">{{i}}</div>
      </q-item>
        <q-item clickable @click="hundreds++">
          <div class="row text-italic" style="width: 30px">
            <q-btn dense flat size="xs" label="more" icon="mdi-plus"/>
          </div>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script>
  export default {
    name: 'QtyPicker',
    props: {
      value: Number
    },
    data(){
      return {
        hundreds: 1
      };
    }
  };
</script>

<style scoped lang="scss">
  .__picker {
    padding: 3px;
    background: #eeeeee;
    box-shadow: 0 0 2px 1px rgba(0,0,0,.6);
    border-radius: 2px;
  }
</style>
