<template>
  <div style="position: relative">
    <div @pointerenter="tip = true" @pointerleave="tip = false" @touch="tip = true" :class="textClass">
      Tax: <template v-if="true">{{ $dollarString(taxTotal, '$', 2) }}</template>
      <template v-else>  <q-btn size="sm" flat color="primary" :label="postal_code ? postal_code : 'Enter Postal Code'">
        <q-popup-edit :value="postal_code_input">
      <q-input label="Postal Code" v-model="postal_code_input" @keyup.enter="postal_code = postal_code_input">
        <template v-slot:append>
          <q-btn round flat icon="mdi-check" color="primary" @click="postal_code = postal_code_input"/>
        </template>
      </q-input>
        </q-popup-edit>
      </q-btn></template>
    </div>
    <div class="text-xxs text-mb-xxs text-weight-bold">
      <div>
        {{ city }}
        <q-popup-edit :value="city">
          <q-input label="City" v-model="city"/>
        </q-popup-edit>
      </div>
    </div>
    <div class="__tax_popup" :style="tip ? {} : {height: 0, width: 0}">
      <q-card dark>
        <q-card-section class="text-0-8">
          <div style="white-space: nowrap"></div>

        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';

  export default {
    name: 'TaxLine',
    props: {
      addressIn: Object,
      productIn: Object,
      textClass: {
        type: String,
        default: 'text-xxs text-mb-xxs text-weight-light'
      }
    },
    mounted(){
      let address = this.lget(this.vendorSettings, 'address') ?  this.lget(this.vendorSettings, 'address.postal'): this.lget(this.user, 'address.postal');
      if(address){
        this.postal_code = this.lget(address, 'postal', null);
      }
    },
    data() {
      return {
        tip: false,
        city: null,
        postal_code: null,
        postal_code_input: ''
      };
    },
    watch: {
      postal_code: {
        immediate: true,
        handler(newVal, oldVal){
          if(newVal && newVal !== oldVal){
            this.getSalesTax1();
          }
        }
      }
    },
    computed: {
      ...mapGetters({ vendorContext: 'vendorContext' }),
      ...mapGetters('auth', {user: 'user'}),
      person(){
        return this.user;
      },
      salesTax() {
        return this.lget(this.productIn, 'settings.taxes.sales.amt', 0);
      },
      localTax() {
        return this.lget(this.productIn, 'settings.taxes.local.amt', 0);
      },
      otherTax() {
        return this.lget(this.productIn, 'settings.taxes.other.amt', 0);
      },
      taxTotal() {
        return this.salesTax + this.localTax + this.otherTax;
      }
    },
    methods: {
      ...mapActions('crayv-sales-tax', { getTax: 'find' }),
      async getSalesTax1() {
        let sales = await this.getSalesTax();
        console.log('sales tax', sales);
      },
      getSalesTax() {
        return this.getTax({
          query: {
            city: this.city,
            postal_code: this.postal_code,
          }
        });
      }
    }
  };
</script>

<style scoped lang="scss">
.__tax_popup {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  transform: translate(-100%, -100%);
  overflow: hidden;
  transition: all .2s ease-out;
}
</style>
