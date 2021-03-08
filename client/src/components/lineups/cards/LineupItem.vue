<template>
  <div>
    <q-item clickable @click="$emit('input', value)">
      <q-item-section avatar>
        <default-avatar :value="{ avatar: images }"></default-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>
          <div class="text-xs text-mb-xs text-weight-medium">{{ lget(value, 'name') }}</div>
        </q-item-label>
        <q-item-label class="text-xxs text-mb-xxs text-weight-light">
          <v-clamp :autoresize="true" :max-lines="2">
            {{ lget(value, 'description', 'Product lineup') }}
          </v-clamp>
        </q-item-label>
        <q-item-label>
          <div class="row items-center q-py-xs">
            <q-chip dark color="primary">
              <q-avatar color="white" class="text-dark text-weight-bold">
                <span>{{ Math.max(total, stateItems.length) }}</span>
              </q-avatar>
              <span>Products</span>
            </q-chip>
            <q-chip color="accent" class="q-ml-sm">
              <q-avatar color="white" class="text-dark text-weight-bold">
                <span>{{ lget(value, 'vendorSettings', []).length }}</span>
              </q-avatar>
              <span>Active Settings</span>
            </q-chip>
          </div>
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <slot name="side">
          <q-btn
            v-if="editing"
            dense
            flat
            icon="mdi-pencil-box"
            @click="editDialog = true"
          ></q-btn>

          <q-btn v-if="active" size="sm" flat dense icon="mdi-checkbox-marked-outline" color="positive"></q-btn>

        </slot>
      </q-item-section>

      <q-dialog position="left" :maximized="$q.screen.lt.sm" transition-hide="slide-left"
                transition-show="slide-right"
                v-model="editDialog">
        <q-card style="width: 600px; max-width: 100vw; height: 100vh">
          <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="editDialog = false"/>
          <lineup-form :value="value"></lineup-form>
        </q-card>
      </q-dialog>
    </q-item>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import LineupForm from 'components/lineups/forms/LineupForm';
  import {loadPaginatedMixin} from 'src/mixins/LoadPaginatedMixin';
  import VClamp from 'vue-clamp';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';

  export default {
    name: 'LineupItem',
    mixins: [loadPaginatedMixin],
    components: { DefaultAvatar, LineupForm, VClamp },
    props: {
      flat: Boolean,
      value: Object,
      editing: Boolean,
      active: Boolean
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
