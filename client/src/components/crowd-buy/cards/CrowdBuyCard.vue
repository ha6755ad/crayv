<template>
  <div class="__c_b_card">
    <div class="__c_b_top">
      <multi-image-viewer :value="{images: images}" avatar-path="images"></multi-image-viewer>
    </div>
    <div class="q-py-xs">
      <div class="text-xs text-mb-xs text-weight-medium __one-liner">{{lget(value, 'name')}}</div>
      <div class="text-xxs text-mb-xxs text-weight-light" style="height: 38px">
        <v-clamp :max-lines="2" :autoresize="true">
          {{lget(value, 'description')}}
        </v-clamp>
      </div>
      <div class="row items-center">

        <q-space></q-space>
      <discount-display :value="value"></discount-display>
      </div>
    </div>
  </div>
</template>

<script>
  import MultiImageViewer from 'components/common/atoms/images/MultiImageViewer';
  import {mapGetters} from 'vuex';
  import VClamp from 'vue-clamp';
  import DiscountDisplay from 'components/crowd-buy/cards/DiscountDisplay';

  export default {
    name: 'CrowdBuyCard',
    props: {
      value: Object
    },
    components: { DiscountDisplay, MultiImageViewer, VClamp },
    watch: {
      sellingModel: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            setTimeout(() => {
              if (!this.lget(this.productList[0])) {
                this.$store.dispatch('crayv-products/find', this.productQuery);
              }
            }, 50);
          }
        }
      }
    },
    computed: {
      ...mapGetters('crayv-products', { findProducts: 'find' }),
      productQuery() {
        let selling = this.selling;

        let query = {};
        if (this.sellingModel === 'crayv-product-groups') {
          let flatProducts = this.$flattenArray(selling.map(a => a.products));
          let list = flatProducts ? flatProducts.map(a => a.id) : [];
          query._id = { $in: list };
        } else {
          //lineup
          let sellingList = this.$flattenArray(selling.map(a => a.products));
          query.$or = [
            { _id: { $in: sellingList ? sellingList : [] } },
            { productGroups: { $in: this.lget(selling, 'productGroups', []) } }
          ];
        }
        return query;
      },
      productList() {
        let selling = this.selling;
        if (this.sellingModel === 'crayv-products') return selling;
        else {
          return this.findProducts({ query: this.productQuery }).data;
        }
      },
      sellingModel() {
        return this.lget(this.value, 'sellingModel');
      },
      selling() {
        return this.lget(this.value, '_fastjoin.selling');
      },
      images() {
        if (this.lget(this.value, 'images[0]')) return this.value.images;
        else {
          let productImages = this.productList ? this.$flattenArray(this.productList.map(a => a.images)) : [];
          if (this.sellingModel === 'crayv-products') return productImages;
          else {
            let images = this.sellingModel === 'crayv-product-groups' ? this.selling ? this.$flattenArray(this.selling.map(a => a.images)) : this.selling.map(a => a.img) : [];
            if (this.lget(images, [0])) return [...images, ...productImages];
            else return productImages;
          }
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .__c_b_card {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-rows: 1fr 150px;
    grid-template-columns: 100%;

    .__c_b_top {
      height: 100%;
      width: 100%;
      border-radius: 8px;
      box-shadow: 0 0 4px rgba(0, 0, 0, .4);
    }
  }
</style>
