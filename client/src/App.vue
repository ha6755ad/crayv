<template>
  <div id="q-app">
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: 'App',
    data() {
      return {};
    },
    watch: {
      stateUser: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // console.log('user', newVal);
          let theme = this.$lget(newVal, 'theme');
          if (theme) {
            Object.keys(theme).forEach(k => {
              if (theme[k]) {
                this.$setCssVar(k, theme[k]);
              }
            });
          }
        }
      },
    },
    computed: {
      ...mapGetters('auth', {
        stateUser: 'user'
      }),
    },
    methods: {}
  };
</script>
