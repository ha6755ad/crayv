<template>
  <q-card :flat="flat" class="bg-light __p_group_grid" style="border-radius: 10px; overflow: hidden" @click.stop="$emit('input', value)">

    <div class="t-l flex items-center">
      <q-btn dense push size="sm" color="positive" icon="mdi-checkbox-marked-outline" v-if="active"></q-btn>
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
      <q-btn flat dense size="sm" icon="mdi-arrow-expand" @click="$router.push({name: 'marketplace', params: { marketplace: value.name }, query: {marketplaceId: value._id }})"></q-btn>
    </div>

    <div style="width: 100%; height: 100%">
      <multi-image-viewer
        flat
        style-in="border-radius: inherit inherit 0 0"
        :value="value"
        avatar-path="images"
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
          <default-avatar :value="value"></default-avatar>
        </div>
        <q-space></q-space>
        <div class="text-xxs text-mb-xxs text-weight-bold">
          {{ vendorList ? vendorList.length : 0 }}{{
            vendorList && vendorList.length !== 1 ? ' items' : ' item'
          }}
        </div>
      </div>
    </div>

    <q-dialog position="left" :maximized="$q.screen.lt.sm" transition-hide="slide-left" transition-show="slide-right" v-model="editDialog">
      <q-card style="width: 600px; max-width: 100vw; height: 100vh">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="editDialog = false"/>
        <marketplace-form :value="value"></marketplace-form>
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
  import MultiImageViewer from 'components/common/atoms/images/MultiImageViewer';
  import ProductGroupViewer from 'components/product-groups/cards/ProductGroupViewer';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import MarketplaceForm from 'components/marketplace/MarketPlaceForm';

  export default {
    name: 'MarketplaceCard',
    components: { MarketplaceForm, DefaultAvatar, ProductGroupViewer, MultiImageViewer, VClamp },
    props: {
      flat: Boolean,
      active: Boolean,
      value: Object
    },
    data() {
      return {
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
      vendorList() {
        return this.lget(this.value, 'vendorSettings', []);
      },
      images() {
        return this.lget(this.value, 'images', []);
      },
      // ...mapGetters('people', {getPerson: 'get'}),
      canEdit() {
        let userId = this.lget(this.user, '_id');
        return this.value.createdBy === userId || this.$isSuperAdmin(this.value) || this.$isAdmin(this.value);
        // return this.$store.state.auth.user._id === this.lineupVendor.owner || this.getPerson(this.$store.state.auth.user.hasPerson).inGroups.includes(this.lineupVendor.owner)
      },
    },
    methods: {}
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
