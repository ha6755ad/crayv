<template>
  <div style="position: relative">
    <q-btn v-show="!registering" size="sm" flat label="sign up" class="t-r" @click="registering=true"/>
    <q-btn v-show="registering" size="sm" flat label="login" class="t-r" @click="registering=false"/>
    <template v-if="registering">
      <register></register>
    </template>
    <template v-else>
      <login></login>
    </template>
  </div>
</template>

<script>
  import Register from 'components/auth/Register';
  import Login from 'components/auth/Login';
  export default {
    name: 'LoginOrRegister',
    components: { Login, Register },
    props: {
      register: { type: Boolean, default: true }
    },
    data(){
      return {
        registering: true
      };
    },
    watch: {
      register: {
        immediate: true,
        handler(newVal){
          this.registering = newVal;
        }
      }
    }
  };
</script>

<style scoped>

</style>
