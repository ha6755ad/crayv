<template>
  <q-card :flat="flat" class="__lineup_card">

    <div class="t-r flex items-center">
      <q-btn
        v-if="editing"
        dense
        flat
        icon="mdi-pencil-box"
        @click="editDialog = true"
      ></q-btn>
    </div>


    <multi-image-viewer
      flat
      style-in="border-radius: inherit inherit 0 0"
      :value="images"
    >
      <template v-slot:content>
        <div class="absolute-bottom text-dark __text_section" style="background: rgba(255,255,255,.7); height: 50%; width: 100%; padding: 0">
          <div class="q-pa-md">
          <div class="text-sm text-mb-sm text-weight-medium">{{ lget(value, 'name') }}</div>
          <div class="text-xs text-mb-xs">
            <v-clamp :autoresize="true" :max-lines="2">
            {{ lget(value, 'description', 'Product lineup') }}
            </v-clamp>
          </div>
          </div>
          <div class="row items-center q-px-sm q-py-xs">
            <q-chip dark color="primary">
              <q-avatar color="white" class="text-dark text-weight-bold">
                <span>{{Math.max(total, stateItems.length)}}</span>
              </q-avatar>
              <span>Products</span>
            </q-chip>
            <q-chip color="accent" class="q-ml-sm">
              <q-avatar color="white" class="text-dark text-weight-bold">
                <span>{{lget(value, 'vendorSettings', []).length}}</span>
              </q-avatar>
              <span>Active Settings</span>
            </q-chip>
          </div>
        </div>
      </template>
    </multi-image-viewer>


    <q-dialog position="left" :maximized="$q.screen.lt.sm" transition-hide="slide-left" transition-show="slide-right"
              v-model="editDialog">
      <q-card style="width: 600px; max-width: 100vw; height: 100vh">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="editDialog = false"/>
        <lineup-form :value="value"></lineup-form>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
  import MultiImageViewer from 'components/common/atoms/images/MultiImageViewer';
  import {mapGetters} from 'vuex';
  import LineupForm from 'components/lineups/forms/LineupForm';
  import {loadPaginatedMixin} from 'src/mixins/LoadPaginatedMixin';
  import VClamp from 'vue-clamp';

  export default {
    name: 'LineupCard',
    mixins: [loadPaginatedMixin],
    components: { LineupForm, MultiImageViewer, VClamp },
    props: {
      flat: Boolean,
      value: Object,
      editing: Boolean
    },
    data() {
      return {
        editDialog: false,
        loadService: 'crayv-products'
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal) {
          let newId = this.lget(newVal, '_id', 1);
          if (newId && this.$lisEmpty(this.stateItems)) {
            this.reloadItems(0);
          }
        }
      }
    },
    computed: {
      ...mapGetters({ vendorContext: 'vendorContext' }),
      queryAdders() {
        return {
          $or: [
            { _id: { $in: this.lget(this.value, 'products', []) } },
            { productGroups: { $in: this.lget(this.value, 'productGroups', []) } }
          ]
        };
      },
      images() {
        let productImages = this.stateItems.map(a => a.images);
        let flatImages = this.$flattenArray(productImages);
        let img = this.lget(this.value, 'img');
        if (img) flatImages.unshift(img);
        return { avatar: flatImages };
      }
    }
  };
</script>

<style scoped lang="scss">
  .__lineup_card {
    height: 100%;
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    //display: grid;
    //grid-template-rows: 50% 50%;
    //grid-template-columns: 100%;
    position: relative;

    .__text_section {
      display: grid;
      grid-template-columns: 100%;
      grid-template-rows: 1fr auto;
    }
  }
</style>
