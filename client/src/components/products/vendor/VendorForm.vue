<template>
  <q-card style="height: 100%; width: 100%">
    <q-card-section>
      <div class="text-sm text-mb-sm text-weight-light">Vendor Account</div>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-12 q-pa-md q-gutter-md">
          <q-input filled label="Vendor Name" v-model="form.name"/>
          <q-input type="textarea" filled label="Description" v-model="form.description"/>
        </div>
        <div class="col-6 q-pa-md">
          <p class="caption">Vendor Logo</p>
          <image-uploader name="avatar" v-model="form.avatar" :large-image="getAvatar(form, 'avatar', 'large')"/>
        </div>
        <div class="col-6 q-pa-md">
          <p class="caption">Cover Image</p>
          <image-uploader name="img" v-model="form.img" :large-image="getAvatar(form, 'img', 'large')"/>
        </div>
        <div class="col-12 q-pa-md">
          <p class="caption">Locations</p>
          <tomtom-autocomplete
            item_text="formatted"
            solo
            @input="addressInput"
            @error="searchInput = ''"
            v-model="selectedSuggestion"
            @clear="selectedSuggestion = null"
          ></tomtom-autocomplete>
          <p v-for="(loc, i) in form.locations" :key="i" class="text-weight-light text-xxs text-mb-xxs">{{loc.formatted}}<span><q-icon size="12px" name="mdi-delete" class="pointer" @click="form.locations.splice(i, 1)"/></span></p>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row justify-end">
        <q-btn @click="saveVendor" label="Save Account"/>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
  import {models} from 'feathers-vuex';
  import ImageUploader from '../../common/substance/images/ImageUploader';
  import TomtomAutocomplete from '../../utils/mapbox/tomtom/TomtomAutocomplete';

  export default {
    name: 'VendorForm',
    components: {TomtomAutocomplete, ImageUploader},
    props: {
      value: Object
    },
    mounted() {
      if(this.value){
        this.form = new models.api.CrayvVendors(this.value).clone();
      } else this.form = new models.api.CrayvVendors().clone();
    },
    data() {
      return {
        searchInput: '',
        selectedSuggestion: null,
        form: {}
      };
    },
    methods: {
      addressInput(val){
        if(this.form.locations && !this.form.locations.includes(val)) {
          this.form.locations ? this.form.locations.push(val) : this.form.locations = [val];
          this.searchInput = '';
          this.selectedSuggestion = null;
        }
      },
      async saveVendor() {
        this.form.owner = this.$store.state.auth.user._id;
        this.form.ownerModel = 'users';
        await this.form.save()
          .then(() => {
            this.$q.notify({message: 'Success, you can now vend', color: 'positive'});
          })
          .catch(err => {
            console.log('error creating vendor', err.message);
            this.$q.notify({message: 'Connection error, please refresh and try again', color: 'negative'});
          });
      }
    }
  };
</script>

<style scoped lang="scss">

</style>
