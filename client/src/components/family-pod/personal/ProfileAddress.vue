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
            @input="addressInput"
            @error="searchInput = ''"
            v-model="selectedSuggestion"
            @clear="selectedSuggestion = null"
          ></tomtom-autocomplete>
        </q-card-section>
      </template>
    </q-slide-transition>
    <q-card-section>
      <default-list
        :items="form[this.path]"
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
  import {models} from 'feathers-vuex';
  import DefaultList from './DefaultList';
  import TomtomAutocomplete from '../../utils/mapbox/tomtom/TomtomAutocomplete';

  export default {
    name: 'ProfileAddress',
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
    mounted() {
      this.form = new models.api[this.subject]().clone();
    },
    data() {
      return {
        adding: null,
        form: {}
      };
    },
    watch: {
      // value: {
      //   immediate: true,
      //   handler(newVal){
      //     if(newVal?.length){
      //       this.form.addresses = newVal
      //     }
      //   }
      // },
      subjectIn: {
        immediate: true,
        handler(newVal) {
          if (newVal?._id) {
            this.form = new models.api[this.subject](newVal).clone();
          }
        }
      },
      methods: {
        addressInput(val) {
          if (val.formatted) {
            if (!this.form[this.path].map(a => a.formatted).includes(val.formatted)) {
              if (!this.lget(this.subjectIn, 'defaultAddress', null)) this.$setDefaultProfileItem(this.subjectIn, 'address', val);
              this.form[this.path].push(val);
              this.$emit('input', this.form.email);
              this.form.save()
                .then(() => {
                  this.$q.notify({message: 'Address added to profile', color: 'info'});
                }).catch(err => this.$errNotify(err.message));
            }
          }
          console.log('got new address', val);
        }
      }
    }
  };
</script>
