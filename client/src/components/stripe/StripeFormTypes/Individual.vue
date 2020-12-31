<template>
  <q-form style="width: 100%;">
              <span class="text-light q-my-md spanBanner">
          Individual Information
        </span>
    <q-input
      label="First Name"
      v-model="individual.first_name"
      class="q-ma-md"
      outlined
    >
      <template v-slot:prepend>
        <q-icon name="face" class="icon1"/>
      </template>
    </q-input>
    <q-input
      v-model="individual.last_name"
      label="Last Name"
      class="q-ma-md"
      outlined
    >
      <template v-slot:prepend>
        <q-icon name="person" class="icon2"/>
      </template>
    </q-input>
    <q-input
      v-model="individual.email"
      label="Email"
      class="q-ma-md"
      outlined
    >
      <template v-slot:prepend>
        <q-icon name="email" class="icon3"/>
      </template>
    </q-input>
    <q-input @input="dateConverter" label="Date of Birth" class="q-ma-md" placeholder="Ex: 2001/08/20" outlined
             v-model="date" mask="date" :rules="['date']">
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer icon4">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date v-model="date" @input="() => $refs.qDateProxy.hide()" color="indigo"/>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <span class="text-light q-my-md spanBanner">
          Address
        </span>
      <q-input v-model="individual.address.city" label="City" class="q-ma-md" outlined>
        <template v-slot:prepend>
          <q-icon name="apartment" class="icon1"/>
        </template>
      </q-input>
      <q-select class="q-ma-md" v-model="individual.address.country" :options="countries" outlined map-options
                emit-value option-value="id" option-label="name" label="Country">
        <template v-slot:prepend>
          <q-icon name="flag" class="icon2"/>
        </template>
      </q-select>
    <q-select class="q-ma-md" v-model="individual.address.state" :options="states" outlined map-options
              emit-value option-value="id" option-label="name" label="State">
      <template v-slot:prepend>
        <q-icon name="explore" class="icon3"/>
      </template>
    </q-select>
      <q-input v-model="individual.address.line1" label="Address Line 1" class="q-ma-md" outlined>
        <template v-slot:prepend>
          <q-icon name="house" class="icon4"/>
        </template>
      </q-input>
      <q-input v-model="individual.address.line2" label="Address Line 2" class="q-ma-md" outlined>
        <template v-slot:prepend>
          <q-icon name="home_work" class="icon5"/>
        </template>
      </q-input>
      <q-input v-model="individual.address.postal_code" label="Zip Code" class="q-ma-md" outlined>
        <template v-slot:prepend>
          <q-icon name="local_shipping" class="icon1"/>
        </template>
      </q-input>
    <q-btn class="q-mr-md" color="indigo" @click="save('save')">Save & Continue</q-btn>
  </q-form>

</template>

<script>
  export default {
    name: 'Individual',
    props: {
      countries: Array,
      states: Array,
    },
    data() {
      return {
        date: '',
        individual: {
          first_name: '',
          last_name: '',
          email: '',
          dob: {
            day: '',
            month: '',
            year: '',
          },
          address: {
            city: '',
            country: '',
            line1: '',
            line2: '',
            postal_code: '',
            state: '',
          }
        },
      };
    },
    methods: {
      dateConverter() {
        this.individual.dob.year = this.date.substr(0, 4);
        this.individual.dob.month = this.date.substr(5, 2);
        this.individual.dob.day = this.date.substr(8, 2);

        console.log(this.individual);
      },
      save(type){
        if(type === 'save'){
          this.$emit('save', {individual: this.individual});
        }else {
          this.$emit('changeStep', 'back');
        }

      }
    },
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
