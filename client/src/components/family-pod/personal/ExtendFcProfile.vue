<template>
  <q-page class="bg-light q-pa-md">

    <div class="row justify-center">
      <q-card :class="`q-pa-${$q.screen.name}`"
              style="width: 1200px; max-width: 100%; background: white; min-height: 90vh">

        <div class="t-l q-ma-sm" @click.stop="avatarDialog = true">
          <default-avatar bordered dark style="width: 150px; height: 150px" :value="form" size-in="150px"/>
          <q-dialog v-model="avatarDialog">
            <image-form v-model="form.avatar" @input="dirty=true"></image-form>
          </q-dialog>
        </div>

        <q-img style="width: 100%; height: 350px; border-radius: 6px" :src="formImg">
          <q-btn class="t-r text-white" style="background: rgba(0,0,0,.3)" size="sm" flat icon="mdi-image"
                 label="cover image" @click.stop="imgDialog = true"></q-btn>
          <q-dialog v-model="imgDialog">
            <image-form @input="dirty=true" v-model="form.image"></image-form>
          </q-dialog>

        </q-img>

        <div style="width: 500px; max-width: 100%">
          <q-input @input="dirty=true" class="q-my-sm" input-class="text-xs text-mb-xs text-weight-medium"
                   v-model="form.name" placeholder="name"></q-input>
        </div>

        <q-separator dark class="q-my-sm"></q-separator>

        <phone-form v-model="form.phone" @input="dirty = true"></phone-form>

        <q-separator dark class="q-my-sm"></q-separator>

        <address-form multiple v-model="form.addresses" @input="dirty = true"></address-form>
        <q-btn label="save changes" class="t-r" v-if="dirty" rounded push glossy color="nice" @click="save"></q-btn>
      </q-card>
    </div>

  </q-page>
</template>

<script>
  // import {models} from 'feathers-vuex';
  import {mapGetters} from 'vuex';
  import AddressForm from 'components/family-pod/personal/AddressForm';
  import ImageForm from 'components/family-pod/personal/ImageForm';
  import PhoneForm from 'components/family-pod/personal/PhoneForm';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import {vCheck} from 'src/mixins/ir-validate';

  export default {
    name: 'ExtendFcProfile',
    mixins: [vCheck],
    components: { DefaultAvatar, PhoneForm, ImageForm, AddressForm },
    props: {},
    mounted() {

    },
    data() {
      return {
        form: {},
        dirty: false,
        imgDialog: false,
        avatarDialog: false,
        updateValidOnInput: true
      };
    },
    watch: {
      user: {
        immediate: true,
        async handler(newVal, oldVal) {
          let newId = this.lget(newVal, '_id', 0);
          let oldId = this.lget(oldVal, '_id', 0);
          if (newId && newId !== oldId) {
            await this.$store.dispatch('users/get', newId)
              .then(res => {
                this.form = res.clone();
              })
              .catch(err => {
                this.$errNotify('Error loading account - please refresh -- ' + err.message);
              });
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      formImg() {
        return this.getAvatar(this.form, 'image', 'large', null, 'https://cdn.quasar.dev/img/material.png');
      },
      vCheckForm() {
        return this.form;
      }
    },
    methods: {

      save() {
        let user = this.$getSaveObj(this.form);
        console.log('saving', user);
        this.$store.dispatch('users/patch', [this.user._id, user
        ])
          .then(res => {
            console.log('saved acct', res);
            this.dirty = false;
            this.$successNotify('Account Saved');
          })
          .catch(err => {
            this.$errNotify(err.message);
          });
      }
    }
  };
</script>

<style scoped>

</style>
