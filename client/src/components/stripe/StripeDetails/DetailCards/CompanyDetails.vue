<template>
  <div id="CompanyDetails" style="padding: 0; margin: 0; width: 100%">
    <div class="row flex justify-between full-width">
      <div class="text-h4">
        Company Details:
      </div>
      <div>
        <q-btn round flat icon="create" @click="editFields"/>
        <q-btn type="submit" form="company_info" flat round v-if="edit" icon="done"/>
      </div>
      <q-form id="company_info" @submit="updateCompanyInfo" class="col-6 q-pr-xs full-width">
        <q-input :readonly="!edit" hint="Company Name" v-model="company.name"/>
        <q-input :readonly="!edit" hint="Address Line 1" v-model="company.address.line1"/>
        <q-input :readonly="!edit" hint="Address Line 2" v-model="company.address.line2"/>
        <div id="city-state" class="row">
          <q-input class="col-6 q-pr-sm" :readonly="!edit" hint="City" v-model="company.address.city"/>
          <q-input class="col-6 q-pl-sm" :readonly="!edit" hint="State" v-model="company.address.state"/>
        </div>
        <div id="country-zip" class="row">
          <q-input class="col-6 q-pr-sm" :readonly="!edit" hint="Country"
                   v-model="company.address.country"/>
          <q-input class="col-6 q-pl-sm" :readonly="!edit" hint="Postal Code"
                   v-model="company.address.postal_code"/>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';

  export default {
    name: 'CompanyDetails',
    props: {
      info: Object
    },
    data() {
      return {
        edit: false,
        company: {
          address: {
            city: undefined,
            country: undefined,
            line1: undefined,
            line2: undefined,
            postal_code: undefined,
            state: undefined
          },
          name: undefined
        }
      };
    },
    mounted() {
      console.log('testing the info object', this.info);
      if (this.info && this.info.address) {
        this.company.address.line1 = this.info.address.line1;
        this.company.address.line2 = this.info.address.line2;
        this.company.address.city = this.info.address.city;
        this.company.address.state = this.info.address.state;
        this.company.address.postal_code = this.info.address.postal_code;
        this.company.address.country = this.info.address.country;
        this.company.name = this.info.name;
      }
    },
    watch: {},
    computed: {},
    methods: {
      ...mapActions('stripe-account', {update: 'update'}),
      editFields() {
        this.edit = !this.edit;
      },
      updateCompanyInfo() {
        this.editFields();
        this.$emit('companyInfo', {company: this.company});
      }
    }
  };
</script>

<style scoped lang="scss">
  #CompanyDetails {
    width: 45%;
  }
</style>
