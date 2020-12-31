<template>
  <div class="col-12 q-pa-sm" style="border: 1px solid black;">
    <q-select v-model="icon_set" label="Icon Set" :options="icon_options" class="q-mx-md"/>
    <q-input v-model="filter" label="Search Icons..." outlined clearable class="q-ma-md" />
    <q-icon-picker
      @input="$emit('input', $event)"
      v-model="value"
      :icon-set="icon_set"
      :filter="filter"
      :pagination.sync="pagination"
      style="height: 220px;"
    />
  </div>
</template>

<script>
  export default {
    name: 'iconPicker',
    data(){
      return {
        icon_set: 'mdi-v5',
        icon_options: [
          'ionicons-v4',
          'fontawesome-v5',
          'eva-icons',
          'themify',
          'line-awesome',
          'mdi-v5',
          'material-icons',
          'material-icons-outlined',
          'material-icons-round',
          'material-icons-sharp'
        ],
        value: '',
        filter: '',
        pagination: {
          itemsPerPage: 60,
          page: 0
        }
      };
    },
  };
</script>

<style scoped>

</style>
