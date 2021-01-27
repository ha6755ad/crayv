import { mapState, mapActions } from 'vuex';
import lget from 'lodash.get';
import { LocalStorage } from 'quasar';

export const LocationMixin = {
  mounted(){
    let state1 = lget(this.coordinates, [1]);
    console.log('local1', LocalStorage.coordinates);
    let loc = LocalStorage.coordinates ? LocalStorage.coordinates : null;
    let local1 = lget(loc, [1]);
    let coords = state1 ? state1 : local1 ? loc : null;
    if(coords){
      if(!lget(this.coordinates, [1])){
        this.$store.dispatch('setCoordinates', coords);
      }
      console.log('coordinates', coords);
    } else this.setLocation();
  },
  data(){
    return {
      country: null,
      preferredCountries: ['NG', 'US'],
    };
  },
  watch: {
    latitude: {
      immediate: true,
      handler(newVal){
        if(this.estimateAddress && newVal && !this.lget(this.address, 'latitude')){
          this.getAddressFromPoint(this.coordinates);
        }
      }
    }
  },
  computed: {
    ...mapState({ coordinates: 'coordinates', address: 'address' }),
    latitude(){
      return lget(this.coordinates, [1]);
    },
    longitude(){
      return lget(this.coordinates, [0]);
    },
    addressLat(){
      let address = this.address ? this.address : this.defaultAddress;
      return this.lget(address, 'latitude');
    },
    addressLng(){
      let address = this.address ? this.address : this.defaultAddress;
      return this.lget(address, 'longitude');
    },
    defaultCountry(){
      return this.country ? this.country : this.address ? this.address.country : null;
    },
  },
  methods: {
    ...mapActions('tomtom-reverse-geocode', { findRevGeo: 'find' }),
    async getAddressFromPoint(coord){
      await this.findRevGeo({
        query: {
          position: `${coord[1]},${coord[0]}`
        }
      })
        .then(res => {
          console.log('successful geo', res);
          if (res.data.length) {
            let address = this.$tomtomToAddress(res.data[0]);
            this.country = address.country;
            this.$store.dispatch('setAddress', address);
            // console.log('patching address', address)
            // await this.$store.dispatch('proposals/patch', [this.proposalId, { address: address }, {}])
            //   .then(res => console.log('saved proposal location', res))
            //   .catch(err => this.$errNotify(err.message))
          }
        }).catch(err => {
          this.$errNotify(err.message);
          return null;
        });
    },
    setLocation(lngLat){
      this.loading = true;
      console.log('getting location');

      const setLocation = coordObj => {
        console.log('got location', coordObj);
        // coord comes in as lng,lat
        let c = [coordObj.lng, coordObj.lat];
        this.$store.dispatch('setCoordinates', c);
      };
      if(lngLat) setLocation(lngLat);
      else {
        this.$getLocation({ enableHighAccuracy: true, timeout: 20000 })
          .then(res => {
            setLocation(res);
            // this.getAddressFromPoint([coordinates.lng, coordinates.lat])
          })
          .catch(err => {
            console.error('$getLocation error:', err);
            this.loading = false;

            if (this.addressLat) {
              this.$store.dispatch('setCoordinates', [this.addressLng, this.addressLat]);
              if (!this.lget(this.address, 'latitude')) this.$store.dispatch('setAddress', this.defaultAddress);
            }
            this.$quickNotify('Location is blocked in your browser - not all features will operate optimally');
            return [];
          });
      }
    },
  }
};
