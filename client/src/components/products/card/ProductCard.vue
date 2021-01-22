<template>
  <div id="product-corner-details-card" :style="{boxShadow: flat ? 'none' : '0 0 10px rgba(0,0,0,.15)'}">
    <q-dialog v-model="imgOverlay" :style="{width: $q.screen.width <= 800 ? '100%' : '50%'}">
      <q-card>
        <q-img
          :src="getAvatar(value, 'images', 'large', 0, defaultImg)">
          <q-btn round
                 dark
                 icon="mdi-close"
                 color="light-blue"
                 style="position: absolute; top: 0.5rem; right: 1rem;"
                 @click="imgOverlay = false"/>
        </q-img>
      </q-card>
    </q-dialog>


    <q-img
      :src="getAvatar(value, 'images', 'medium', 0, defaultImg)"
      @click="imgOverlay = true"
      class="text-white"
      :style="{height: '100%'}">

      <!--       VENDOR LOGO HERE-->
      <div class="absolute-bottom row items-center"
           style="height: 20%; background: linear-gradient(to bottom, rgba(255,255,255,.0), rgba(255,255,255,.4), rgba(255,255,255,.6))">
        <q-avatar size="40px">
          <img v-if="lget(vendor, 'avatar')" :src="getAvatar(vendor, 'avatar', 'small')">
          <span v-else-if="lget(vendor, 'name')">{{ lget(vendor, 'name').charAt(0) }}</span>
        </q-avatar>
      </div>
    </q-img>

    <div class="container1 q-pa-sm">
      <!--        <div class="top"></div>-->

      <div class="q-px-sm">
      <div class="text-xs text-mb-sm text-weight-medium">
        <v-clamp autoresize :max-lines="2">
          {{ product.name }}
        </v-clamp>
      </div>
        <div class="text-xxs text-mb-xs text-weight-light">
          <v-clamp autoresize :max-lines="1">
            {{ product.description }}
          </v-clamp>
        </div>
      </div>
      <div class="buy"
           :style="{height: '100%', color: iconOn ? '#00E676' : '#212121'}">
        <q-tooltip>{{ !iconOn ? addText : rmvText }}</q-tooltip>
        <q-btn v-if="!disabled" :size="$q.screen.lt.sm ? 'sm' : 'lg'" round flat :color="iconOn ? '#00E676' : '#212121'" @click="addToCart(product, Quantity)">
          <q-icon :name="!iconOn ? addIcon : rmvIcon"/>
        </q-btn>
      </div>

      <div class="row items-center q-px-sm">
        <div style="display: flex; flex-direction: column; justify-content: flex-end">
          <q-icon :name="currencyIcon"/>
          <div class="text-xs text-mb-sm text-green text-weight-bold" v-html="priceDisplay"></div>
        </div>
        <!--              <div class="buy"-->
        <!--                   @click="altClick"-->
        <!--                   :style="{height: twoBtn ? '50%' : '100%', color: altOn ? color : '#212121'}">-->
        <!--                <p>{{!altOn ? altText : altRmvText}}</p>-->
        <!--                <q-icon size="30" :name="!altOn ? altIcon : altRmv" :color="altOn ? color : '#212121'"/>-->
        <!--              </div>-->
      </div>
      <div class="flex flex-center" style="width: 100%">
        <q-input v-model.number="Quantity"
                 name="quantity"
                 style="width: 100%"
                 type="number"
                 min=1
                 max=5000
                 step=1
                 hide-details
                 color="light-blue"
                 label="Quantity"
                 dense
                 v-if="showQty"></q-input>
      </div>

    </div>

  </div>
</template>

