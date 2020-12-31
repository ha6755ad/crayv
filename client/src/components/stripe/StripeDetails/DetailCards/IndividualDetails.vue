<template>
  <div id="AddressDetails" style="padding: 0; margin: 0; width: 100%">
    <div class="row flex justify-between full-width">
      <div class="text-h5">
        Individual Details:
<!--        <q-btn @click="test" />-->
      </div>
      <div>
        <q-btn round flat icon="create" @click="editFields"/>
        <q-btn type="submit" form="address_fields" flat round v-if="edit" icon="done"/>
      </div>
    </div>
    <div class="row">
    <q-form @submit.prevent="updateAddress" id="address_fields" class="col-6 q-pr-xs">
      <q-input :readonly="!edit" hint="Address Line 1" v-model="individual.address.line1"/>
      <q-input :readonly="!edit" hint="Address Line 2" v-model="individual.address.line2"/>
      <div id="city-state" class="row">
        <q-input class="col-6 q-pr-sm" :readonly="!edit" hint="City" v-model="individual.address.city"/>
        <q-input class="col-6 q-pl-sm" :readonly="!edit" hint="State" v-model="individual.address.state"/>
      </div>
      <div id="country-zip" class="row">
        <q-input class="col-6 q-pr-sm" :readonly="!edit" hint="Country"
                 v-model="individual.address.country"/>
        <q-input class="col-6 q-pl-sm" :readonly="!edit" hint="Postal Code"
                 v-model="individual.address.postal_code"/>
      </div>
    </q-form>
    <q-form class="col-6 q-pl-xs">
      <div class="row">
        <q-input class="col-6 q-pr-sm" :readonly="!edit" hint="First Name" v-model="individual.first_name"/>
        <q-input class="col-6 q-pl-sm" :readonly="!edit" hint="Last Name" v-model="individual.last_name"/>
      </div>
      <div>
        <q-input :readonly="!edit" hint="E-mail" v-model="individual.email"/>
        <q-input :readonly="!edit" hint="Phone Number" v-model="individual.phone"/>
      </div>
    </q-form>
    </div>
    <!--    <q-btn @click="test" label="test"/>-->
  </div>
</template>

<script>

  export default {
    name: 'IndividualDetails',
    props: {
      info: Object
    },
    data() {
      return {
        edit: false,
        individual: {
          address: {
            city: undefined,
            country: undefined,
            line1: undefined,
            line2: undefined,
            postal_code: undefined,
            state: undefined
          },
          email: undefined,
          first_name: undefined,
          last_name: undefined,
          phone: undefined
        }
      };
    },
    mounted() {
      if (this.info) {
        if (this.info.address) {
          this.individual.address.line1 = this.info.address.line1;
          this.individual.address.line2 = this.info.address.line2;
          this.individual.address.city = this.info.address.city;
          this.individual.address.state = this.info.address.state;
          this.individual.address.postal_code = this.info.address.postal_code;
          this.individual.address.country = this.info.address.country;
        }
        this.individual.email = this.info.email;
        this.individual.first_name = this.info.first_name;
        this.individual.last_name = this.info.last_name;
        this.individual.phone = this.info.phone;
      }
    },
    watch: {},
    computed: {},
    methods: {
      editFields() {
        this.edit = !this.edit;
      },
      updateAddress() {
        this.editFields();
        this.$emit('addressform', {individual: this.individual});
      },
      test(){
        console.log('this.info', this.info);
      }
    }
  };
</script>

<style scoped lang="scss">
  #AddressDetails {
    width: 45%;
  }
</style>
