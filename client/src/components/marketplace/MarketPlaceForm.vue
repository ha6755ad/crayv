<template>
  <q-page flat style="max-width: 100%" class="bg-light flex justify-center q-pa-md">
    <q-card style="width: 1000px; max-width: 100%;" class="q-pa-md">
      <div class="q-pa-md" style="width: 100%;">
        <q-img style="width: 100%; height: 225px;" :src="getAvatar(form, 'image', 'large')">
          <q-btn class="t-r text-white" style="background: rgba(0,0,0,.3)" size="sm" flat icon="mdi-image"
                 label="cover image">
            <q-popup-proxy>
              <q-card>
                <single-image-upload add-label="Change Cover Photo" v-model="form.image"></single-image-upload>
              </q-card>
            </q-popup-proxy>
          </q-btn>
        </q-img>
        <div class="t-l q-ma-sm">
          <default-avatar
            bg-in="white"
            style="width: 150px; height: 150px"
            :value="form"
            size-in="150px"
            bordered>
            <template v-slot:menu>
              <q-menu>
                <single-image-upload v-model="form.avatar" add-label="Change Logo"></single-image-upload>
              </q-menu>
            </template>
          </default-avatar>
        </div>
      </div>
      <q-input borderless input-class="text-sm text-mb-md text-weight-medium" v-model="form.name"></q-input>
      <q-input placeholder="Add Description..." autogrow borderless input-class="text-xs text-mb-sm text-weight-light"
               v-model="form.description"></q-input>
    </q-card>
  </q-page>
</template>

<script>
  import {models} from 'feathers-vuex';
  import SingleImageUpload from 'components/common/substance/images/SingleImageUpload';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';

  export default {
    name: 'MarketplaceForm',
    components: { DefaultAvatar, SingleImageUpload },
    props: {
      hostIn: Object
    },
    data() {
      return {
        form: new models.api.CrayvMarketplaces().clone()
      };
    },
    watch: {
      hostIn: {
        immediate: true,
        handler(newVal, oldVal){
          let newId = JSON.stringify(this.lget(newVal, '_id', 0));
          let oldId = JSON.stringify(this.lget(oldVal, '_id', 1));
          if (newId && newId !== oldId) {
            if(!this.form.name) this.form.name = newVal.name + ' Marketplace';
            if(!this.form.avatar) this.form.avatar = newVal.avatar;
            if(!this.form.image) this.form.image = this.lget(newVal, 'image', { large: { file: 'https://cdn.quasar.dev/img/material.png' } });
            this.form.host = newId;
          }
        }
      }
    },
    computed: {

    }
  };
</script>
