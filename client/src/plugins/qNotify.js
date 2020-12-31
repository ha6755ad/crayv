// ir-chat
const qNotify = {
  install(Vue) {
    Vue.mixin({
      methods: {
        $qNotify(message, type, timeout, actions) {
          this.$q.notify({
            type: type ?? 'negative',
            message: message ?? 'No message provided.',
            timeout: timeout ?? 5000,
            actions: actions ?? [{
              icon: 'close', color: 'white', handler: () => {
                /* ... */
              }
            }]
          });
        }
      }
    });
  }

};

export default qNotify;
