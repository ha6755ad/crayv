<template>
  <q-page class="bg-light q-pa-md">

    <div class="row justify-center">
      <q-card :class="`q-pa-${$q.screen.name}`" style="width: 1200px; max-width: 100%; background: white; min-height: 90vh">
        <div class="q-pa-md text-sm text-mb-sm text-weight-bold">Your Personal Info</div>
        <div class="row q-my-sm">
          <image-form v-model="form.avatar"></image-form>
        </div>

        <div style="width: 500px; max-width: 100%">
        <q-input class="q-my-sm" input-class="text-xs text-mb-xs text-weight-medium" v-model="form.name" placeholder="name"></q-input>
        </div>

        <q-separator dark class="q-my-sm"></q-separator>

        <phone-form v-model="form.phone"></phone-form>

        <q-separator dark class="q-my-sm"></q-separator>

        <address-form v-model="form.addresses" multiple></address-form>

      </q-card>
    </div>

    <q-btn label="save changes" class="t-r" v-if="dirty" rounded push glossy color="nice" @click="save"></q-btn>
  </q-page>
</template>

<script>
  import {mapGetters} from 'vuex';
  import AddressForm from 'components/family-pod/personal/AddressForm';
  import ImageForm from 'components/family-pod/personal/ImageForm';
  import PhoneForm from 'components/family-pod/personal/PhoneForm';

  export default {
    name: 'ExtendFcProfile',
    components: { PhoneForm, ImageForm, AddressForm },
    data() {
      return {
        form: {},
        dirty: false
      };
    },
    watch: {

    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      modelForm(){
        return {...this.user.clone(), ...this.form};
      },
      vCheckForm(){
        return Object.assign({}, this.modelForm);
      }
    },
    methods: {

      save() {
        this.$store.dispatch('users/patch', [this.user._id, this.form
        ])
          .then(() => {
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
