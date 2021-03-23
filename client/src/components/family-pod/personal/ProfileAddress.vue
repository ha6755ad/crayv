<template>
  <q-card>
    <q-card-section>
      <div class="row text-xxs text-mb-xs text-weight-light">Addresses
        <q-space/>
        <q-btn v-if="adding !== 'address'" size="sm" icon="mdi-plus" label="add address" flat
               @click="adding = 'address'"/>
      </div>
    </q-card-section>
    <q-slide-transition>
      <template v-if="adding === 'address'">
        <q-card-section>
          <tomtom-autocomplete
            item_text="formatted"
            outlined
            @input="handleInput"
            @error="searchInput = ''"
            v-model="selectedSuggestion"
            @clear="selectedSuggestion = null"
          ></tomtom-autocomplete>
        </q-card-section>
      </template>
    </q-slide-transition>
    <q-card-section>
      <default-list
        :items="form[path]"
        title="address"
        default-path="uuid"
        :default-id="lget(form, 'settings.defaults.address.uuid', null)"
        item-label="formatted"
        @rmv="$rmvProfileItem(form, $event, 'addresses', 'address')"
        @itemClick="$setDefaultProfileItem(form, 'address', ...arguments)"
      ></default-list>
    </q-card-section>
  </q-card>
</template>

<script>
  import DefaultList from './DefaultList';
  import TomtomAutocomplete from '../../utils/mapbox/tomtom/TomtomAutocomplete';
  import {SelectMixin} from 'src/mixins/SelectMixin';

  export default {
    name: 'ProfileAddress',
    mixins: [SelectMixin],
    components: {TomtomAutocomplete, DefaultList},
    props: {
      path: {
        type: String,
        default: 'addresses'
      },
      subject: {
        type: String,
        default: 'Users'
      },
      subjectIn: Object,
      value: Array
    },

    data() {
      return {
        adding: null,
      };
    },
    watch: {

      methods: {

      }
    }
  };
</script>
