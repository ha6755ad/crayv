<template>
  <q-card flat class="q-pa-md">

    <q-img :style="`width: 100%; height: ${$lisEmpty(lget(form, 'img')) ? '200px' : '425px'}; border-radius: 6px`"
           :src="$lisEmpty(lget(form, 'img')) ? 'https://cdn.quasar.dev/img/material.png' : getAvatar(form, 'img', 'large', null, 'https://cdn.quasar.dev/img/material.png')">
      <q-btn class="t-r text-white" style="background: rgba(0,0,0,.3)" size="sm" flat icon="mdi-image"
             label="cover image" @click.stop="imgDialog = true"></q-btn>
      <q-dialog v-model="imgDialog">
        <single-image-upload add-label="Change Cover Image" v-model="form.img"></single-image-upload>
      </q-dialog>

      <div class="row absolute-bottom bg-light-8" style="background: rgba(255,255,255,.7)">
        <div class="col-12 q-pa-md">
          <q-input placeholder="Lineup Name..." hide-bottom-space borderless
                   input-class="text-md text-mb-md text-weight-medium" v-model="form.name"/>
          <q-input placeholder="Description..." hide-bottom-space borderless input-class="text-xs text-mb-sm" autogrow
                   v-model="form.description"/>
        </div>

      </div>

    </q-img>

    <q-separator dark class="q-my-md"></q-separator>
    <div class="q-pa-sm text-xxs text-mb-xs text-weight-medium">Add To Vendor Settings</div>
    <div class="q-pa-sm text-xxs text-mb-xs text-weight-light">Where will this lineup be available?</div>
    <settings-list
      select
      editing
      emit-value
      multiple
      v-model="form.vendorSettings"
      :query-in="{ _id: { $in: lget(vendorContext, 'vendorSettings', []) } }"
    ></settings-list>

    <div class="q-pa-sm text-xxs text-mb-xs text-weight-medium">Add Product Groups</div>
    <product-group-list
      select
      editing
      :sm="12" :md="12" :lg="12" :xl="12"
      :query-in="{ _id: { $in: lget(this.vendorContext,'productGroups', [])} }"
      emit-value
      multiple
      v-model="form.productGroups"
    ></product-group-list>

    <div class="q-pa-sm text-xxs text-mb-xs text-weight-medium">Add Products</div>
    <product-list
      select
      :query-in="{ _id: { $in: lget(this.vendorContext, 'products', [])} }"
      emit-value
      multiple
      v-model="form.products"
    ></product-list>

    <div class="row q-my-sm">
      <q-checkbox color="nice" v-model="form.settings.syncSettings" label="Sync with vendor settings"></q-checkbox>
    </div>

    <q-slide-transition>
      <template v-if="!form.settings.syncSettings">
        <div class="q-my-md">
          <default-product-settings
            :save-on-change="form && form._id ? true : false"
            :id-in="form._id"
            service-in="crayv-product-lineup"
            @input="$lset(form, 'settings.productSettings', $event)"
            :value="lget(form, 'settings.productSettings')"
          ></default-product-settings>
        </div>
      </template>
    </q-slide-transition>

    <div class="q-pa-md row justify-end">
      <q-btn push color="primary" @click="saveLineup" label="save" icon="mdi-content-save"></q-btn>
    </div>

  </q-card>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {models} from 'feathers-vuex';
  import ProductGroupList from 'components/product-groups/lists/ProductGroupList';
  import ProductList from 'components/products/lists/ProductList';
  import SingleImageUpload from 'components/common/substance/images/SingleImageUpload';
  import {vCheck} from 'src/mixins/ir-validate';
  import SettingsList from 'components/vendor/settings/SettingsList';
  import DefaultProductSettings from 'components/products/settings/DefaultProductSettings';

  export default {
    name: 'LineupForm',
    mixins: [vCheck],
    components: { DefaultProductSettings, SettingsList, SingleImageUpload, ProductList, ProductGroupList },
    props: {
      value: Object
    },
    mounted() {
      if (this.value) this.form = new models.api.CrayvProductLineups(this.value).clone();
    },
    data() {
      return {
        imgDialog: false,
        form: new models.api.CrayvProductLineups().clone()
      };
    },
    computed: {
      ...mapGetters({ vendorContext: 'vendorContext' }),
      vCheckForm() {
        return this.form;
      },
      validCheck() {
        return {
          name: { name: 'Name', v: ['notEmpty', 'lt:40'] },
        };
      }
    },
    methods: {
      saveLineup() {
        const errors = this.$vCheck(this.form);
        if (errors && errors.length) {
          errors.forEach(err => {
            this.$vErrNotify(err);
          });
        } else {
          !this.lget(this.form, 'vendorId') ? this.form.vendorId = this.vendorContext._id : '';
          this.form.save()
            .then(res => {
              this.$emit('input', res);
              this.$successNotify('Lineup Saved');
            })
            .catch(err => this.$errNotify(err.message));
        }
      }
    }
  };
</script>
