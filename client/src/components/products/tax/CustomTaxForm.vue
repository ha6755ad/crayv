<template>
  <div>

  </div>
</template>

<script>
  import axios from 'axios';

  const taxItem = () => {
    return {
      areaId: null,
      postal_codes: [],
      cities: [],
      sales: { percentage: 0, flat: null, use: 'percentage', notes: '' }
    };
  };
  export default {
    name: 'CustomTaxForm',
    components: {},
    mounted() {
      // this.getBoundary();
    },
    data() {
      return {
        form: taxItem()
      };
    },
    computed: {
      axiosFeathers() {
        return axios.create({
          baseURL: process.env.VUE_APP_FEATHERS_URL,
          headers: {
            ContentType: 'application/json',
            Accept: 'application/json',
            // Authorization: 'Bearer ' + this.$store.state.auth.accessToken
          }
        });
      }
    },
    methods: {
      getBoundary() {
        console.log('getting boundary');
        this.axiosFeathers.post('/mapbox-boundaries')
          .then(res => console.log('res', res))
          .catch(err => console.log('err', err));
      }
    }
  };
</script>
