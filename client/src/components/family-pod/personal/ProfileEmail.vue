<template>
  <q-card>
    <q-card-section>
      <div class="row text-xxs text-mb-xs text-weight-light">Emails
        <q-space/>
        <q-btn v-if="adding !== 'email'" size="sm" icon="mdi-plus" label="add email" flat
               @click="adding = 'email'"/>
      </div>
    </q-card-section>
    <q-slide-transition>
      <template v-if="adding === 'email'">
        <q-card-section>
          <q-input hide-bottom-space label="add email" v-model="email" @keyup.enter="addEmail(email)"
                   :rules="[emailRule(form.name)]">
            <template v-slot:append>
              <q-btn flat round icon="mdi-email-check" color="primary" @click="addEmail(email)"/>
            </template>
          </q-input>
        </q-card-section>
      </template>
    </q-slide-transition>
    <q-card-section>
      <default-list
        :items="form[path]"
        title="email"
        default-path=""
        :default-id="lget(form, 'settings.defaults.email', null)"
        @rmv="$rmvProfileItem(form, $event, 'email')"
        @itemClick="$setDefaultProfileItem(form, 'email', ...arguments)"
      ></default-list>
    </q-card-section>
  </q-card>
</template>

<script>
  import {models} from 'feathers-vuex';
  import DefaultList from './DefaultList';

  export default {
    name: 'ProfileEmail',
    components: { DefaultList },
    props: {
      subject: {
        type: String,
        default: 'Users'
      },
      path: {
        type: String,
        default: 'email'
      },
      subjectIn: Object,
      value: Array
    },
    mounted(){
      this.form = new models.api[this.subject]().clone();
    },
    data(){
      return {
        adding: null,
        email: '',
        form: {}
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
          if (newVal?._id) {
            this.form = new models.api[this.subject](newVal).clone();
          }
        }
      }
    },
    methods: {
      async addEmail (email) {
        if (!this.form[this.path].includes(email)) {
          this.form[this.path].push(email);
          this.$emit('input', this.form[this.path]);
          await this.form.save()
            .then(res => {
              if (!hasDefault) {
                this.$setDefaultProfileItem(res, 'email', email);
              }
            })
            .catch(err => this.$errNotify(err.message));
        }
        this.email = '';
        let hasDefault = this.lget(this.subjectIn, 'defaults.email', null);
      },
    }
  };
</script>
