import { mapState } from 'vuex';

export const LocationMixin = {
  mounted(){
    let ll = localStorage.legacyAddress;
    let coords = localStorage.legacyCoordinates;
    let address = ll ? ll : this.address;
    let coordinates = coords ? coords : this.coordinates;
    console.log('ll', ll, 'address', address, 'coordinates', coordinates);
    if(address && Object.keys(address).length){
      this.country = this.lget(location, 'country');
    } else if(coordinates && Array.isArray(coordinates) && coordinates.length){
      console.log('coordinates', coordinates);
      this.getAddressFromPoint(coordinates);
    } else this.setLocation();
  },
  data(){
    return {
      country: null,
      preferredCountries: ['NG', 'US'],
    };
  },
  computed: {
    ...mapState({ coordinates: 'coordinates', address: 'address' }),
    defaultCountry(){
      return this.country ? this.country : this.address ? this.address.country : null;
    },
  },
  methods: {
    async getAddressFromPoint(coord){
      await this.findRevGeo({
        query: {
          position: `${coord[1]},${coord[0]}`
        }
      })
        .then(async res => {
          console.log('successful geo', res);
          if (res.data.length) {
            let address = await this.$tomtomToAddress(res.data[0]);
            localStorage.legacyAddress = address;
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
    async setLocation(){
      this.loading = true;
      console.log('getting location');
      await this.$getLocation({ enableHighAccuracy: true })
        .then(async coord => {
          // eslint-disable-next-line no-console
          // coord comes in as lng,lat
          let c = [coord.lng, coord.lat];
          this.$store.dispatch('setCoordinates', c);
          localStorage.legacyCoordinates = c;
          console.log('coord', c);
          this.getAddressFromPoint(c);
          // this.getAddressFromPoint([coordinates.lng, coordinates.lat])
        })
        .catch(err => {
          this.loading = false;
          this.$errNotify('Please check that location isn\'t blocked in your browser');
          console.error('Tile $getLocation error:', err);
          return [];
        });
    },
  }
};
