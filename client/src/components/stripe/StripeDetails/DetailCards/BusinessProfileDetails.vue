<template>
  <div id="BusinessProfileDetails" style="padding: 0; margin: 0; width: 100%">
    <div class="row flex justify-between full-width">
      <div class="text-h4">
        Business Profile Details:
      </div>
      <div>
        <q-btn round flat icon="create" @click="editFields"/>
        <q-btn type="submit" form="business_profile" flat round v-if="edit" icon="done"/>
      </div>
    </div>
    <q-form @submit.prevent="updateBusinessProfile" id="business_profile" class="full-width">
      <div>
        <q-input :readonly="!edit" hint="Company Name" v-model="business_profile.name"/>
      </div>
      <div class="row">
        <q-input class="col-6 q-pr-sm" type="email" :readonly="!edit" hint="Support Email"
                 v-model="business_profile.support_email"/>
        <q-input class="col-6 q-pl-sm" :readonly="!edit" hint="Support Phone" v-model="business_profile.support_phone"/>
      </div>
      <div class="row">
        <q-input class="col-6 q-pr-sm" :readonly="!edit" hint="Address Line 1"
                 v-model="business_profile.support_address.line1"/>
        <q-input class="col-6 q-pl-sm" :readonly="!edit" hint="Address Line 2"
                 v-model="business_profile.support_address.line2"/>
        <q-input class="col-6 q-pr-sm" :readonly="!edit" hint="City" v-model="business_profile.support_address.city"/>
        <q-input class="col-6 q-pl-sm" :readonly="!edit" hint="State" v-model="business_profile.support_address.state"/>
        <q-input class="col-6 q-pr-sm" :readonly="!edit" hint="Country"
                 v-model="business_profile.support_address.country"/>
        <q-input class="col-6 q-pl-sm" :readonly="!edit" hint="Postal Code"
                 v-model="business_profile.support_address.postal_code"/>
      </div>
      <div class="row">
        <q-input class="col-6 q-pr-sm" :readonly="!edit" autogrow hint="Product Description"
                 v-model="business_profile.product_description"/>
        <q-input class="col-6 q-pl-sm" :readonly="!edit" hint="Support Url" v-model="business_profile.support_url"/>
      </div>
    </q-form>
  </div>
</template>

<script>
  export default {
    name: 'BusinessProfileDetails',
    props: {
      profile: Object
    },
    data() {
      return {
        edit: false,
        business_profile: {
          name: undefined,
          product_description: undefined,
          support_address: {
            city: undefined,
            country: undefined,
            line1: undefined,
            line2: undefined,
            postal_code: undefined,
            state: undefined
          },
          support_email: undefined,
          support_phone: undefined,
          support_url: undefined,
        }
      };
    },
    mounted() {
      if (this.profile.business_profile) {
        if (this.profile.business_profile.support_address) {
          this.business_profile.support_address.line1 = this.profile.business_profile.support_address.line1;
          this.business_profile.support_address.line2 = this.profile.business_profile.support_address.line2;
          this.business_profile.support_address.city = this.profile.business_profile.support_address.city;
          this.business_profile.support_address.state = this.profile.business_profile.support_address.state;
          this.business_profile.support_address.postal_code = this.profile.business_profile.support_address.postal_code;
          this.business_profile.support_address.country = this.profile.business_profile.support_address.country;
        }
        this.business_profile.name = this.profile.business_profile.name;
        this.business_profile.product_description = this.profile.business_profile.product_description;
        this.business_profile.support_email = this.profile.business_profile.support_email;
        this.business_profile.support_phone = this.profile.business_profile.support_phone;
        this.business_profile.support_url = this.profile.business_profile.support_url;
      }
    },
    watch: {},
    computed: {},
    methods: {
      editFields() {
        this.edit = !this.edit;
      },
      updateBusinessProfile() {
        this.editFields();
        this.$emit('businessProfile', {business_profile: this.business_profile});
      },
      test() {
        console.log('business profile testing', this.profile.business_profile);
      }
    }
  };
</script>

<style scoped lang="scss">
  #BusinessProfileDetails {
    width: 45%;
  }
</style>
