<template>

    <div style="width: 100%;">
      <q-select
        :input-class="inputClass"
        :behavior="behavior"
        :dense="dense"
        ref="addressSelect"
        :label="label"
        :placeholder="normalizedAddress && normalizedAddress[displayPath] ? '' : placeholder"
        :style="{ ...{'max-width': '90vw', width: '100%'}, ...$attrs.inputStyle }"
        hide-bottom-space
        :bg-color="$attrs.bgColor ? $attrs.bgColor : 'white'"
        :options="options"
        :outlined="outlined"
        :hint="hint"
        clearable
        @clear="normalizedAddress = null, $emit('clear')"
        :dark="dark"
        use-input
        :value="normalizedAddress ? normalizedAddress[displayPath] : null"
        @input-value="setInput"
        @input="geocode"
      >
        <template v-slot:prepend>
          <slot name="prepend"></slot>
        </template>
        <template v-slot:selected-item="scope" v-if="chips">
          <q-chip icon="mdi-map-marker" v-show="scope.opt" square dark :label="scope.opt" removable @remove="removeAddress"></q-chip>
        </template>
        <template v-slot:append>
          <q-spinner size="30px" v-if="loading"></q-spinner>
        </template>
        <template v-slot:option="{opt, toggleOption}">
          <q-item clickable @click="toggleOption(opt)">
            <q-item-section>
              <q-item-label>{{opt && opt.address ? opt.address.freeformAddress : ''}}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

</template>

<script>
  import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';

  const defaultAddress = () => {
    return {
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
    };
  };

  export default {
    name: 'TomtomAutocomplete',
    props: {
      inputClass: String,
      behavior: { type: String, default: 'menu' },
      dense: Boolean,
      dark: Boolean,
      label: String,
      hint: String,
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
      displayPath: { type: String, default: 'formatted' },
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
        normalizedAddress: defaultAddress()
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

            // this.$refs.addressSelect.showPopup()
            this.lget(this.$refs, 'addressSelect') ? this.$refs.addressSelect.focus() : '';
          }
        }
      }
    },
    computed: {
      // ...mapState('tomtom-autocomplete', {placeloading: 'isFindPending'}),
      ...mapState('tomtom-geocode', { geoloading: 'isFindPending' }),
      ...mapGetters('tomtom-geocode', { stateAddresses: 'list' }),
      loading() {
        return this.placeloading || this.geoloading;
      },
      addressList() {
        return this.stateAddresses.map(a => a.address.freeformAddress);
      }
    },
    methods: {
      ...mapMutations('tomtom-geocode', { clearAddresses: 'clearAll' }),
      // ...mapActions('tomtom-autocomplete', {findAddresses: 'find'}),
      ...mapActions('tomtom-geocode', { findgeocoded: 'find' }),
      removeAddress(){
        this.$emit('input', undefined);
        this.normalizedAddress = defaultAddress();
      },
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
            if (this.lget(res, 'data[0]')) {
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
          this.normalizedAddress = this.$tomtomToAddress(val);
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
