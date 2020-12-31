
export const findCarts = {
  watch: {
    user: {
      immediate: true,
      handler(newVal, oldVal) {
        let newId = JSON.stringify(this.lget(newVal, '_id', 0));
        let oldId = JSON.stringify(this.lget(oldVal, '_id', 1));
        if (newId && newId !== oldId) {
          this.$store.dispatch('carts/find', {
            query: {
              person: newVal,
              active: true
            },
            '$populateParams': {
              name: 'withLines'
            }
          });
        }
      }
    }
  }
};
