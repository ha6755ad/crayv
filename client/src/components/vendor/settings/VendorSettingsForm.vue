<template>
  <div class="q-pa-md relative-position fill_size">
    <q-img style="width: 100%; height: 225px; border-radius: 6px" :src="getAvatar(form, 'img', 'large', null, 'https://cdn.quasar.dev/img/material.png')">
      <q-btn class="t-r text-white" style="background: rgba(0,0,0,.3)" size="sm" flat icon="mdi-image"
             label="cover image" @click.stop="imgDialog = true"></q-btn>
      <q-dialog v-model="imgDialog">
        <single-image-upload add-label="Change Cover Image" v-model="form.img"></single-image-upload>
      </q-dialog>

      <div class="row absolute-bottom bg-light-8" style="background: rgba(255,255,255,.7)">
        <div class="col-12 q-pa-md">
          <q-input hide-bottom-space borderless input-class="text-md text-mb-md text-weight-medium" placeholder="Name Settings..." v-model="form.name"/>
        </div>

      </div>

    </q-img>

    <div class="q-my-md">
    <tomtom-autocomplete
      placeholder="Add an address..."
      item_text="formatted"
      outlined
      @error="searchInput = ''"
      v-model="form.address"
    ></tomtom-autocomplete>
    </div>

    <market-place-list
      subtitle="Select Marketplaces"
      select
      emit-value
      multiple
      v-model="form.marketplace"
    ></market-place-list>

    <div class="row justify-center">
      <q-card style="width: 400px; max-width: 100%; height: 400px">
        <mapbox
          polygons
          :geo-in="featureList"
        ></mapbox>
      </q-card>
    </div>

    <q-dialog v-model="drawDialog" :maximized="$q.screen.lt.sm" transition-show="slide-up" transition-hide="slide-down">
      <q-card style="height: 100vh; width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat icon="mdi-close" @click="drawDialog = false"/>
          <draw-geo v-model="form.geo"></draw-geo>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
  import { models } from 'feathers-vuex';
  import MarketPlaceList from 'components/marketplace/lists/MarketPlaceList';
  import TomtomAutocomplete from 'components/utils/mapbox/tomtom/TomtomAutocomplete';
  import Mapbox from 'components/utils/mapbox/map/mapbox';
  import SingleImageUpload from 'components/common/substance/images/SingleImageUpload';
  import DrawGeo from 'components/utils/mapbox/DrawGeo';

  export default {
    components: { DrawGeo, SingleImageUpload, Mapbox, TomtomAutocomplete, MarketPlaceList },
    props: {
      value: Object
    },
    mounted(){
      if(this.value){
        this.form = new models.api.CrayvVendorSettings(this.value).clone();
      }
    },
    data(){
      return {
        drawDialog: false,
        form: new models.api.CrayvVendorSettings().clone()
      };
    },
    computed: {
      featureList() {
        return this.$lget(this.value, 'geo', {});
      },
    }
  };
</script>

<style scoped lang="scss">

</style>
