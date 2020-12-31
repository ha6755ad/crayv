<template>
  <q-page flat style="max-width: 100%" class="bg-light flex flex-center q-pa-md">
    <q-card style="width: 1000px; max-width: 100%" class="q-pa-md">
      <div class="col-12 q-gutter-lg">
        <div class="row justify-center">
          <div class="text-xs text-mb-sm text-weight-medium"><span class="text-weight-light">User Name: </span>{{form.username}}</div>
        </div>
        <div class="row justify-center">
          <single-image-upload add-label="Profile Photo" v-model="form.avatar"></single-image-upload>
        </div>
        <q-input v-model="form.name" input-class="text-sm text-mb-sm text-weight-medium" label="Your Name"></q-input>
        <q-input input-class="text-sm text-mb-sm text-weight-medium" hide-bottom-space label="add email"
                 v-model="form.email"
                 :rules="[emailRule(form.email)]">
          <template v-slot:append>
            <q-btn flat round icon="mdi-email-check" color="primary"/>
          </template>
        </q-input>
        <vue-tel-input :disabled="true" :preferredCountries="preferredCountries" :value="lget(form, 'phone.number.e164')" @input="setPhone"/>
        <div class="q-pa-md row justify-end">
          <q-btn color="primary" label="save" icon="mdi-content-save" @click="saveUser"/>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
  import {mapGetters} from 'vuex';
  import SingleImageUpload from '../../common/substance/images/SingleImageUpload';

  export default {
    name: 'PersonalProfile',
    components: { SingleImageUpload },
    props: {
      cols: {
        type: Number,
        default: 12
      }
    },
    data() {
      return {
        dirty: [],
        adding: null,
        selectedSuggestion: '',
        form: {},
        preferredCountries:['NG','US']
      };
    },
    watch: {
      person: {
        immediate: true,
        handler(newVal) {
          if (newVal && newVal._id) {
            console.log(this.form);
            this.form = newVal.clone();
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      person() {
        return this.user;
      }
    },
    methods: {
      isEmailRule(val) {
        let reg = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
        return reg.test(val);
      },
      async saveUser() {
        let email = this.emailRule(this.form.email);
        if (email) {
          await this.form.save()
            .then(res => {
              console.log('got res', res);
              this.$successNotify('Lookin Good!');
              this.$emit('save');
            }).catch(err => {
              this.$errNotify(err.message);
            });
        } else {
          this.$infoNotify('Enter a valid email');
        }
      },
      setPhone(number, isValid) {
        console.log('set phone', number, isValid);
        if (isValid.isValid) {
          this.form.phone = isValid;
        }
      }
    }
  };
</script>