<script>
  import {mapState, mapGetters, mapActions} from 'vuex';
  import VClamp from 'vue-clamp';
  import { CartGen } from '../../../mixins/CartGen';

  export default {
    name: 'CornerCard',
    mixins: [CartGen],
    components: { VClamp }, //adminMenu
    // can be sm, md, or lg
    props: {
      flat: Boolean,
      disabled: Boolean,
      cardSize: {
        type: String,
        default: 'md'
      },
      // determine if there are two buttons
      twoBtn: {
        type: Boolean,
        default: false
      },
      addIcon: {
        type: String,
        default: 'mdi-cart-plus'
      },
      addText: {
        type: String,
        default: 'Add to Cart'
      },
      rmvIcon: {
        type: String,
        default: 'fas fa-minus-square'
      },
      rmvText: {
        type: String,
        default: 'Rmv From Cart'
      },
      removedMessage: {
        type: String,
        default: 'Removed from cart'
      },
      addedMessage: {
        type: String,
        default: 'Added to your cart'
      },
      altMessage: {
        type: String,
        default: 'Added to Wishlist'
      },
      altIcon: {
        type: String,
        default: 'far fa-heart'
      },
      altText: {
        type: String,
        default: 'Add to Wishlist'
      },
      altRmv: {
        type: String,
        default: 'far fa-heart'
      },
      altRmvText: {
        type: String,
        default: 'Rmv from Wishlist'
      },
      altRemovedMessage: {
        type: String,
        default: 'Removed from wishlist'
      },
      // Determine if item is in list and icon should indicate so
      iconOn: {
        type: Boolean,
        default: false
      },
      altOn: {
        type: Boolean,
        default: false
      },
      // quantity selection field
      showQty: {
        type: Boolean,
        default: true
      },
      // message to show when item added to cart
      color: {
        type: String,
        default: '#68A4EB'
      },
      secondary: {
        type: String,
        default: '#FF4577'
      },
      accent: {
        type: String,
        default: '#7c8ee0'
      },
      value: {
        type: Object,
        required: false,
      },
      querySearch: {
        type: String,
        required: false,
        default: ''
      },
      productIndex: {
        type: Number,
        required: false,
        default: 0
      }
    },
    data() {
      return {
        shared: false,
        imgOverlay: false,
        buyClicked: '',
        alt: false,
        Quantity: 1,
      };
    },
    watch: {
    // buyClicked: {
    //   immediate: true,
    //   handler(newValue){
    //     newValue === 'clicked' ? setTimeout(() => this.buyClicked = '', 2000) : ''
    //   }
    // }
    },
    computed: {
      ...mapState('auth', {
        user: 'user'
      }),
      ...mapState('lookups', {
        lookups: 'list'
      }),
      ...mapGetters('crayv-vendors', { getVendor: 'get' }),
      priceDisplay() {
        let base = this.lget(this.product, 'price.basePrice', 0);
        let total = this.lget(this.product, 'priceObj.total', this.lget(this.product, 'price.basePrice', 0));
        let exp = this.lget(this.product, 'priceObj.exp', null);
        if (base > total) {
          return `<div><div><span class="text-grey-6" style="text-decoration: line-through">${this.$dollarString(base, '', 2)}</span> <span>${this.$dollarString(total, '', 2)}</span></div><div class="text-xxs text-mb-xxs absolute-bottom text-weight-light text-primary q-pa-sm">${exp ? 'Expires: ' + this.getDateFormat(exp, 'ddd MMM-DD YYYY') : ''}</div></div>`;
        } else return `<span>${this.$dollarString(total, '', 2)}</span>`;
      },
      person() {
        return this.user;
      },
      product() {
        return this.value;
      },
      vendor() {
        return this.getVendor(this.lget(this.product, 'vendor.vendorId'));
      },
      subproducts_count() {
        return this.product.children ? this.product.children.length : 0;
      },
      favorite_count() {
        return this.lget(this.product, 'favoredBy.people', []).length;
      },
      bookmark_count() {
        return this.lget(this.product, 'bookmarkedBy.people', []).length;
      },
      event_count() {
        return this.product.hasEvents ? this.product.hasEvents.length : 0;
      },
      isFavorite() {
        return this.lget(this.product, 'favoredBy.people') ? (this.person.favorites.products.some(id => id === this.product._id) && this.product.favoredBy.people.some(id => id === this.person._id)) : false;
      },
      isBookmarked() {
        return this.lget(this.product, 'bookmarkedBy.people') ? (this.person.bookmarks.products.some(id => id === this.product._id) && this.product.bookmarkedBy.people.some(id => id === this.person._id)) : false;
      },
      defaultImg() {
        let type = this.lget(this.product, 'types', []);
        if (type.some(a => typeof a === 'string' && a.name.toLowerCase().indexOf('ticket') > -1)) return 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/follow/ticket.png';
        else return this.defaultImage;
      },
      currencyIcon(){
        return `mdi-currency-${this.lget(this.product, 'price.currency')}`;
      }
    },
    methods: {
      ...mapActions('users', { patchPerson: 'patch' }),
      setPrice() {
        return this.product.price.basePrice * this.Quantity;
      },
      buyClick() {
        this.buyClicked = 'clicked';
        this.alt = false;
        this.$emit('clicked', this.value, this.Quantity);
      },
      altClick() {
        this.buyClicked = 'clicked';
        this.alt = true;
        this.$emit('altClicked', this.value, this.Quantity);
      },
      editProduct(product) {
        // console.log(product);
        this.$emit('editProduct', product);
      },
      setFavorite() {
        if (this.isFavorite) {
          // eslint-disable-next-line no-console
          console.log('unset Favorite');
          let payload = {
            favorites: {
              products: this.lget(this.person, 'favorites.products', []).filter(item => item && item !== this.product._id)
            }
          };
          this.patchPerson([this.person._id, payload, {}]);

          this.setValue(this.product, 'favoredBy.people', this.lget(this.product, 'favoredBy.people', []).filter(item => item && item !== this.person._id));
          this.product.patch();
        } else {
          // eslint-disable-next-line no-console
          console.log('set Favorite');
          let payload = {
            favorites: {
              products: [...new Set([
                ...this.lget(this.person, 'favorites.products', []),
                ...[this.product._id]
              ].map(o => JSON.stringify(o)))].map(s => JSON.parse(s))
            }
          };
          this.patchPerson([this.person._id, payload, {}]);

          this.setValue(this.product, 'favoredBy.people', [...new Set([
            ...this.lget(this.product, 'favoredBy.people', []),
            ...[this.person._id]
          ].map(o => JSON.stringify(o)))].map(s => JSON.parse(s)));
          this.product.patch();
        }
      },
      setBookmark() {
        if (this.isBookmarked) {
          // eslint-disable-next-line no-console
          console.log('unset Bookmark');
          let payload = {
            bookmarks: {
              products: this.lget(this.person, 'bookmarks.products', []).filter(item => item && item !== this.product._id)
            }
          };
          this.patchPerson([this.person._id, payload, {}]);

          this.setValue(this.product, 'bookmarkedBy.people', this.lget(this.product, 'bookmarkedBy.people', []).filter(item => item && item !== this.person._id));
          this.product.patch();
        } else {
          // eslint-disable-next-line no-console
          console.log('set Bookmark');
          let payload = {
            bookmarks: {
              products: [...new Set([
                ...this.lget(this.person, 'bookmarks.products', []),
                ...[this.product._id]
              ].map(o => JSON.stringify(o)))].map(s => JSON.parse(s))
            }
          };
          this.patchPerson([this.person._id, payload, {}]);

          this.setValue(this.product, 'bookmarkedBy.people', [...new Set([
            ...this.lget(this.product, 'bookmarkedBy.people', []),
            ...[this.person._id]
          ].map(o => JSON.stringify(o)))].map(s => JSON.parse(s)));
          this.product.patch();
        }
      },
      shareLink() {
        this.shared = !this.shared;
        // eslint-disable-next-line no-console
        console.log('share');
      }
    }
  };
</script>

<style scoped lang="scss">
#product-corner-details-card {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 99fr minmax(120px, 30%);
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  // Vars

  // Support

  // Module
  & {
    //
  }

  // Facets

  // States
  .vendor-logo {
    background-image: linear-gradient(rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.9));
    box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.5);
    height: 65px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }


  //&:hover {
  //  transform: scale(1);
  //  box-shadow: 5px 20px 30px rgba(0, 0, 0, 0.2);
  //}

  .container1 {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 70fr 30fr;
    grid-template-rows: 50% 50%;


    .buy {
      height: 100%;
      width: 100%;
      display: grid;
      align-items: center;
      justify-items: center;

    }
  }
}

</style>
