<template>
  <q-btn v-if="value && value._id" flat size="sm" color="negative" dense icon="mdi-delete" @click="rmvItem"></q-btn>
</template>

<script>
  export default {
    name: 'RemoveButton',
    props: {
      service: String,
      value: Object,
      title: String,
      message: String,
      namePath: { type: String, default: 'name' }
    },
    methods: {
      rmvItem() {
        this.$q.dialog({
          title: this.title ? this.title : `Remove ${this.value[this.namePath]}?`,
          message: this.message,
          ok: {
            size: 'sm',
            label: 'Remove',
            color: 'positive',
            push: true
          },
          cancel: {
            size: 'sm',
            label: 'go back',
            color: 'negative',
            flat: true
          }
        }).onOk(() => {
          this.$store.dispatch(`${this.service}/remove`, this.value._id)
            .then(() => {
              this.$successNotify('Na na na na, na na na na, hey hey hey - goodbye');
            })
            .catch(err => {
              this.$errNotify(err.message);
            });
        });
      }
    }
  };
</script>

<style scoped>

</style>
