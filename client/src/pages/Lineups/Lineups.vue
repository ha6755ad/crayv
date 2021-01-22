<template>
  <q-card flat square style="height: 100%; width: 100%">
    <q-card-section>
      <div style="width: 100%" class="row items-center no-wrap text-sm text-mb-sm text-weight-light">Product Lineups
      <q-space/>
      <q-btn :class="`text-${$getTextColor('--q-color-primary')}`" round icon="mdi-plus" color="accent" @click="addDialog = true"/>
      </div>
    </q-card-section>
    <q-separator/>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <template v-for="(lineup, i) in stateLineups">
          <div :key="`col-${i}`" class="col-12 col-sm-6 col-md-4 col-lg-3">
            <q-card style="height: 400px; width: 100%">
            <product-group-card v-bind="$attrs" :lineup-in="lineup"/>
            </q-card>
          </div>
        </template>
      </div>
    </q-card-section>
    <q-dialog maximized v-model="addDialog" transition-show="slide-down" transition-hide="slide-right">
      <q-card style="height: 100vh; width: 100vw">
        <q-btn icon="mdi-close" round flat class="bg-light text-dark t-r" @click="addDialog = false"/>
        <product-group-form v-bind="$attrs" :lineup-in="editing"></product-group-form>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ProductGroupForm from 'components/product-groups/forms/ProductGroupForm';
  import ProductGroupCard from '../../components/product-groups/cards/ProductGroupCard';

  export default {
    name: 'Lineups',
    components: { ProductGroupCard, ProductGroupForm },
    data(){
      return {
        addDialog: false,
        editing: null
      };
    },
    computed: {
      ...mapGetters('crayv-product-groups', {findLineups: 'find'}),
      stateLineups(){
        return this.findLineups().data;
      }
    }
  };
</script>
