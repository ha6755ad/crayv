<template>
  <div>
    <q-checkbox color="nice" @input="$emit('input', form)" label="Track Inventory" v-model="form.trackInventory"></q-checkbox>
  </div>
</template>

<script>
  export default {
    name: 'TaxSettings',
    props: {
      value: Object
    },
    data(){
      return {
        form: {}
      };
    },
    watch: {
      value: {
        immediate: true,
        deep: true,
        handler(newVal){
          if(newVal) {
            Object.assign(this.form, Object.assign({}, newVal));
          }
        }
      }
    }
  };
</script>

<style scoped lang="scss">

</style>
