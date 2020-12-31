<template>
  <q-form style="width: 100%;">
    <span class="text-light q-my-md spanBanner">
      Business Profile
    </span>
    <q-input :rules="[notEmptyRule]"
      label="Company Name" v-model="business_profile.name" class="q-ma-md" outlined>
      <template v-slot:prepend>
        <q-icon name="edit" class="icon1"/>
      </template>
    </q-input>
    <q-input :rules="[notEmptyRule]"
      label="Product/Service Description" v-model="business_profile.product_description" class="q-ma-md" outlined>
      <template v-slot:prepend>
        <q-icon name="phone" class="icon2"/>
      </template>
    </q-input>
    <q-select
      clearable
      :rules="[notEmptyRule]"
      class="q-ma-md"
      outlined
      emit-value
      option-value="number"
      option-label="name"
      :options="merchantCategories"
      v-model="business_profile.mcc"
      label="Product/Service Type">
      <template v-slot:prepend>
        <q-icon name="store" class="icon3"/>
      </template>
    </q-select>
    <vue-tel-input
      style=""
      label="Phone"
      inputClasses="tel-input-class"
      v-model="phone_number_value"
      :mode="'international'"
      @input="getPhone"
      :validCharactersOnly="true"
      :dynamicPlaceholder="true"
      :preferredCountries="['US','CA','MX','GB']"
      required
    ></vue-tel-input>
    <q-input :rules="[notEmptyRule, emailRule]"
      label="Support Email" v-model="business_profile.support_email" class="q-ma-md" outlined>
      <template v-slot:prepend>
        <q-icon name="phone" class="icon2"/>
      </template>
    </q-input>
    <q-input :rules="[notEmptyRule, validUrl]"
      label="Support Url" v-model="business_profile.support_url" class="q-ma-md" outlined>
      <template v-slot:prepend>
        <q-icon name="phone" class="icon2"/>
      </template>
    </q-input>
    <q-input :rules="[notEmptyRule, validUrl]"
      label="Business Url" v-model="business_profile.url" class="q-ma-md" outlined>
      <template v-slot:prepend>
        <q-icon name="phone" class="icon2"/>
      </template>
    </q-input>
    <span class="text-light q-my-md spanBanner">
          Business Profile Address
        </span>
    <q-input :rules="[notEmptyRule]"
      v-model="business_profile.support_address.city" label="City" class="q-ma-md" outlined>
      <template v-slot:prepend>
        <q-icon name="apartment" class="icon1"/>
      </template>
    </q-input>
    <q-select class="q-ma-md"
              v-model="business_profile.support_address.country"
              :options="countries"
              outlined
              map-options
              :rules="[notEmptyRule]"
              emit-value
              option-value="id"
              option-label="name"
              label="Country"
    >
      <template v-slot:prepend>
        <q-icon name="flag" class="icon2"/>
      </template>
    </q-select>
    <q-select class="q-ma-md"
              :rules="[notEmptyRule]"
              v-model="business_profile.support_address.state"
              :options="states"
              outlined
              map-options
              emit-value
              option-value="id"
              option-label="name"
              label="State"
    >
      <template v-slot:prepend>
        <q-icon name="explore" class="icon3"/>
      </template>
    </q-select>
    <q-input :rules="[notEmptyRule]"
      v-model="business_profile.support_address.line1" label="Address Line 1" class="q-ma-md" outlined>
      <template v-slot:prepend>
        <q-icon name="house" class="icon4"/>
      </template>
    </q-input>
    <q-input :rules="[notEmptyRule]"
      v-model="business_profile.support_address.line2" label="Address Line 2" class="q-ma-md" outlined>
      <template v-slot:prepend>
        <q-icon name="home_work" class="icon5"/>
      </template>
    </q-input>
    <q-input :rules="[notEmptyRule]"
      v-model="business_profile.support_address.postal_code" label="Zip Code" class="q-ma-md" outlined>
      <template v-slot:prepend>
        <q-icon name="local_shipping" class="icon1"/>
      </template>
    </q-input>
    <q-btn class="q-mr-md" color="indigo" @click="save">Save & Continue</q-btn>
  </q-form>
</template>

<script>
  import Mcc from 'src/mixins/merchantCategories';

  export default {
    name: 'BusinessProfile',
    props: {
      countries: Array,
      states: Array,
    },
    data() {
      return {
        phone_number_value: {},
        business_profile: {
          mcc: undefined,
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
          url: undefined
        },
      };
    },
    computed: {
      merchantCategories(){
        return Mcc;
      }
    },
    methods: {
      save() {
        this.$emit('save', {business_profile: this.business_profile});
      },
      getPhone (number, isValid) {
        this.business_profile.support_phone = isValid;
      },
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
