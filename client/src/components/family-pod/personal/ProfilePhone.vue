<template>
  <q-card>
    <q-card-section>
      <div class="row text-xxs text-mb-xs text-weight-light">Phones
        <q-space/>
        <q-btn v-if="adding !== 'address'" size="sm" icon="mdi-plus" label="add phone" flat
               @click="adding = 'address'"/>
      </div>
    </q-card-section>
    <q-slide-transition>
      <template v-if="adding === 'address'">
        <q-card-section>
          <vue-tel-input :preferredCountries="preferredCountries" @input="handlePhone"></vue-tel-input>
        </q-card-section>
      </template>
    </q-slide-transition>
    <q-card-section>
      <default-list
        :items="[form[path]]"
        title="phone"
        default-path="number.e164"
        :default-id="lget(form, 'settings.defaults.phone.number.e164', null)"
        item-label="number.national"
        @rmv="form.phone = null"
      ></default-list>
    </q-card-section>
  </q-card>
</template>

<script>
  import {models} from 'feathers-vuex';
  import DefaultList from './DefaultList';

  export default {
    name: 'ProfilePhone',
    components: { DefaultList },
    props: {
      subject: {
        type: String,
        default: 'Users'
      },
      path: {
        type: String,
        default: 'phone'
      },
      subjectIn: Object,
      value: Array
    },
    mounted() {
      this.form = new models.api[this.subject]().clone();
    },
    data() {
      return {
        adding: null,
        email: '',
        form: {},
        preferredCountries: ['NG','US']
      };
    },
    watch: {
      // value: {
      //   immediate: true,
      //   handler(newVal){
      //     if(newVal?.length){
      //       this.form.addresses = newVal
      //     }
      //   }
      // },
      subjectIn: {
        immediate: true,
        handler(newVal) {
          console.log('got one', newVal);
          if (newVal && newVal._id) {
            this.form = newVal;
          }
        }
      }
    },
    methods: {
      async handlePhone(number, isValid) {
        if(isValid.isValid){
          this.form.phone = isValid;
          await this.form.save()
            .then(r => {
              console.log('saved', r);
            });
        }
      }
    }
  };
</script>
