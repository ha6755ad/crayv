<template>
  <div>
    <div class="q-pa-sm text-xxs text-mb-xxs text-weight-bold" v-if="title">{{title}}</div>
  <div style="width: 500px; max-width: 100%">
    <vue-tel-input :preferredCountries="preferredCountries" :value="lget(value, 'number.e164')" @input="setPhone"/>
  </div>
  </div>
</template>

<script>
  import {SelectMixin} from 'src/mixins/SelectMixin';
  import 'vue-tel-input/dist/vue-tel-input.css';

  export default {
    name: 'PhoneForm',
    mixins: [SelectMixin],
    props: {
      title: { type: String, default: 'Phone Number' },
      preferredCountries: {
        type: Array,
        default: () => {
          return ['NG','US'];
        }
      },
      multiple: Boolean,
      emitValue: Boolean,
      optionValue: String,
      value: { required: false }
    },
    methods: {
      setPhone(number, isValid) {
        console.log('phone entry', isValid);
        if (isValid.valid) {
          let numberObj = {
            ...isValid,
            ...{
              number: {
                e164: isValid.number,
                national: isValid.nationalNumber,
                significant: isValid.formatted
              }
            }
          };
          this.handleInput(numberObj);
        }
      }
    }
  };
</script>

<style scoped>

</style>
