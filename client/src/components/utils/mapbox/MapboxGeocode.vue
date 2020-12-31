<template>
  <div>
    <!--    <FeathersVuexFind service="places-query-auto-complete" :query="{input: input}" watch="query"-->
    <!--                      :queryWhen="() => (input && input.length > 3)">-->
    <!--      <section class="admin-categories" slot-scope="{ items: addresses }">-->

        <div>
          <v-autocomplete :items="addresses"
                          :chips="chips"
                          :outlined="outlined"
                          :placeholder="placeholder"
                          :deletable-chips="deletable_chips"
                          :rounded="rounded"
                          :clearable="clearable"
                          :item-text="item_text"
                          :no-filter="no_filter"
                          @input.native="setInput"
                          :loading="loading"
                          :autocomplete="autocomplete"
                          @change="$emit('input', $event)"></v-autocomplete>
        </div>

    <!--      </section>-->
    <!--    </FeathersVuexFind>-->
  </div>
</template>

<script>
  import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';

  export default {
    name: 'geocode',
    props: {
      placeholder: {
        type: String,
        required: false,
        default: 'Enter your address (ex. 123 N Main St, City, ZZ 12345)...'
      },
      rounded: {
        type: Boolean,
        required: false,
        default: true
      },
      deletable_chips: {
        type: Boolean,
        default: true
      },
      chips: {
        type: Boolean,
        default: true
      },
      outlined: {
        type: Boolean,
        default: true
      },
      clearable: {
        type: Boolean,
        default: true
      },
      no_filter: {
        type: Boolean,
        default: true
      },
      autocomplete: {
        type: String,
        default: 'off'
      },
      item_text: {
        type: String,
        default: 'description'
      },
      search_every_num: {
        type: Number,
        default: 2
      },
    },
    data() {
      return {
        input: null,
      };
    },
    computed: {
      ...mapState('geocode', {loading: 'isFindPending'}),
      ...mapGetters('geocode', {addresses: 'list'}),
    },
    methods: {
      ...mapMutations('geocode', {clearAddresses: 'clearAll'}),
      ...mapActions('geocode', {findAddresses: 'find'}),
      // eslint-disable-next-line no-unused-vars
      async setInput(e) {
        this.input = e.target.value;
        if (this.input && this.input.length % this.search_every_num === 0) {
          await this.clearAddresses();
          this.findAddresses({
            query: {
              input: this.input, sessiontoken: 'geocode'
            }
          });
          this.$log.info('setInput input', '>' + this.input + '<');
        }
      }
    }
  };
</script>

<style scoped>

</style>
