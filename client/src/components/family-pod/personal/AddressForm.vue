<template>
  <div>
    <div class="q-pa-md text-xxs text-mb-xxs text-weight-bold">{{title}}</div>
    <q-list separator :dense="dense">
      <q-slide-transition>
        <div v-if="adding">
          <tomtom-autocomplete
            dense
            placeholder="Start Typing..."
            item_text="formatted"
            @input="addAddress"
            @error="searchInput = ''"
            @clear="selectedSuggestion = null"
          ></tomtom-autocomplete>
        </div>
      </q-slide-transition>
      <q-item dense clickable @click="adding = !adding">
        <q-item-section avatar>
          <q-btn size="sm" round flat icon="mdi-plus"></q-btn>
        </q-item-section>
        <q-item-section class="q-pa-sm text-xxs text-mb-xxs text-italic">
          Add New
        </q-item-section>
      </q-item>
      <q-item v-for="(item, i) in activeItems" :key="`address-${i}`" clickable @click="$emit('add', item)">
        <q-item-section avatar>
          <q-icon name="mdi-map-marker"></q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{item[optionValue]}}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn size="sm" icon="mdi-delete" dense flat @click="removeItem(i, item)"></q-btn>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
  import {SelectMixin} from 'src/mixins/SelectMixin';
  import TomtomAutocomplete from 'components/utils/mapbox/tomtom/TomtomAutocomplete';

  export default {
    name: 'AddressForm',
    components: { TomtomAutocomplete },
    mixins: [SelectMixin],
    props: {
      title: { type: String, default: 'Address' },
      emitValue: Boolean,
      optionValue: { type: String, default: 'formatted' },
      multiple: Boolean,
      dense: Boolean,
      value: [Object, Array]
    },
    data(){
      return {
        adding: false
      };
    },
    methods: {
      addAddress(val){
        this.adding = false;
        this.handleInput(val);
      },
    }
  };
</script>

<style scoped>

</style>
