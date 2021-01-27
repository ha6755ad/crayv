<template>
  <q-page>
    <router-view></router-view>
  </q-page>
</template>

<script>
  export default {
    name: 'CrayvClassifieds',
    components: {},
    data(){
      return {
        addDialog: false,
        selected: null
      };
    },
    computed: {

    }
  };
</script>

<style scoped>

</style>
