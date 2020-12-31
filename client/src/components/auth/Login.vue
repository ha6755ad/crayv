<template>
  <div class="fill_size">
    <q-toolbar class="text-primary">
      <img src="https://ha6755ad-images.s3-us-west-1.amazonaws.com/crayv_standard.svg" style="height: 40px" class="q-mr-xs">
      <q-toolbar-title>{{ signUpOn ? 'Register' : 'Login' }}</q-toolbar-title>
      <q-space/>

    </q-toolbar>
    <div class="q-pa-md">
      <div v-show="!signUpOn">
        <q-input @input="emailInput"
                 :value="form.email"
                 class="required"
                 label="Email"
                 :rules="$vRuleCheck('email')"
                 :error="$vErrorCheck('email')"
                 :error-message="$vErrorMessage('email')"
                 required>
          <template v-slot:prepend>
            <q-icon name="mdi-email"></q-icon>
          </template>
        </q-input>

        <q-input id="password"
                 v-model="form.password"
                 class="required"
                 label="Password"
                 v-on="$listeners"
                 :rules="$vRuleCheck('password')"
                 :error="$vErrorCheck('password')"
                 :error-message="$vErrorMessage('password')"
                 :append-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                 @click:append="() => (visible = !visible)"
                 :type="visible ? 'text' : 'password'"
                 required
                 @keyup.enter="login">
          <template v-slot:prepend>
            <q-icon name="mdi-lock"></q-icon>
          </template>
        </q-input>

        <div class="q-pa-md row">
          <q-space/>
          <q-btn color="white"
                 text-color="black"
                 @click="login"
                 label="Login">
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  import {vCheck} from 'src/mixins/ir-validate';


  export default {
    name: 'login',
    mixins: [vCheck],
    props: {
      signUpOn: Boolean
    },
    data: () => ({
      updateValidOnInput: true,
      valid: false,
      confirmPassword: '',
      form: {
        email: '',
        password: '',
      },
      visible: false
    }),
    watch: {
      loadingAuth(newVal) {
        this.$isLoading(newVal);
      },
    },
    mounted() {

    },
    computed: {
      ...mapState('auth', {
        loadingAuth: 'isAuthenticatePending'
      }),
      vCheckForm(){
        return this.form;
      },
      validCheck() {
        return {
          email: {
            name: 'Email',
            v: {
              check: 'format',
              arg: 'string',
              format: (val) => {
                return !this.isEmailRule(val.value);
              },
              error: 'Enter a valid email'
            }
          },
          password: {
            name: 'Password',
            v: {
              check: 'notEmpty'
            }
          }
        };
      },
    },
    methods: {
      ...mapActions('auth', {
        authenticate: 'authenticate'
      }),
      emailInput(val){
        this.form.email = val.toLowerCase().trim();
      },
      login() {
        const errors = this.$vCheck(this.form);
        if (errors && errors.length) {
          errors.forEach(err => {
            this.$vErrNotify(err);
          });
        } else {
          this.authenticate({ ...this.form, strategy: 'local' })
            // eslint-disable-next-line no-unused-vars
            .then(res => {
              this.$successNotify(`Welcome Back ${this.lget(res, 'name', '')}`);
              // this.$q.notify('Successfully Logged in', 'positive', 3000);
            })
            .catch(error => {
              this.$errNotify('Login Error ' + error.message);
            });
        }
      }
    },
  };
</script>

<style scoped lang="scss">
  .login {

  }

</style>

