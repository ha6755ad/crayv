<template>
  <q-form style="width: 100%;">
    <span class="text-light q-my-md spanBanner">
      Company Information
    </span>
    <q-input label="Company Name" v-model="company.name" class="q-ma-md" outlined>
      <template v-slot:prepend>
        <q-icon name="edit" class="icon1"/>
      </template>
    </q-input>
    <q-input label="Company Phone" v-model="company.phone" class="q-ma-md" outlined>
      <template v-slot:prepend>
        <q-icon name="phone" class="icon2"/>
      </template>
    </q-input>
    <span class="text-light q-my-md spanBanner">
          Company Address
        </span>
    <q-input v-model="company.address.city" label="City" class="q-ma-md" outlined>
      <template v-slot:prepend>
        <q-icon name="apartment" class="icon1"/>
      </template>
    </q-input>
    <q-select class="q-ma-md" v-model="company.address.country" :options="countries" outlined map-options
              emit-value option-value="id" option-label="name" label="Country">
      <template v-slot:prepend>
        <q-icon name="flag" class="icon2"/>
      </template>
    </q-select>
    <q-select class="q-ma-md" v-model="company.address.state" :options="states" outlined map-options
              emit-value option-value="id" option-label="name" label="State">
      <template v-slot:prepend>
        <q-icon name="explore" class="icon3"/>
      </template>
    </q-select>
    <q-input v-model="company.address.line1" label="Address Line 1" class="q-ma-md" outlined>
      <template v-slot:prepend>
        <q-icon name="house" class="icon4"/>
      </template>
    </q-input>
    <q-input v-model="company.address.line2" label="Address Line 2" class="q-ma-md" outlined>
      <template v-slot:prepend>
        <q-icon name="home_work" class="icon5"/>
      </template>
    </q-input>
    <q-input v-model="company.address.postal_code" label="Zip Code" class="q-ma-md" outlined>
      <template v-slot:prepend>
        <q-icon name="local_shipping" class="icon1"/>
      </template>
    </q-input>
    <q-btn class="q-mr-md" color="indigo" @click="save('save')">Save & Continue</q-btn>
  </q-form>
</template>

<script>
  // const company = {
  //   "company": {
  //     "address": {
  //       "city": "Pleasant Grove",
  //       "country": "US",
  //       "line1": "1064 N N County Blvd",
  //       "line2": "ste 150",
  //       "postal_code": "84062",
  //       "state": "UT"
  //     },
  //     "directors_provided": false,
  //     "executives_provided": true,
  //     "name": "IonRev LLC",
  //     "owners_provided": true,
  //     "phone": "+18014001012",
  //     "tax_id_provided": true,
  //     "verification": {
  //       "document": {
  //         "back": null,
  //         "details": null,
  //         "details_code": null,
  //         "front": null
  //       }
  //     }
  //   },
  // }
  export default {
    name: 'Business',
    props: {
      countries: Array,
      states: Array,
    },
    data() {
      return {
        company: {
          name: '',
          phone: '',
          address: {
            city: '',
            country: '',
            line1: '',
            line2: '',
            postal_code: '',
            state: '',
          }
        }
      };
    },
    methods: {
      save(type){
        if(type === 'save'){
          this.$emit('save', {company: this.company});
        }else {
          this.$emit('changeStep', 'back');
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
