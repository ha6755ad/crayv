<template>
  <div id="BankDetails" class="col-6">
    <div class="row justify-between">
      <div class="text-h5">
        Bank Information:
      </div>
      <q-space/>
      <div>
        Add An Account <span><q-btn @click.stop="$emit('add')" icon="mdi-plus" flat/></span>
      </div>
    </div>
    <div>
      <div class="col-6 q-pl-xs" v-for="account in accounts" :key="`parent${account.id}`">
        <div class="col-6" :key="`child${account.id}`">
          <div>Bank Name: <span class="q-mx-xs">{{account.bank_name}}</span></div>
          <div>Account # (last 4 digits): XXXXXX{{account.last4}}</div>
          <div v-if="account.default_for_currency" style="margin: 0; padding: 0" class="flex items-center">
            <q-chip>
            Default Account
            </q-chip>
          </div>
          <div v-if="!account.default_for_currency">
            <!--              <q-toggle :value="account.default_for_currency" @input="defaultCurrency(account)" />-->
            <q-btn flat rounded dense style="width: 125px; height: 2em" label="Make Default" @click.stop="newDefault(account)" />
          </div>
        </div>
        <q-separator class="q-my-xs" style="width: 50%"/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BankDetails',
    props: {
      accounts: Array,
    },
    data() {
      return {
      };
    },
    mounted() {},
    watch: {},
    computed: {},
    methods: {
      newDefault(account) {
        let updateValue = {id: account.id, details: {default_for_currency: true}};
        // console.log('rerreererer', account.default_for_currency)
        this.$emit('defaultCurr', updateValue);
      }
    }
  };
</script>

<style scoped lang="scss">
  #BankDetails {
    width: 45%;
  }
</style>
