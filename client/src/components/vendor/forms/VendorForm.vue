<template>
  <q-card style="height: 100%; width: 100%">
    <div class="q-pa-md" style="width: 100%; position:  relative">
      <q-img :style="`width: 100%; height: ${$lisEmpty(formImg) ? '200px' : '425px'}; border-radius: 6px`" :src="$lisEmpty(formImg) ? 'https://cdn.quasar.dev/img/material.png' : getAvatar(form, 'img', 'large', null, 'https://cdn.quasar.dev/img/material.png')">
        <q-btn class="t-r text-white" style="background: rgba(0,0,0,.3)" size="sm" flat icon="mdi-image"
               label="cover image" @click.stop="imgDialog = true"></q-btn>
        <q-dialog v-model="imgDialog">
          <single-image-upload add-label="Change Cover Image" v-model="form.img"></single-image-upload>
        </q-dialog>

        <div class="row absolute-bottom bg-light-8" style="background: rgba(255,255,255,.7)">
          <div class="col-12 q-pa-md">
            <q-input placeholder="Add a name..." hide-bottom-space borderless input-class="text-md text-mb-md text-weight-medium" v-model="form.name"/>
            <q-input placeholder="Add a description..." hide-bottom-space borderless input-class="text-xs text-mb-sm" autogrow v-model="form.description"/>
          </div>

        </div>

      </q-img>
      <div class="t-l q-ma-sm" @click.stop="avatarDialog = true">
        <default-avatar dark style="width: 150px; height: 150px" :value="form" size-in="150px"/>
        <q-dialog v-model="avatarDialog">
          <single-image-upload add-label="Change Logo" v-model="form.avatar"></single-image-upload>
        </q-dialog>
      </div>
    </div>

    <div class="q-my-md">
      <default-vendor-settings
        start-on
        :save-on-change="form && form._id ? true : false"
        :id-in="form._id"
        service-in="crayv-vendors"
        @input="$lset(form, 'settings.vendorSettings', $event)"
        :value="lget(form, 'settings.vendorSettings')"
      ></default-vendor-settings>
    </div>

      <div class="row justify-end q-pa-md">
        <q-btn push color="accent" class="text-dark" @click="saveVendor" label="Save Account"/>
      </div>
  </q-card>
</template>

<script>
  import {models} from 'feathers-vuex';
  import SingleImageUpload from 'components/common/substance/images/SingleImageUpload';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import DefaultVendorSettings from 'components/vendor/settings/DefaultVendorSettings';

  export default {
    name: 'VendorForm',
    components: { DefaultVendorSettings, DefaultAvatar, SingleImageUpload },
    props: {
      value: Object
    },
    mounted() {

    },
    data() {
      return {
        imgDialog: false,
        avatarDialog: false,
        searchInput: '',
        selectedSuggestion: null,
        form: new models.api.CrayvVendors().clone()
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            Object.assign(this.form, Object.assign({}, newVal));
          }
        }
      }
    },
    computed: {
      formImg(){
        return this.lget(this.form, 'img');
      }
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
