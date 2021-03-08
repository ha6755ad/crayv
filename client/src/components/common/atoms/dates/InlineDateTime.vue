<template>
  <div class="flex items-center">
    <div class="q-px-sm">
      <inline-date :label="dateLabel" :value="value" @input="handleDate"></inline-date>
    </div>
    <div class="q-px-sm">
      <inline-time label="@ (time)" :value="value" @input="handleDate"></inline-time>
    </div>
  </div>
</template>

<script>
  import InlineDate from './InlineDate';
  import InlineTime from './InlineTime';
  export default {
    name: 'InlineDateTime',
    components: { InlineTime, InlineDate },
    props: {
      dateLabel: { type: String, default: 'From (date)'},
      value: [Date, String]
    },
    methods: {
      handleDate(val){
        console.log('handling date', val);
        this.$emit('input', val);
      }
    }
  };
</script>

<style scoped>

</style>
