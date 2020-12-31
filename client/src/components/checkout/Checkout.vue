<template>
  <q-page>
    <checkout-drawer></checkout-drawer>
  </q-page>
</template>

<script>
  import CheckoutDrawer from './CheckoutDrawer';
  export default {
    name: 'Checkout',
    components: { CheckoutDrawer },
    computed: {

    }
  };
</script>
