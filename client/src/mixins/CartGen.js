import {models} from 'feathers-vuex';
import {mapGetters} from 'vuex';
const lget = require('lodash.get');

export const CartGen = {
  computed: {
    ...mapGetters('crayv-carts', {findCarts: 'find'}),
    stateCarts(){
      let carts = this.findCarts({
        query: {
          person: this.lget(this.$store.state.auth, 'user.hasPerson', '$'),
          active: true
        }
      }).data;
      if(carts) return carts.map(a => a.clone());
      else return [];
    },
  },

  methods: {
    async addToCart(product, quantity, options, group_order) {
      let curr = lget(product, 'price.currency', 'usd');
      let quant = quantity ? quantity : 1;
      let stateCart = this.$arrayFilterZero(this.stateCarts.filter(a => a.currency === curr), false);
      let cart = stateCart ? stateCart : null;
      console.log('add to cart', product, curr, cart);
      if (!cart) {
        let c = new models.api.CrayvCarts({ person: this.lget(this.user, '_id'), active: true, currency: curr }).clone();
        cart = await c.save({
          '$populateParams': {
            name: 'withLines'
          }
        });
      }
      let obj = { product: this.$createProductOrder(product, quant, options, group_order), cart: cart._id };
      if(group_order) obj.group_order = group_order._id;
      let line = new models.api.CrayvCartLines(obj).clone();

      return await line.save({
        '$populateParams': {
          name: 'withProduct'
        }
      })
        .then(async res => {
          await cart.save({
            '$populateParams': {
              name: 'withLines'
            }
          }).then(() => {
            this.$store.dispatch('toggleCart', true);
            return res;
          });
        }).catch(err => {
          this.$errNotify('error adding to cart - ' + err.message);
          console.log('error saving cart', err);
        });

    }
  }
};
