<template>
  <q-card :id="`card-${value._id}`" :flat="flat" class="bg-light __p_group_grid" :style="{borderRadius: '10px', overflow: 'hidden', height: width * 1.1 + 'px' }" @click.stop="$emit('add', value)">

    <div class="t-l flex items-center">
      <q-btn
        dense
        push
        size="sm"
        color="positive"
        icon="mdi-checkbox-marked-outline"
        v-if="active"
      ></q-btn>
    </div>

    <div class="flex items-center bg-shade-4 t-r text-white">
      <q-btn
        dense
        flat
        size="sm"
        v-if="canEdit"
        icon="mdi-pencil-box-outline"
        @click="editDialog = !editDialog"
      ></q-btn>
    <q-btn flat dense size="sm" icon="mdi-arrow-expand" @click="fullDialog = true"></q-btn>
    </div>

    <div style="width: 100%; height: 100%">
      <multi-image-viewer
        flat
        style-in="border-radius: inherit inherit 0 0"
        :value="images"
      ></multi-image-viewer>
    </div>
    <div class="__bottom_sec q-pa-sm">
      <div class="text-sm text-mb-sm text-weight-medium __one-liner">
        {{ value.name }}
      </div>
      <div class="text-xs text-mb-xs text-weight-light">
        <v-clamp autoresize :max-lines="2">{{ value.description }}</v-clamp>
      </div>
      <div class="absolute-bottom q-pa-sm row items-center">
        <div style="display: flex; flex-direction: column; justify-content: flex-end">
          <q-icon :name="$getCurrencyIcon(lget(value, 'price.currency'))"/>
          <div class="text-xs text-mb-sm text-green text-weight-bold" v-html="priceDisplay"></div>
        </div>
        <q-space></q-space>
        <div class="text-xxs text-mb-xxs text-weight-bold">
          {{ productList ? productList.length : 0 }}{{
            productList && productList.length !== 1 ? ' items' : ' item'
          }}
        </div>
      </div>
    </div>

    <q-dialog position="left" :maximized="$q.screen.lt.sm" transition-hide="slide-left" transition-show="slide-right" v-model="editDialog">
      <q-card style="width: 600px; max-width: 100vw; height: 100vh">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="editDialog = false"/>
        <product-group-form :value="value"></product-group-form>
      </q-card>
    </q-dialog>

    <q-dialog :maximized="$q.screen.lt.md" transition-show="slide-up" transition-hide="slide-down" v-model="fullDialog">
      <q-card style="width: 2500px; max-width: 100vw; height: 100vh">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="fullDialog = false"/>
        <product-group-viewer :value="value"></product-group-viewer>
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script>
  // import { models } from 'feathers-vuex';
  import VClamp from 'vue-clamp';
  import {mapGetters} from 'vuex';
  import ProductGroupForm from 'components/product-groups/forms/ProductGroupForm';
  import MultiImageViewer from 'components/common/atoms/images/MultiImageViewer';
  import ProductGroupViewer from 'components/product-groups/cards/ProductGroupViewer';

  export default {
    name: 'ProductGroupCard',
    components: { ProductGroupViewer, MultiImageViewer, ProductGroupForm, VClamp },
    props: {
      flat: Boolean,
      active: Boolean,
      value: Object
    },
    mounted(){
      this.setWidth();
      window.addEventListener('resize', () => {
        this.setWidth();
      });
    },
    data() {
      return {
        width: 300,
        imgTab: 0,
        editDialog: false,
        fullDialog: false
      };
    },
    watch: {

    },
    computed: {
      ...mapGetters('auth', {user: 'user'}),
      ...mapGetters('crayv-products', {
        findProducts: 'find'
      }),
      ...mapGetters('crayv-product-groups', {
        findLineups: 'find'
      }),
      ...mapGetters('crayv-vendors', {
        getVendor: 'get'
      }),

      sellType(){
        return this.lget(this.value, 'type', 'a-la-carte');
      },
      product(){
        if(this.sellType === 'a-la-carte'){
          return this.lget(this.productList, [this.imgTab]);
        } else return this.value;
      },
      totalPrice(){
        return this.lget(this.product, 'priceObj.total', this.lget(this.product, 'price.basePrice', 0));
      },
      basePrice(){
        return this.lget(this.product, 'price.basePrice', 0);
      },
      priceDisplay() {
        let base = this.basePrice;
        let total = this.totalPrice;
        let exp = this.lget(this.product, 'priceObj.exp', null);
        if (base > total) {
          return `<div><div><span class="text-grey-6" style="text-decoration: line-through">${this.$dollarString(base, '', 2)}</span> <span>${this.$dollarString(total, '', 2)}</span></div><div class="text-xxs text-mb-xxs absolute-bottom text-weight-light text-primary q-pa-sm">${exp ? 'Expires: ' + this.getDateFormat(exp, 'ddd MMM-DD YYYY') : ''}</div></div>`;
        } else return `<span>${this.$dollarString(total, '', 2)}</span>`;
      },
      productList() {
        return this.lget(this.value, '_fastjoin.products', []);
      },
      images() {
        let productImages = this.$flattenArray(this.lget(this.value, '_fastjoin.products', []).map(a => a.images));
        let pgImages = this.lget(this.value, 'images', []);
        let list = [...pgImages, ...productImages];
        return { avatar: list };
      },
      // ...mapGetters('people', {getPerson: 'get'}),
      canEdit() {
        let vendor = this.lget(this.value, '_fastjoin.vendor');
        let userId = this.lget(this.user, '_id');
        return vendor.owner === userId || this.$isSuperAdmin(vendor) || this.$isAdmin(vendor);
        // return this.$store.state.auth.user._id === this.lineupVendor.owner || this.getPerson(this.$store.state.auth.user.hasPerson).inGroups.includes(this.lineupVendor.owner)
      },
    },
    methods: {
      setWidth(){
        setTimeout(() => {
          let el = document.getElementById(`card-${this.value._id}`);
          let width = el.getBoundingClientRect().width;
          this.width = width;
        }, 30);
      }
    }
  };
</script>

<style scoped lang="scss">
  .__p_group_grid {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 60% 40%;
  }

  .__bottom_sec {

  }

  .__right-arrow {
    position: absolute;
    top: 50%;
    right: 2%;
    transform: translateY(-100%);
    transition: transform .2s ease-out;

    &:hover {
      transform: translateY(-80%) scale(1.3)
    }
  }

  .__left-arrow {
    position: absolute;
    top: 50%;
    left: 2%;
    transform: translateY(-100%);
    transition: transform .2s ease-out;

    &:hover {
      transform: translateY(-80%) scale(1.3)
    }
  }

  .__img_wrapper {
    -webkit-animation-name: fade-in;
    -webkit-animation-duration: .5s;
  }
</style>
