<template>
  <div style="width: 100%; position: relative">
    <q-card-section>
      <div class="row items-center">
        <div class="col-3">
          <div class="row justify-center">
              <q-img @click.stop="productDialog = true" id="img_col" class="q-mr-md" :style="{ height: size + 'px', width: size + 'px' }" :src="getAvatar(product, 'images', 'large', 0, defaultImg)"></q-img>
          </div>
        </div>
        <div class="col-9">
          <div @click.stop="productDialog = true" class="text-weight-bold text-sm text-mb-sm pointer">{{ product.name }}</div>
          <div class="text-weight-light text-xxs text-mb-xs"
               style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%">
            {{ product.description }}
          </div>
          <q-separator class="q-my-xs"/>
          <div class="row" style="width: 100%">
            <div class="text-xxxs text-mb-xxxs">Added: {{ getDateFormat(cartLine.createdAt, 'MMM DD, YYYY h:mm a') }}
              <div style="display: flex; align-items: flex-start">
                <q-btn icon="mdi-delete" round flat size="xs" @click="removeLine">
                  <q-tooltip>Remove From Cart</q-tooltip>
                </q-btn>
                <q-btn icon="mdi-pencil" round flat size="xs" @click.stop="productDialog = true">
                  <q-tooltip>Edit Item</q-tooltip>
                </q-btn>
              </div>
            </div>
            <q-space/>
            <div>
              <div class="text-xxs text-mb-xxs text-weight-light pointer">Qty: {{ quantity }} <q-icon class="q-mx-xs q-mb-xs" name="mdi-pencil" size="12px"/>
                <q-popup-edit :value="lget(cartLine, 'product.quantity', 0)">
                  <q-input :value="lget(cartLine, 'product.quantity', 0)" @input="quantInput = $event" @keyup.enter="setQuantity" style="width: 80px" dense label="Qty">
                    <template v-slot:append>
                      <q-btn size="sm" icon="mdi-check" color="primary" @click="setQuantity" round flat/>
                    </template>
                  </q-input>
                </q-popup-edit>
              </div>
              <div class="text-xxs text-mb-xxs text-weight-medium">Price:
                {{
                  $dollarString(lget(cartLine, 'product.price.pricePaid', 0), $getCurrencySymbol(cartLine.fullProduct), 2)
                }}
              </div>
              <div class="text-xxs text-mb-xxs text-weight-medium text-blue-12" v-if="quantity > 1">Total:
                {{ $dollarString(priceTotal, $getCurrencySymbol(cartLine.fullProduct), 2) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-dialog v-model="productDialog">
      <q-card style="width: 380px; max-width: 80vw">
        <corner-card :value="lget(cartLine, 'fullProduct', null)"></corner-card>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import CornerCard from '../../products/card/ProductCard';

  export default {
    name: 'CartLine',
    components: { CornerCard },
    props: {
      lineIn: Object,
      sizeIn: {
        type: Number,
        default: 100
      }
    },
    mounted() {
      if (!this.lget(this.lineIn, 'fullProduct', null)) this.$store.dispatch('products/get', this.lineIn.product);
      let el = document.getElementById('img_col');
      if (el) this.imgWidth = el.offsetWidth;
      window.addEventListener('resize', () => {
        this.imgWidth = el.offsetWidth;
      });
    },
    data() {
      return {
        quantInput: 0,
        imgWidth: 100,
        productDialog: false,
        cartLine: null
      };
    },
    watch: {
      lineIn: {
        immediate: true,
        deep: true,
        handler(newVal){
          this.cartLine = newVal;
        }
      }
    // product: {
    //   immediate: true,
    //   async handler(newVal, oldVal) {
    //     let newId = this.lget(newVal, '_id', false);
    //     let oldId = this.lget(oldVal, '_id', 1);
    //     if (newId && newId !== oldId) {
    //       await this.$store.dispatch('product-price/create', newVal, {
    //         query: {
    //           quantity: this.lget(this.lineIn, 'product.quantity', 1)
    //         }
    //       })
    //         .then(pricing => {
    //           console.log('got pricing', pricing);
    //           this.pricing = this.$arrayFilterZero(this.lget(pricing, 'list', []));
    //         }).catch(err => {
    //           console.log('error getting pricing', err);
    //         });
    //     }
    //   }
    // }
    },
    computed: {
      ...mapGetters('crayv-products', { getProduct: 'get' }),
      pricing(){
        return this.lget(this.cartLine, 'price', {total: 0});
      },
      defaultImg(){
        let type = this.lget(this.cartLine, 'product.types', 'ticket');
        if(type.some(a => typeof a === 'string' &&  a.name.toLowerCase().indexOf('ticket') > -1)) return 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/follow/ticket.png';
        else return this.defaultImage;
      },
      product() {
        return this.lget(this.cartLine, 'fullProduct', this.getProduct(this.cartLine.product));
      },
      priceTotal(){
        return this.lget(this.pricing, 'total', 0);
      },
      quantity(){
        return this.lget(this.cartLine, 'product.quantity', 0);
      },
      size() {
        return Math.min(this.sizeIn, this.imgWidth);
      },
    },
    methods: {
      removeLine(){
        // TODO: handle cart history
        this.$q.dialog({
          title: 'Remove Item From Cart?',
          cancel: true
        }).onOk(() => {
          this.$emit('remove');
          this.$store.dispatch('cart-lines/remove', [this.cartLine._id, {
            disableSoftDelete: true
          }]);
        });
      },
      async setQuantity(){
        let id = this.lget(this.cartLine, '_id');
        console.log('patch', id);
        await this.$store.dispatch('cart-lines/patch', [this.cartLine._id, {'product.quantity': this.quantInput}, {}])
          .then(() => {
            this.cartLine.product.quantity = this.quantInput;
            this.$successNotify('Quantity Updated');
          }).catch(err => {
            console.log('quantity update err', err);
            this.$errNotify('Error updating quantity - please check your connection');
          });
      }
    }
  };
</script>

<style scoped lang="scss">

</style>
