<template>
  <q-card class="bg-light" style="height: 100%; width: 100%; overflow: hidden">
    <q-card-section>
      <div class="row justify-center">
        <template v-for="(image, i) in imageGen">
          <div :key="`wrapper-${i}`" v-if="imgTab === i" style="width: 75%; overflow: hidden" class="__img_wrapper">
            <img style="width: 100%; object-fit: cover" :key="`image-${i}`" :src="getAvatar(image, null, 'large', imgTab)">
            <template v-if="imageGen && imageGen.length > 1">
              <q-btn :key="`right-${i}`" size="xs" round flat
                     class="__right-arrow text-dark" @click="imgTab < imageGen.length - 1 ? imgTab++ : imgTab = 0">
                <q-icon name="mdi-menu-right-outline" size="25px"/>
              </q-btn>
              <q-btn :key="`left-${i}`" size="xs" round flat class="__left-arrow text-dark" @click="imgTab > 0 ? imgTab-- : imgTab = imageGen.length - 1">
                <q-icon name="mdi-menu-left-outline" size="25px"/>
              </q-btn>
            </template>
          </div>
        </template>
      </div>
    </q-card-section>
    <div class="__bottom_sec">
      <div class="text-1-5 text-weight-bold text-white __title">{{lineupIn.name}}</div>
      <div class="text-1-2 text-weight-light text-white">
        <v-clamp autoresize :max-lines="2">{{lineupIn.description}}</v-clamp>
      </div>
      <div class="__action_row row items-center">
        <q-space/>
        <div class="text-white text-0-9 text-weight-bold">{{productList.length}}{{productList.length &&
          productList.length === 1 ? ' item' : ' items'}}
        </div>
      </div>
    </div>
    <q-btn class="t-r" round size="sm" v-if="canEdit" icon="mdi-pencil-box-outline" color="secondary"
           @click="editDialog = !editDialog"/>
    <q-dialog maximized v-model="editDialog">
      <q-card style="height: 100%; width: 100%">
        <q-btn class="t-r" round flat icon="mdi-close" @click="editDialog = false"/>
        <product-group-form v-bind="$attrs" :lineup-in="lineupIn"/>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
  import VClamp from 'vue-clamp';
  import {mapGetters} from 'vuex';
  import ProductGroupForm from 'components/products/forms/ProductGroupForm';

  export default {
    name: 'ProductGroupCard',
    components: { ProductGroupForm, VClamp },
    props: {
      lineupIn: Object
    },
    data() {
      return {
        imgTab: 0,
        editDialog: false
      };
    },
    computed: {
      ...mapGetters('crayv-products', {
        findProducts: 'find'
      }),
      ...mapGetters('crayv-product-groups', {
        findLineups: 'find'
      }),
      ...mapGetters('crayv-vendors', {
        getVendor: 'get'
      }),
      // ...mapGetters('people', {getPerson: 'get'}),
      lineupVendor() {
        return this.getVendor(this.lineupIn.vendor.vendorId);
      },
      canEdit() {
        return true;
        // return this.$store.state.auth.user._id === this.lineupVendor.owner || this.getPerson(this.$store.state.auth.user.hasPerson).inGroups.includes(this.lineupVendor.owner)
      },
      lineupProducts() {
        return this.findProducts({
          query: {
            _id: {
              $in: this.lineupIn.products.map(a => a.productId)
            }
          }
        }).data;
      },
      imageGen() {
        return this.lineupIn?.images?.length ? this.lineupIn.images : [].concat.apply([], this.lineupProducts.map(a => a.images));
      },
      productList() {
        return [].concat.apply([], this.allChildrenLineups(this.lineupIn).map(a => a.products));
      }
    },
    methods: {
      allChildrenLineups(startLineup) {
        let list = [startLineup];
        let getChildren = (lineup) => {
          if (lineup.children) {
            let children = this.findLineups({
              query: { _id: { $in: lineup.children } }
            });
            if (children?.length) children.forEach(c => {
              list.push(c);
              if (c.children?.length) getChildren(c);
            });
          }
        };
        getChildren(startLineup);
        return list;
      }
    }
  };
</script>

<style scoped lang="scss">
  .__bottom_sec {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 30%;
    background: rgba(0, 0, 0, .6);
    padding: 2%;
    min-height: 100px;

    .__title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .__action_row {
      height: 20%;
      max-height: 45px;
      min-height: 30px;
      align-self: baseline;
    }

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
