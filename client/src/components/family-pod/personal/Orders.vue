<template>
  <q-card flat>
    <q-card-section>
      <div class="text-xs text-mb-xs text-weight-bold">Your Orders</div>
    </q-card-section>
    <q-card-section>
      <div class="col-12 q-gutter-sm">
        <q-card class="q-pa-md" v-for="(order, i) in stateOrders" :key="`order-${i}`">
          <div class="text-xxs text-mb-xxs text-weight-light">Order {{lget(order, 'confirmation.id', lget(order, 'reference.id'))}} - placed {{getDateFormat(lget(order, 'createdAt'), 'ddd MMM-DD YYYY h:mm a')}}</div>
          <q-list separator>
            <q-item style="position: relative" v-for="(product, idx) in order.products" :key="`order-product-${idx}`">
              <q-item-section avatar>
                <q-img style="height: 60px; width: 60px;" :src="getAvatar(product, 'images', 'large', 0)"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{product.quantity}} - {{product.name}}</q-item-label>
                <q-item-label caption>{{product.description}}</q-item-label>
                <q-item-label>
                  <q-btn flat color="primary" label="register for event" size="sm" v-show="isTicket(lget(product, 'types', []))" @click="editProduct(product)"/>
                </q-item-label>
                <div v-if="lget(order, 'status') !== 'complete'">
                  <q-btn color="primary" flat size="sm" :label="pendingLabel(order)" @click="pendingClick(order)"/>
                </div>
              </q-item-section>
              <q-item-section side class="text-uppercase text-primary text-weight-medium text-xxs text-mb-xxs">
                <div>Subtotal: {{$dollarString(lget(order, 'subtotal', lget(product, 'price.pricePaid', 0)), $getCurrencySymbol(product), 2)}}</div>
                <div>Tax: {{$dollarString( lget(order, 'tax', 0), $getCurrencySymbol(product), 2)}}</div>
                <div class="text-dark"> Total: {{$dollarString(lget(order, 'subtotal', 0) + lget(order, 'tax', 0), $getCurrencySymbol(product), 2)}}</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';

  export default {
    name: 'Orders',
    components: {  },
    async mounted() {
      await this.loadOrders({
        query: {
          person: this.user._id
        }
      }).then(res => {
        this.lget(res, 'data', []).map(a => a.clone()).forEach(order => {
          if(this.lget(this.$route, 'query.tx_ref') === order.cart){
            order.status = 'complete';
            order.confirmation.id = this.lget(this.$route, 'query.transaction_id');
            order.save();
          }
          else {
            let ref = this.lget(order, 'reference.id', false);
            if (this.lget(order, 'status', '') !== 'complete' && ref) {
              this.checkTransaction(ref, order, true);
            }
          }
        });
      });
    },
    data(){
      return {
        editing: null,
        transResponse: null,
        message: 'Your payment is pending, there are no further actions at this time. Please contact us with questions.',
        status: 'PENDING'
      };
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters('orders', { findOrders: 'find' }),
      stateOrders() {
        return this.findOrders({
          query: {
            person: this.user._id,
            $sort: { createdAt: -1 }
          },
        }).data.map(a => a.clone());
      }
    },
    methods: {
      ...mapActions('orders', { loadOrders: 'find' }),
      pendingLabel(order) {
        let refId = this.lget(order, 'reference.id');
        let label =  refId ? `Order ${this.status} - Check for updates` : 'Order Pending';
        console.log('label', label);
        return label;
      },
      pendingClick(order){
        let orderRef = this.lget(order, 'reference.id');
        if(orderRef) this.checkTransaction(orderRef, order);
        else {
          this.status = 'pending';
          this.message = 'Your payment is pending, there are no further actions at this time. Please contact us with questions.';
          this.initAlert();
        }
      },
      // TODO: handle pending stripe orders as well as blinq
      initAlert(order){
        this.$q.dialog({
          title: 'Order Status Update',
          message: this.message,
          cancel: {
            label: 'dismiss',
            color: 'secondary',
            textColor: 'dark',
            flat: true,
            size: 'sm'
          },
          ok: {
            label: this.lget(order, 'reference.url') ? 'try again' : 'ok',
            color: 'secondary',
            textColor: 'dark',
            push: true,
            size: 'sm'
          }
        }).onOk(() => {
          if(order && this.lget(order, 'reference.url')){
            window.open(this.lget(order, 'reference.url'), '_blank');
          }
        });
      },
      async checkTransaction(ref, order, stop_alert) {
        let passOrder = order;
        console.log('check it', ref);
        await this.$store.dispatch('flutterwave/get', ref)
          .then(res => {
            if(this.lget(res, 'status') === 'error'){
              res.errors.forEach((err, i) => {
                if( i < 5) this.$errNotify(err.field + ' - ' + err.message );
              });
            } else {
              console.log('got trans', res);
              let r = this.lget(res, 'data');
              this.transResponse = r;
              let status = this.lget(r, 'status', 'PENDING');
              this.status = status;
              if (['PENDING', 'PARTIALLY_PAID'].includes(status.toUpperCase())) {
                this.message = `Your payment is in ${status} status. If you need help, please contact us.`;
              } else if (['CANCELLED', 'FAILED', 'EXPIRED'].includes(status.toUpperCase())) {
                this.$store.dispatch('orders/patch', [order._id, { status: 'cancelled' }]);
                this.message = `Your payment is in ${status} status. Please contact us for help. We're sorry for the inconvenience.`;
              } else if (status === 'OVERPAID') {
                this.$store.dispatch('orders/patch', [order._id, { status: 'complete' }]);
                this.message = `Your order is ${status}. Please contact us for help. We're sorry for the inconvenience.`;
                passOrder = false;
              } else if (status.toUpperCase() === 'SUCCESSFUL') {
                this.$store.dispatch('orders/patch', [order._id, { status: 'complete' }]);
                this.message = 'Your order has been completed';
                passOrder = false;
              }
              if (!stop_alert) this.initAlert(passOrder);
            }
          })
          .catch(err => {
            console.error('transaction error', err);
          });
      },
      isTicket(types){
        let ticket = false;
        types.forEach(type => {
          let t = this.lget(type, 'name');
          if(this.lget(t, 'name', '').toLowerCase().indexOf('ticket') > -1) {
            ticket = true;
          }
        });
        return ticket;
      },
      editProduct(product){
        this.editing = product;
      // if(this.isTicket(this.lget(product, 'types', []))) this.ticketDialog = true;
      }
    }
  };
</script>
