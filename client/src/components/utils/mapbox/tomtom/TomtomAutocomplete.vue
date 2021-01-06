<template>
  <div>
    <!--    <FeathersVuexFind service="places-query-auto-complete" :query="{input: input}" watch="query"-->
    <!--                      :queryWhen="() => (input && input.length > 3)">-->
    <!--      <section class="admin-categories" slot-scope="{ items: addresses }">-->

    <div>
      <q-select
        ref="addressSelect"
        :label="label"
        :placeholder="normalizedAddress ? '' : placeholder"
        borderless
        :style="{ ...{'max-width': '90vw', width: '100%'}, ...$attrs.inputStyle }"
        hide-bottom-space
        :bg-color="$attrs.bgColor ? $attrs.bgColor : 'white'"
        :options="options"
        :outlined="outlined"
        clearable
        @clear="normalizedAddress = null"
        :dark="dark"
        use-input
        :value="normalizedAddress ? normalizedAddress.formatted : null"
        @input-value="setInput"
        @input="geocode"
      >
        <template v-slot:option="{opt, toggleOption}">
          <q-item clickable @click="toggleOption(opt)">
            <q-item-section>
              <q-item-label>{{opt && opt.address ? opt.address.freeformAddress : ''}}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <!--      </section>-->
    <!--    </FeathersVuexFind>-->
  </div>
</template>

<script>
  import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';

  export default {
    name: 'TomtomAutocomplete',
    props: {
      dark: Boolean,
      label: String,
      placeholder: {
        type: String,
        required: false,
        default: 'Enter your address (ex. 123 N Main St, City, ZZ 12345)...'
      },
      value: [String, Object, Array, Number],
      solo: Boolean,
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
      outlined: Boolean,
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
        options: [null],
        geoLoading: false,
        addresses: [],
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
          tomtomAddress: {}
        }
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal) {
          if (newVal && newVal.formatted) {
            this.normalizedAddress = newVal;
          }
        }
      },
      options: {
        immediate: true,
        handler(newVal) {
          if (newVal.length) {
            //eslint-disable-next-line-no-console
            console.log('got new length', this.$refs.addressSelect.isOptionSelected('2'));
            // this.$refs.addressSelect.showPopup()
            this.$refs.addressSelect.focus();
          }
        }
      }
    },
    computed: {
      // ...mapState('tomtom-autocomplete', {placeloading: 'isFindPending'}),
      ...mapState('tomtom-geocode', { geoloading: 'isFindPending' }),
      ...mapGetters('tomtom-geocode', { addresses: 'list' }),
      loading() {
        return this.placeloading || this.geoloading;
      },
      addressList() {
        return this.addresses.map(a => a.address.freeformAddress);
      }
    },
    methods: {
      ...mapMutations('tomtom-geocode', { clearAddresses: 'clearAll' }),
      // ...mapActions('tomtom-autocomplete', {findAddresses: 'find'}),
      ...mapActions('tomtom-geocode', { findgeocoded: 'find' }),
      // eslint-disable-next-line no-unused-vars
      async setInput(val) {
        this.input = val;
        if (val && val.length % this.search_every_num === 0) {
          // eslint-disable-next-line no-console
          // console.log('setting in put', val)
          await this.clearAddresses();
          this.findgeocoded({
            query: {
              text: this.input
            },
          }).then(res => {
            // console.log('tom-tom-res', res)
            if (res && res.data?.length) {
              this.options = res.data;
            }
          }).catch(err => {
            this.$errNotify(err.message);
            // console.log('tomtom-autocomplete >> set input err', err);
          });
          //eslint-disable-next-line-no-console
          // console.log('setInput input', '>' + this.input + '<');
        }
      },

      geocode(val) {
        // TODO: need to parse formated_adress by name and not index ...

        let mappedAddress = val ? val : null;
        if (mappedAddress) {
          this.normalizedAddress = {
            uuid: this.uuid(),
            formatted: val.address.freeformAddress,
            address1: val.address.streetNumber + ' ' + val.address.streetName,
            region: val.address.countrySubdivision,
            city: val.address.countrySecondarySubdivision,
            postal: val.address.postalCode,
            country: val.address.country,
            latitude: val.position.lat,
            longitude: val.position.lon,
            tomtomAddress: val.address
          };
        }
        this.$emit('input', this.normalizedAddress);
        // // eslint-disable-next-line no-console
        // console.log(response)
        // }).catch(err => {
        //   this.$emit('error', err);
        // });

      }
    }
  };
</script>

<style scoped>

</style>
