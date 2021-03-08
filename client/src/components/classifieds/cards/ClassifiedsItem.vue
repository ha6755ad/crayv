<template>
  <q-item clickable class="__classifieds_item" @click="$emit('input', value)">

    <q-item-section avatar>
      <div style="height: 100px; width: 100px">
      <multi-image-viewer :value="value" avatar-path="images" default-img="https://ha6755ad-images.s3-us-west-1.amazonaws.com/crayv_standard.svg"></multi-image-viewer>
      </div>
    </q-item-section>
    <q-item-section class="fill_size q-pa-xs">
      <q-item-label>
        <div style="width: 90%" class="__one-liner q-pr-sm text-xs text-mb-xs text-weight-bold">{{lget(value, 'name')}}</div>
      </q-item-label>
      <q-item-label caption class="text-xxs text-mb-xxs __one-liner">
          {{lget(value, 'description', 'No Description')}}
      </q-item-label>
      <q-item-label>
        <div class="flex items-center">
          <q-icon :name="lget(currency, 'icon')"></q-icon>
          <div class="text-xs text-mb-xs text-weight-medium">{{dollarString(lget(value, 'price.basePrice'), '', 2)}}</div>
        </div>
      </q-item-label>
      <div class="row no-wrap" style="width: 100%; overflow-x: scroll">
        <q-chip
          size="sm"
          v-for="(tag, i) in tagList"
          :key="tag + i"
          dark
          square
          color="nice"
          icon="mdi-tag"
          :label="$limitStr(tag, 21)">
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
      <div class="row justify-end">
        <q-btn v-if="canEdit" dense flat icon="mdi-pencil-box" @click="editDialog = true"></q-btn>
      </div>
    </q-item-section>

    <q-dialog position="right" :maximized="$q.screen.lt.sm" transition-hide="slide-right" transition-show="slide-left"
              v-model="editDialog">
      <q-card style="width: 600px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="editDialog = false"/>
        <classifieds-form @input="editDialog = false" :value="value"></classifieds-form>
      </q-card>
    </q-dialog>

    <q-dialog maximized transition-hide="slide-down" transition-show="slide-up" v-model="fullScreen">
      <q-card square style="height: 100vh; width: 100vw" class="bg-background">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="fullScreen = false"/>
        <listing-page :value="value"></listing-page>
      </q-card>
    </q-dialog>

  </q-item>
</template>

<script>
  import {mapGetters, mapState} from 'vuex';
  import MultiImageViewer from 'components/common/atoms/images/MultiImageViewer';
  import ClassifiedsForm from 'components/classifieds/forms/ClassifiedsForm';
  import ListingPage from 'components/classifieds/pages/ListingPage';
  export default {
    name: 'ClassifiedsItem',
    components: { ListingPage, ClassifiedsForm, MultiImageViewer },
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
      ...mapGetters({marketplace: 'marketplaceContext'}),
      tagList(){
        return Array.from(new Set(this.lget(this.value, 'tags', [])));
      },
      currency(){
        return this.$arrayFilterZero(this.currencies.filter(a => a.value === this.lget(this.value, 'price.currency', 'usd')));
      },
      canEdit(){
        return this.lget(this.value, 'createdBy', 1) === this.lget(this.user, '_id') || this.$isSuperAdmin(this.marketplace) || this.$isAdmin(this.marketplace);
      }
    }
  };
</script>

<style scoped lang="scss">
  .__classifieds_item {

  }
</style>
