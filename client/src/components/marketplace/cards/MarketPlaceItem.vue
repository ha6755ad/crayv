<template>
  <q-card flat :dark="dark">
  <q-item flat style="border-radius: inherit; overflow: hidden" clickable @click.stop="$emit('input', value)">

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

    <q-item-section avatar>
      <multi-image-viewer
        flat
        style-in="border-radius: inherit inherit 0 0"
        :value="value"
        avatar-path="images"
      ></multi-image-viewer>
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-xs text-mb-xs text-weight-medium __one-liner">
        {{ value.name }}
      </q-item-label>
      <q-item-label class="text-xxs text-mb-xxs text-weight-light">
        <v-clamp autoresize :max-lines="2">{{ value.description }}</v-clamp>
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <slot name="side">
        <q-btn flat dense push color="positive" icon="mdi-checkbox-marked-outline" v-if="active"></q-btn>
      </slot>
    </q-item-section>

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

  </q-item>
  </q-card>
</template>

<script>
  // import { models } from 'feathers-vuex';
  import VClamp from 'vue-clamp';
  import {mapGetters} from 'vuex';
  import MultiImageViewer from 'components/common/atoms/images/MultiImageViewer';
  import ProductGroupViewer from 'components/product-groups/cards/ProductGroupViewer';
  import MarketplaceForm from 'components/marketplace/MarketPlaceForm';

  export default {
    name: 'MarketplaceItem',
    components: { MarketplaceForm, ProductGroupViewer, MultiImageViewer, VClamp },
    props: {
      dark: Boolean,
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
        return this.lget(this.value, 'createdBy', '*') === userId || this.$isSuperAdmin(this.value) || this.$isAdmin(this.value);
        // return this.$store.state.auth.user._id === this.lineupVendor.owner || this.getPerson(this.$store.state.auth.user.hasPerson).inGroups.includes(this.lineupVendor.owner)
      },
    },
    methods: {}
  };
</script>

<style scoped lang="scss">

</style>
