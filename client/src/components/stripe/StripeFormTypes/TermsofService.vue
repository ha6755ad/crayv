<template>
  <q-card flat style="border-radius: 15px;">
    <q-form>
              <span class="text-light q-my-md spanBanner">
                    Terms of Service
              </span>
      <q-card-section>
        <q-checkbox color="blue" v-model="tos"/>
        <span style="font-size: 1.05rem;">By registering your account, you agree to our <a style="text-decoration: none;color: blue;font-weight: bold;" target="blank" href="https://stripe.com/legal">Services Agreement</a> and the <a style="text-decoration: none;color: blue;font-weight: bold;" target="blank" href="https://stripe.com/connect-account/legal">Stripe Connected Account Agreement</a>.</span>
      </q-card-section>
      <q-btn class="q-mr-md" color="indigo" @click="save('finish')">Finish</q-btn>
    </q-form>
  </q-card>
</template>

<script>
  export default {
    name: 'TermsofService',
    data(){
      return {
        tos: false,
      };
    },
    methods: {
      save(type){
        if(type === 'save'){
          this.$emit('changeStep', 'save');
        }else if(type === 'back'){
          this.$emit('changeStep', 'back');
        }else {
          this.$emit('changeStep', 'finish');
        }

      }
    }
  };
</script>

<style scoped>
  .spanBanner {
    background: #C490D1;
    font-size: 27px;
    border-radius: 8px;
    display: flex;
    width: 60%;
    justify-content: center;
  }
  .icon1 {
    color: #D7263D;
  }
  .icon2 {
    color: #F46036;
  }
  .icon3 {
    color: #2D93AD;
  }
  .icon4 {
    color: #1B998B;
  }
  .icon5 {
    color: #C5D86D;
  }
</style>
