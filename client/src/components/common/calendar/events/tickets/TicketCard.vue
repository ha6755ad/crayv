<template>
  <q-card flat :class="`pointer q-ma-xs q-pa-md __ticket ${hovering ? '__hover' : ''}`" @pointerenter="hovering = true" @pointerleave="hovering = false" @touchstart="hovering=true" @touchend="hovering=false">
<!--    <q-icon color="primary" class="t-l" name="mdi-ticket-confirmation"/>-->
    <div class="q-mb-sm text-xxs text-mb-xxs" style="width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
      {{ticketIn.name}}
      <q-tooltip content-class="bg-dark text-light">{{ticketIn.name}}</q-tooltip>
    </div>
    <q-separator/>
    <div class="text-xxs text-mb-xxs text-weight-light">
      <v-clamp :max-lines="3" :autoresize="true">
        {{ticketIn.description}}
      </v-clamp>
    </div>
    <div class="row items-center justify-end">
      <div class="text-xxs text-mb-xxs text-right text-uppercase text-weight-medium">
        <q-btn size="sm" flat dense v-if="promoPrice" color="green-8">{{promoPrice.message}} <span v-if="promoPrice.exp">&nbsp;until {{getDateFormat(promoPrice.exp, 'MMM DD')}}</span></q-btn>
      </div>
    </div>
    <div class="row justify-end">
      <qty-picker v-model="quantity"/>
    </div>
    <div class="row justify-end items-center">
      <q-btn disable v-if="promoPrice" dense flat color="red" style="text-decoration: line-through">{{basePrice}}</q-btn>
      <q-btn dense flat :color="$darkest()" :icon="hovering ? 'mdi-plus' : 'mdi-ticket-confirmation'" :label="labelPrice" @click="register(ticketIn)">
        <q-tooltip content-class="bg-dark text-light">Buy Tickets</q-tooltip>
      </q-btn>
    </div>

    <q-dialog v-model="registerDialog">
      <q-card style="width: 500px; max-width: 95vw">
        <q-card-section>
        <div class="text-xs text-mb-xs text-weight-medium">You need a Follow account</div>
        <div class="text-xxs text-mb-xxs text-weight-light">to register for this event</div>
        </q-card-section>
        <login sign-up-on></login>
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script>
  import VClamp from 'vue-clamp';
  import {CartGen} from 'src/mixins/CartGen';
  import {mapGetters, mapState} from 'vuex';
  import QtyPicker from '../../../../common/atoms/pickers/QtyPicker';
  import Login from 'components/auth/Login';

  export default {
    name: 'TicketCard',
    components: { Login, QtyPicker, VClamp },
    mixins: [CartGen],
    props: {
      ticketIn: Object,
      eventIn: Object
    },
    async mounted(){
      await this.$store.dispatch('product-price/create', this.ticketIn)
        .then(res => {
          console.log('got res', res);
          this.pricing = res;
        }).catch(err => {
          console.log('error getting price', err);
        });
    },
    data(){
      return {
        hovering: false,
        pricing: {},
        cart: null,
        quantity: 1,
        registerDialog: false
      };
    },
    computed: {
      ...mapState('auth', { user: 'user' }),
      ...mapGetters('people', { getPerson: 'get' }),
      person() {
        return this.lget(this.user, '_fastjoin.hasPerson', this.getPerson(this.user.hasPerson));
      },
      basePrice(){
        return this.$dollarString(this.lget(this.ticketIn, 'price.basePrice', 0), '$', 2);
      },
      promoPrice(){
        return this.lget(this.pricing, 'list[0]', null);
      },
      labelPrice(){
        return this.promoPrice ? this.$dollarString(this.promoPrice.total, '$', 2) : this.basePrice;
      },
      cartId(){
        return this.stateCarts?.length ? this.$arrayFilterZero(this.stateCarts, null) : 'new-cart';
      }
    },
    methods: {
      cartOn(){
        this.$store.dispatch('toggleCart', true);
      },
      register(ticket){
        if(this.user) {
          this.addToCart(ticket, this.quantity, { id: this.eventIn._id });
        } else this.registerDialog = true;
      }
    }
  };
</script>

<style scoped lang="scss">
 .__ticket {
   height: 100%; width: 100%; transition: all .2s ease-out
 }

 .__hover {
   background: #eeeeee;
   box-shadow: 0 0 10px rgba(0,0,0,.5);
 }

</style>
