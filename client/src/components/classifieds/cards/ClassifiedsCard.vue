<template>
  <div class="__classifieds_card">
    <q-card style="border-radius: 8px; height: 100%; width: 100%">
      <multi-image-viewer :value="value" avatar-path="images" default-img="https://ha6755ad-images.s3-us-west-1.amazonaws.com/crayv_standard.svg"></multi-image-viewer>
    </q-card>
    <div class="fill_size q-pa-xs">
      <div class="row items-center">
        <div style="width: 80%" class="__one-liner q-pr-sm text-xxs text-mb-xxs text-weight-bold">{{lget(value, 'name')}}</div>
        <div style="width: 20%" class="flex no-wrap justify-end items-center">
        <q-icon :name="lget(currency, 'icon')"></q-icon>
        <div class="text-xs text-mb-xs text-weight-medium">{{dollarString(lget(value, 'price.basePrice'), '', 2)}}</div>
        </div>
      </div>
      <div class="text-xxs text-mb-xxs" style="height: 36px">
        <v-clamp :autoresize="true" :max-lines="2">
        {{lget(value, 'description', 'No Description')}}
        </v-clamp>
      </div>
      <div class="row no-wrap" style="overflow-x: scroll">
        <q-chip
          v-for="(tag, i) in tagList"
          :key="tag + i"
          dark
          square
          color="nice"
          icon="mdi-tag"
          :label="tag && tag.length < 21 ? tag : tag.substring(0, 18) + '...'">
          <q-tooltip v-if="tag && tag.length > 20">
            {{tag}}
          </q-tooltip>
        </q-chip>
      </div>
      <div class="row justify-end">
        <div class="text-xxs text-mb-xxs text-weight-bold text-grey-6">
          {{lget(value, 'location.city', 'somewhere')}}, {{lget(value, 'location.region')}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import VClamp from 'vue-clamp';
  import MultiImageViewer from 'components/common/atoms/images/MultiImageViewer';
  export default {
    name: 'ClassifiedsCard',
    components: { MultiImageViewer, VClamp },
    props: {
      value: Object
    },
    computed: {
      ...mapState('currency', {currencies: 'national_currencies'}),
      tagList(){
        return Array.from(new Set(this.lget(this.value, 'tags', [])));
      },
      currency(){
        return this.$arrayFilterZero(this.currencies.filter(a => a.value === this.lget(this.value, 'price.currency', 'usd')));
      }
    }
  };
</script>

<style scoped lang="scss">
 .__classifieds_card {
   height: 100%;
   width: 100%;
   display: grid;
   grid-template-columns: 100%;
   grid-template-rows: 70% 125px;
   position: relative;
 }
</style>
