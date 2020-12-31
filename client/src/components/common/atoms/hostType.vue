<template>
  <div>
    <q-icon v-if="hostType === 'app'" name="widgets" color="accent" size="2em">
      <q-tooltip>
        App
      </q-tooltip>
    </q-icon>
    <q-icon v-if="hostType === 'organization'" name="business" color="accent" size="2em">
      <q-tooltip>
        Organization
      </q-tooltip>
    </q-icon>
    <q-icon v-if="hostType === 'project'" name="construction" color="accent" size="2em">
      <q-tooltip>
        Project
      </q-tooltip>
    </q-icon>
    <q-spinner v-if="hostType === 'Loading'"
      color="primary"
      size="2em"
    />
  </div>
</template>

<script>
  export default {
    name: 'hostType',
    props: {
      hostType: {type: String, default: 'Loading'},
    }
  };
</script>

<style scoped>

</style>
