<template>
  <div id="CardDetails" class="col-6">
    <div class="row justify-between">
      <div class="text-h5">
        Card Details:
      </div>
      <q-space />
      <div>
        Add A Card <span><q-btn @click.stop="$emit('add')" icon="mdi-plus" flat/></span>
      </div>
    </div>
    <div>
      <div v-if="cards.length">
        <div v-for="card in cards" :key="`parent${card.id}`">
          <div :key="`child${card.id}`">
            {{card.brand}}: <span class="q-mx-xs">XXXXXX{{card.last4}}</span> Exp: {{card.exp_year}}
          </div>
          <q-separator class="q-my-xs" style="width: 50%" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CardDetails',
    props: {
      cards: Array
    },
    data() {
      return {};
    },
    mounted() {},
    watch: {},
    computed: {},
    methods: {}
  };
</script>

<style scoped lang="scss">
  #CardDetails {
    width: 45%;
  }
</style>
