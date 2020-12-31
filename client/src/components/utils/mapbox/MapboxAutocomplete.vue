<template>
  <div>
    <!--    <FeathersVuexFind service="places-query-auto-complete" :query="{input: input}" watch="query"-->
    <!--                      :queryWhen="() => (input && input.length > 3)">-->
    <!--      <section class="admin-categories" slot-scope="{ items: addresses }">-->

    <div>
      <q-select
        ref="addressSelect"
        color="primary"
        :label="$attrs.label ? $attrs.label : 'Start typing to search...'"
        borderless
        :style="{ ...{'max-width': '90vw', width: '100%'}, ...$attrs.inputStyle }"
        hide-bottom-space
        :bg-color="'white'"
        :options="options"
        :outlined="outlined"
        :rounded="rounded"
        :clearable="clearable"
        :dark="dark"
        use-input
        :value="normalizedAddress.formatted"
        @input-value="setInput"
        @input="geocode"
      />
    </div>

    <!--      </section>-->
    <!--    </FeathersVuexFind>-->
  </div>
</template>

<script>
  import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';

  export default {
    name: 'MapboxAutocomplete',
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
      optionLabel: {
        type: String,
        default: 'description'
      },
      search_every_num: {
        type: Number,
        default: 2
      },
      address_format: {
        type: String,
        default: 'short_name',
        validator: value => ['long_name', 'short_name'].indexOf(value) >= 0
      },
    },
    data() {
      return {
        input: null,
        obj: null,
        normalizedAddress: {
          formatted: '',
          address1: '',
          address2: '',
          region: '',
          city: '',
          postal: '',
          country: '',
          latitude: null,
          longitude: null,
          mapboxAddress: {}
        }
      };
    },
    computed: {
      ...mapState('mapbox-autocomplete', {placeloading: 'isFindPending'}),
      ...mapState('mapbox-geocode', {geoloading: 'isFindPending'}),
      ...mapGetters('mapbox-geocode', {addresses: 'list'}),
      loading() {
        return this.placeloading || this.geoloading;
      },
      addressList(){
        return this.addresses.map(a => a.address.freeformAddress);
      }
    },
    methods: {
      ...mapMutations('mapbox-geocode', {clearAddresses: 'clearAll'}),
      ...mapActions('mapbox-autocomplete', {findAddresses: 'find'}),
      ...mapActions('mapbox-geocode', {findgeocoded: 'find'}),
      // eslint-disable-next-line no-unused-vars
      async setInput(e) {
        this.input = e.target.value;
        if (this.input && this.input.length % this.search_every_num === 0) {
          // eslint-disable-next-line no-console
          await this.clearAddresses();
          this.findgeocoded({
            query: this.input,
          });
          this.$log.info('setInput input', '>' + this.input + '<');
        }
      },

      geocode(val) {
        // TODO: need to parse formated_adress by name and not index ...
        //   _.each(address_components, function(k, v1) {
        //   _.each(address_components[v1].types, function(k2, v2){
        //     components[address_components[v1].types[v2]] = address_components[v1].long_name
        //   });
        // });
        // eslint-disable-next-line no-console
        console.log('val:', val);
        this.findgeocoded({
          query: val,
        }).then(response => {
          let mappedAddress = response ? response.results : null;
          if (mappedAddress) {
            this.normalizedAddress = {
              formatted: mappedAddress[0].address.freeformAddress,
              address1: mappedAddress[0].address.streetNumber + ' ' + mappedAddress[0].address.streetName,
              region: mappedAddress[0].address.countrySubdivision,
              city: mappedAddress[0].address.countrySecondarySubdivision,
              postal: mappedAddress[0].address.postalCode,
              country: mappedAddress[0].address.country,
              latitude: mappedAddress[0].position.lat,
              longitude: response.data[0].position.lon,
              mapboxAddress: response.data[0].address
            };
          }
          this.$emit('input', this.normalizedAddress);
        // // eslint-disable-next-line no-console
        // console.log(response)
        }).catch(err => {
          this.$emit('error', err);
        });

      }
    }
  };
</script>

<style scoped>

</style>
