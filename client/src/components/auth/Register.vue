<template>
  <q-card flat>
    <q-toolbar class="text-primary">
      <img src="https://ha6755ad-images.s3-us-west-1.amazonaws.com/crayv_standard.svg" style="height: 40px" class="q-mr-xs">
      <q-toolbar-title>Sign Up</q-toolbar-title>
      <q-space/>

    </q-toolbar>
  <div class="q-pa-md">

      <q-input class="q-mt-xs"
               id="name"
               v-model="form.name"
               :rules="$vRuleCheck('name')"
               :error="$vErrorCheck('name')"
               :error-message="$vErrorMessage('name')"
               label="Name"></q-input>
      <q-input class="q-mt-xs"
               id="email"
               type="email"
               @input="emailInput"
               :value="form.email"
               :rules="$vRuleCheck('email')"
               :error="$vErrorCheck('email')"
               :error-message="$vErrorMessage('email')"
               label="Email"></q-input>
      <q-slide-transition>
        <div v-if="form.password">
          <div class="flex" style="align-items: center;">
            <div class="q-mt-sm"
                 style=" font-weight: bold; display: flex; align-items: center; height: 100%; width: 40vw;">Password
              Strength:
            </div>
            <div class="flex q-mt-sm" style="width: 50vw; justify-content: space-between">
              <div class="strength"
                   :style="{
            backgroundColor: passStrength === 'Weak' ? 'rgba(220,20,60,.8)': 'white',
            fontSize: passStrength === 'Weak' ? '1rem' : 'inherit',
            fontWeight: passStrength === 'Weak' ? 'bold' : 'inherit',
            color: passStrength === 'Weak' ? 'inherit' : 'grey',
          }">Weak
              </div>
              <div class="strength"
                   :style="{
            backgroundColor: passStrength === 'Medium' ? 'rgba(255,140,0,.5)': 'white',
            fontSize: passStrength === 'Medium' ? '1rem' : 'inherit',
            fontWeight: passStrength === 'Medium' ? 'bold' : 'inherit',
            color: passStrength === 'Medium' ? 'inherit' : 'grey',
          }">Medium
              </div>
              <div class="strength"
                   :style="{
            backgroundColor: passStrength === 'Strong' ? 'rgba(0,255,0,.5)': 'white',
            fontSize: passStrength === 'Strong' ? '1rem' : 'inherit',
            fontWeight: passStrength === 'Strong' ? 'bold' : 'inherit',
            color: passStrength === 'Strong' ? 'inherit' : 'grey',
          }">Strong
              </div>
            </div>
          </div>
          <q-linear-progress style="margin-left: 38vw; width: 56vw;" stripe rounded
                             size="13px" :value="passStrengthValue" :color="linerProgressColor" class="q-mt-sm"/>
        </div>
      </q-slide-transition>
      <q-input :type="passType"
               v-model="form.password"
               :rules="$vRuleCheck('password')"
               :error="$vErrorCheck('password')"
               :error-message="$vErrorMessage('password')"
               label="Password"
               @blur="passType = 'password'"
      >
        <q-icon size="sm"
                @click.stop="passType = passType === 'password' ? 'text' : 'password'"
                :name="passType === 'password' ? 'mdi-eye' : 'mdi-eye-off'"
                color="black"
                :style="{padding: '1px',
                  border: passType === 'text' ? '1px solid black' : '1px solid white',
                  borderRadius: '50%', margin: 'auto 0',}"/>
      </q-input>
      <q-input type="password"
               v-model="confirmPassword"
               @input="passwordCheck"
               :rules="$vRuleCheck('confirmPassword')"
               :error="$vErrorCheck('confirmPassword')"
               :error-message="$vErrorMessage('confirmPassword')"
               label="Confirm Password"></q-input>

      <div class="row q-pa-md justify-end">
        <q-btn type="submit" color="secondary" style="width: 25%" label="Register" @click="register"></q-btn>
      </div>

  </div>
  </q-card>
</template>

<script>
  import {models} from 'feathers-vuex';
  import {mapState, mapActions} from 'vuex';
  import {vCheck} from 'src/mixins/ir-validate';
  const defaultRegister = () => {
    return {
      name: '',
      email: '',
      password: '',
    };
  };

  export default {
    name: 'Register',
    mixins: [vCheck],
    props: {
      signUpOn: Boolean
    },
    data() {
      return {
        updateValidOnInput: true,
        confirmPassword: '',
        form: defaultRegister(),
        passType: 'password',
      };
    },
    watch: {
      loadingAuth(newVal) {
        this.$isLoading(newVal);
      },
    },
    computed: {
      ...mapState('auth', {
        loadingAuth: 'isAuthenticatePending'
      }),
      vCheckForm(){
        return {...this.form, ...{ confirmPassword: this.confirmPassword}};
      },
      passStrength() {
        return this.passwordStrength(this.form.password);
      },
      passStrengthValue () {
        if (this.passStrength === 'Weak') {
          return .33333;
        } else if (this.passStrength === 'Medium') {
          return .66666;
        } else if (this.passStrength === 'Strong') {
          return 1;
        } else {
          return 0;
        }
      },
      linerProgressColor() {
        if (this.passStrength === 'Weak') {
          return 'red';
        } else if (this.passStrength === 'Medium') {
          return 'orange';
        } else if (this.passStrength === 'Strong') {
          return 'green';
        } else {
          return 'white';
        }
      },
      passwordMatchCheck(){
        return {
          confirmPassword: {
            name: 'Confirm Password',
            v: {
              check: 'sameAs',
              format: this.form.password,
              error: 'Passwords must match'
            }
          }
        };
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
          name: {
            name: 'Name',
            v: {
              check: 'notEmpty',
              arg: 'string',
              error: 'What\'s in a name?'
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
      passwordCheck(){
        this.$vCheck({ confirmPassword: this.confirmPassword }, this.passwordMatchCheck);
      },
      register() {
        const errors = this.$vCheck(this.vCheckForm);
        if (errors && errors.length) {
          errors.forEach(err => {
            this.$vErrNotify(err);
          });
        } else {
          let user = new models.api.Users(this.form).clone();
          user.create()
            .then(result => {
              this.$successNotify(`Welcome to Crayv ${result.name}`);
              this.authenticate({ email: result.email, password: result.password, strategy: 'local' })
                .then(() => {
                  this.$successNotify('You are now logged in');
                  setTimeout(() => {
                    this.form = defaultRegister();
                    this.confirmPassword = '';
                  }, 1500);
                })
                .catch(error => {
                  this.$errNotify('Error logging you in - try again ' + error.message);
                });
            })
            .catch(err => {
              console.log('sign up error', err);
              this.$errNotify('Sign Up Error ' + err.message);
            });
        }
      }
    },
  };
</script>

<style scoped lang="scss">

  .strength {
    width: 33.333%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
  }

</style>

