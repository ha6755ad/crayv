<template>
  <div class="q-pa-md relative-position fill_size">
    <q-img style="width: 100%; height: 225px; border-radius: 6px"
           :src="getAvatar(form, 'img', 'large', null, 'https://cdn.quasar.dev/img/material.png')">
      <q-btn class="t-r text-white" style="background: rgba(0,0,0,.3)" size="sm" flat icon="mdi-image"
             label="cover image" @click.stop="imgDialog = true"></q-btn>
      <q-dialog v-model="imgDialog">
        <single-image-upload add-label="Change Cover Image" v-model="form.img"></single-image-upload>
      </q-dialog>

      <div class="row absolute-bottom bg-light-8" style="background: rgba(255,255,255,.7)">
        <div class="col-12 q-pa-md">
          <q-input hide-bottom-space borderless input-class="text-md text-mb-md text-weight-medium"
                   placeholder="Name Settings..." v-model="form.name"/>
        </div>

      </div>

    </q-img>
    <div class="t-l q-ma-sm" @click.stop="avatarDialog = true">
      <default-avatar style="width: 100px; height: 100px" :value="form" dark size-in="100px"/>
      <q-dialog v-model="avatarDialog">
        <single-image-upload add-label="Change Logo" v-model="form.avatar"></single-image-upload>
      </q-dialog>
    </div>

    <div class="q-my-md">
      <div class="text-xxs text-mb-xxs text-weight-bold">Address</div>
      <tomtom-autocomplete
        placeholder="Start typing to search..."
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

    <div class="q-my-md">
      <div class="q-pa-sm text-xxs text-mb-xxs text-weight-bold">Geo Boundary</div>
      <div class="row justify-center">
        <q-card class="pointer" @click="drawDialog = true" style="width: 400px; max-width: 100%; height: 400px">
          <mapbox
            polygons
            :geo-in="featureList"
          ></mapbox>
        </q-card>
      </div>
    </div>

    <div class="q-my-lg">
      <lineup-list
        select
        :load-watch="lget(vendorContext, '_id')"
        emit-value
        multiple
        v-model="form.productLineups"
      ></lineup-list>
    </div>

    <q-slide-transition>
      <template v-if="!form.syncSettings">
        <div class="q-my-md">
          <default-vendor-settings
            can-sync
            :save-on-change="form && form._id ? true : false"
            :id-in="form._id"
            service-in="crayv-vendor-settings"
            @input="$lset(form, 'settings', $event)"
            :value="lget(form, 'settings')"
          ></default-vendor-settings>
        </div>
      </template>
    </q-slide-transition>

    <div class="q-pa-md row justify-end">
      <q-btn push color="secondary" label="Save" icon="mdi-content-save" @click="saveSettings"></q-btn>
    </div>

    <q-dialog v-model="drawDialog" :maximized="$q.screen.lt.sm" transition-show="slide-up" transition-hide="slide-down">
      <q-card style="height: 100vh; width: 2000px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat icon="mdi-close" @click="drawDialog = false"/>
        <draw-geo v-model="form.geo"></draw-geo>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
  import {models} from 'feathers-vuex';
  import MarketPlaceList from 'components/marketplace/lists/MarketPlaceList';
  import TomtomAutocomplete from 'components/utils/mapbox/tomtom/TomtomAutocomplete';
  import Mapbox from 'components/utils/mapbox/map/mapbox';
  import SingleImageUpload from 'components/common/substance/images/SingleImageUpload';
  import DrawGeo from 'components/utils/mapbox/DrawGeo';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import {mapGetters} from 'vuex';
  import {vCheck} from 'src/mixins/ir-validate';
  import DefaultVendorSettings from 'components/vendor/settings/DefaultVendorSettings';
  import LineupList from 'components/lineups/lists/LineupList';

  export default {
    name: 'VendorSettingsForm',
    mixins: [vCheck],
    components: { LineupList, DefaultVendorSettings, DefaultAvatar, DrawGeo, SingleImageUpload, Mapbox, TomtomAutocomplete, MarketPlaceList },
    props: {
      value: Object
    },
    mounted() {
      if (this.value) {
        this.form = new models.api.CrayvVendorSettings(this.value).clone();
      } else {
        this.form.img = this.lget(this.vendorContext, 'img');
        this.form.avatar = this.lget(this.vendorContext, 'avatar');
      }
    },
    data() {
      return {
        imgDialog: false,
        avatarDialog: false,
        drawDialog: false,
        form: new models.api.CrayvVendorSettings().clone()
      };
    },
    computed: {
      ...mapGetters({ vendorContext: 'vendorContext' }),
      featureList() {
        return this.$lget(this.value, 'geo', null);
      },
      vCheckForm() {
        return this.form;
      },
      validCheck() {
        return {
          name: { name: 'Name', v: ['notEmpty', 'lt:30'] },
          vendor: { name: 'Vendor', v: ['notEmpty'] },
          address: { name: 'Address', v: ['notEmpty'] }
        };
      }
    },
    methods: {
      saveSettings() {
        if (!this.form.vendor) this.form.vendor = this.lget(this.vendorContext, '_id');
        const errors = this.$vCheck(this.form);
        if (errors && errors.length) {
          errors.forEach(err => {
            this.$vErrNotify(err);
          });
        } else {
          this.form.save()
            .then(res => {
              this.$emit('input', res);
              this.$successNotify('Settings Saved');
            })
            .catch(err => {
              this.$errNotify(err.message);
            });
        }
      }
    }
  };
</script>

<style scoped lang="scss">

</style>
