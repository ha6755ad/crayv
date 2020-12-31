<!--<template>-->
<!--  <div id="AddressDetails" style="padding: 0; margin: 0;">-->
<!--    <div class="row flex justify-between">-->
<!--      <div class="text-h4">-->
<!--        Address Details:-->
<!--      </div>-->
<!--      <div>-->
<!--        <q-btn round flat icon="create" @click="editFields"/>-->
<!--        <q-btn type="submit" form="address_fields" flat round v-if="edit" icon="done"/>-->
<!--      </div>-->
<!--    </div>-->
<!--    <q-form @submit.prevent="updateAddress" id="address_fields">-->
<!--      <q-input :readonly="!edit" hint="Address Line 1" v-model="address.line1"/>-->
<!--      <q-input :readonly="!edit" hint="Address Line 2" v-model="address.line2"/>-->
<!--      <div id="city-state" class="row">-->
<!--        <q-input class="col-6 q-pr-sm" :readonly="!edit" hint="City" v-model="address.city"/>-->
<!--        <q-input class="col-6 q-pl-sm" :readonly="!edit" hint="State" v-model="address.state"/>-->
<!--      </div>-->
<!--      <div id="country-zip" class="row">-->
<!--        <q-input class="col-6 q-pr-sm" :readonly="!edit" hint="Country"-->
<!--                 v-model="address.country"/>-->
<!--        <q-input class="col-6 q-pl-sm" :readonly="!edit" hint="Postal Code"-->
<!--                 v-model="address.postal_code"/>-->
<!--      </div>-->
<!--    </q-form>-->
<!--    &lt;!&ndash;    <q-btn @click="test" label="test"/>&ndash;&gt;-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--  import {mapActions, mapState} from 'vuex';-->

<!--  export default {-->
<!--    name: 'AddressDetails',-->
<!--    props: {-->
<!--      accountAddress: Object-->
<!--    },-->
<!--    data() {-->
<!--      return {-->
<!--        edit: false,-->
<!--        vendor: {},-->
<!--        address: {-->
<!--          city: '',-->
<!--          country: '',-->
<!--          line1: '',-->
<!--          line2: '',-->
<!--          postal_code: '',-->
<!--          state: ''-->
<!--        }-->
<!--      }-->
<!--    },-->
<!--    mounted() {-->
<!--      this.address.line1 = this.accountAddress.line1-->
<!--      this.address.line2 = this.accountAddress.line2-->
<!--      this.address.city = this.accountAddress.city-->
<!--      this.address.state = this.accountAddress.state-->
<!--      this.address.postal_code = this.accountAddress.postal_code-->
<!--      this.address.country = this.accountAddress.country-->
<!--    },-->
<!--    watch: {-->
<!--      vendorContext: {-->
<!--        immediate: true,-->
<!--        handler(newVal) {-->
<!--          if (newVal) {-->
<!--            this.vendor = this.vendorContext-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--    },-->
<!--    computed: {-->
<!--      ...mapState({vendorContext: 'vendorContext'}),-->

<!--    },-->
<!--    methods: {-->
<!--      ...mapActions('stripe-account', {updateAddress: 'update'}),-->
<!--      editFields() {-->
<!--        this.edit = !this.edit-->
<!--      },-->
<!--      updateAddress() {-->
<!--        this.$emit('addressform', this.address)-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--</script>-->

<!--<style scoped lang="scss">-->
<!--  #AddressDetails {-->
<!--    width: 45%;-->
<!--  }-->
<!--</style>-->
