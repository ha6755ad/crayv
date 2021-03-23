<template>
    <v-flex xs11>
        <input ref="autocomplete"
               placeholder="Search"
               class="search-location"
               onfocus="value = ''"
               type="text"/>

    </v-flex>
</template>

<script>
/* eslint-disable no-unused-vars */

  export default {
    mounted(){
      // eslint-disable-next-line no-undef
      this.autocomplete = new google.maps.places.Autocomplete(
        (this.$refs.autocomplete),
        {types: ['geocode']}
      );

      this.autocomplete.addListener('place_changed', () => {
        let place = this.autocomplete.getPlace();
        let ac = place.address_components;
        let lat = place.geometry.location.lat();
        let lng = place.geometry.location.lng();
        let city = ac[0]['short_name'];

        let groupLoc = {
          address: place.address_components,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        this.$emit('getAddress', groupLoc);
        // this.$emit('getSubAddress', groupLoc)
        return groupLoc;
      });
    },
    computed: {

    }
  };
</script>
<style>
    .search-location {
        width: 100%;
        margin: 0 auto;
        font-size: 20px;
        font-weight: 400;
        outline: 1px solid gray;
        height: 30px;
        line-height: 30px;
        text-align: left;
        border-radius: 10px;
        z-index: 3000 !important;
    }
    .pac-container {
        z-index: 1200 !important;
    }
</style>
