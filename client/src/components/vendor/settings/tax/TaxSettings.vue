<template>
  <div>
    <q-list>
      <q-item v-if="!form.taxExempt">
        <q-item-section avatar>
          <q-checkbox color="nice" v-model="form.automateTaxes"
                      @input="$emit('input', form)"></q-checkbox>
        </q-item-section>
        <q-item-section>
          <q-item-label>Automate tax rates</q-item-label>
          <q-item-label caption>
            {{
              form.automateTaxes ? 'You are allowing our smart tax database to decide your tax rates.' : 'Its up to you to dictate your tax rates and boundaries'
            }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator></q-separator>
      <q-item>
        <q-item-section avatar>
          <q-checkbox color="nice" v-model="form.taxExempt"
                      @input="$emit('input', form)"></q-checkbox>
        </q-item-section>
        <q-item-section>
          <q-item-label>Tax Exempt</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <custom-tax-form></custom-tax-form>
  </div>
</template>

<script>
  import CustomTaxForm from 'components/products/tax/CustomTaxForm';
  export default {
    name: 'TaxSettings',
    components: { CustomTaxForm },
    props: {
      value: Object
    },
    data(){
      return {
        form: {}
      };
    },
    watch: {
      value: {
        immediate: true,
        deep: true,
        handler(newVal){
          if(newVal) {
            Object.assign(this.form, Object.assign({}, newVal));
          }
        }
      }
    }
  };
</script>

<style scoped lang="scss">

</style>
