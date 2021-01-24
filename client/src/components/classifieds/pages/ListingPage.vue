<template>
  <div class="fill_size">
    <div class="row" style="height: 100%">
      <div class="col-12 col-md-8" style="height: 100%">
        <div class="flex flex-center bg-background" style="height: 100%">
          <div style="width: 800px; max-width: 100%;">
        <multi-image-viewer avatar-path="images" :value="listing"></multi-image-viewer>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="q-pa-md q-pt-xl">

          <div class="row items-center text-xs text-mb-xs text-weight-bold text-grey-6">
            <div>{{lget(listing, 'type') === 'obo' ? 'Best Offer' : 'First Come'}}</div>
            <q-space></q-space>
            <div>
              {{lget(listing, 'location.city', 'somewhere')}}, {{lget(listing, 'location.region')}}
            </div>
          </div>

          <div class="row">
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
            <div style="width: 20%" class="flex no-wrap justify-end items-center">
              <q-icon :name="lget(currency, 'icon')"></q-icon>
              <div class="text-xs text-mb-xs text-weight-medium">{{dollarString(lget(listing, 'price.basePrice', 0), '', 2)}}</div>
            </div>
          </div>
            <div style="width: 80%" class="q-pr-sm text-sm text-mb-sm text-weight-bold">{{lget(listing, 'name')}}</div>

          <div class="text-xs text-mb-xs" style="height: 36px">
              {{lget(listing, 'description', 'No Description')}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import MultiImageViewer from 'components/common/atoms/images/MultiImageViewer';
  import {mapGetters, mapState} from 'vuex';
  export default {
    components: { MultiImageViewer },
    props: {
      value: Object
    },
    watch: {
      listingId: {
        immediate: true,
        handler(newVal){
          if(newVal && !this.listing){
            this.$store.dispatch('crayv-classifieds/get', newVal);
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', {user: 'user'}),
      ...mapGetters('crayv-classifieds', {getListing: 'get'}),
      ...mapState('currency', {currencies: 'national_currencies'}),
      tagList(){
        return Array.from(new Set(this.lget(this.value, 'tags', [])));
      },
      currency(){
        return this.$arrayFilterZero(this.currencies.filter(a => a.value === this.lget(this.value, 'price.currency', 'usd')));
      },
      listingId(){
        return this.$route.params.listingId;
      },
      listing(){
        return this.value ? this.value : this.listingId ? this.getListing(this.listingId) : null;
      }
    }
  };
</script>
