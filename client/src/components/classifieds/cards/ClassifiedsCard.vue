<template>
  <div class="__classifieds_card" @click="fullScreen = true">

    <div class="t-r">
      <q-btn v-if="lget(value, 'createdBy', 1) === lget(user, '_id')" dense flat icon="mdi-pencil-box" @click="editDialog = true"></q-btn>
    </div>

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
      <div class="row items-center text-xxs text-mb-xxs text-weight-bold text-grey-6">
        <div>{{lget(value, 'type') === 'obo' ? 'Best Offer' : 'First Come'}}</div>
        <q-space></q-space>
        <div>
          {{lget(value, 'location.city', 'somewhere')}}, {{lget(value, 'location.region')}}
        </div>
      </div>
    </div>

    <q-dialog position="right" :maximized="$q.screen.lt.sm" transition-hide="slide-right" transition-show="slide-left"
              v-model="editDialog">
      <q-card style="width: 600px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="editDialog = false"/>
        <classifieds-form @input="editDialog = false" :value="value"></classifieds-form>
      </q-card>
    </q-dialog>

    <q-dialog maximized transition-hide="slide-down" transition-show="slide-up" v-model="fullScreen">
      <q-card square style="height: 100vh; width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="fullScreen = false"/>
        <listing-page :value="value"></listing-page>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
  import {mapGetters, mapState} from 'vuex';
  import VClamp from 'vue-clamp';
  import MultiImageViewer from 'components/common/atoms/images/MultiImageViewer';
  import ClassifiedsForm from 'components/classifieds/forms/ClassifiedsForm';
  import ListingPage from 'components/classifieds/pages/ListingPage';
  export default {
    name: 'ClassifiedsCard',
    components: { ListingPage, ClassifiedsForm, MultiImageViewer, VClamp },
    props: {
      value: Object
    },
    data(){
      return {
        editDialog: false,
        fullScreen: false
      };
    },
    computed: {
      ...mapGetters('auth', {user: 'user'}),
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
