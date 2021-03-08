<template>
  <q-card flat color="bg-transparent">
    <div class="row text-xs text-mb-xs text-weight-light">Event Channels</div>
<!--    <channel-picker :communities-in="communitiesIn" :multiple="true" @input="$emit('input', $event)" :value="value"/>-->
  </q-card>
</template>

<script>
  export default {
    name: 'EventInvite',
    components: { },
    props: {
      eventIn: Object,
      communitiesIn: Array,
      value: Array
    },
  };
</script>
