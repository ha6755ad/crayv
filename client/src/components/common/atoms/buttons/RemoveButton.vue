<template>
  <q-btn v-if="value && value._id" flat :size="size" :color="color" :dense="dense" icon="mdi-delete" @click="rmvItem" :label="label"></q-btn>
</template>

<script>
  export default {
    name: 'RemoveButton',
    props: {
      color: { type: String, default: 'negative' },
      label: String,
      service: String,
      value: Object,
      title: String,
      message: String,
      size: {type: String, default: 'sm'},
      dense: Boolean,
      namePath: { type: String, default: 'name' },
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
