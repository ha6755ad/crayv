<template>
  <div class="fill_size bg-background">
    <div class="row" style="height: 100%">
      <div class="col-12 col-md-8" :style="{ height: $q.screen.lt.md ? null : '100%' }">
        <div class="flex flex-center" style="height: 100%">
          <div style="width: 800px; max-width: 100%;">
            <multi-image-viewer
              avatar-path="images"
              :value="listing"
            ></multi-image-viewer>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 bg-white q-pb-xl">
        <div class="q-pa-md q-pt-xl">

          <div class="row justify-end">
            <div style="width: 20%" class="flex no-wrap justify-end items-center">
              <q-icon :name="lget(currency, 'icon')"></q-icon>
              <div class="text-xs text-mb-xs text-weight-medium">
                {{ dollarString(lget(listing, 'price.basePrice', 0), '', 2) }}
              </div>
            </div>
          </div>
          <div style="width: 80%" class="q-pr-sm text-sm text-mb-sm text-weight-bold">{{ lget(listing, 'name') }}</div>

          <div class="text-xs text-mb-xs" style="height: 36px">
            {{ lget(listing, 'description', 'No Description') }}
          </div>
          <div class="row q-my-sm" style="width: 100%; overflow-x: scroll">
            <q-chip
              v-for="(tag, i) in tagList"
              :key="tag + i"
              dark
              square
              color="nice"
              icon="mdi-tag"
              :label="$limitStr(tag, 21)">
              <q-tooltip v-if="tag && tag.length > 20">
                {{ tag }}
              </q-tooltip>
            </q-chip>
          </div>
          <q-separator class="q-my-sm"></q-separator>
          <div class="text-xs text-mb-xs text-weight-bold text-grey-6">
            {{ lget(listing, 'location.city', 'somewhere') }}, {{ lget(listing, 'location.region') }}
          </div>
          <div class="row justify-center q-my-md">
            <q-card
              :style="{
            width: '95%',
            height: $q.screen.lt.md ? $q.screen.width / 1.5 + 'px' : '350px',
            borderRadius: '10px'
          }"
            >
              <mapbox :max-zoom="14" :zoom="11" custom-marker :markers-in="[latLng]" :center="latLng"></mapbox>
            </q-card>
          </div>

          <q-separator class="q-my-md"></q-separator>

          <div class="row items-center text-xs text-mb-xs text-weight-bold text-grey-6">
            <div>{{ lget(listing, 'type') === 'obo' ? 'Best Offer' : 'First Come' }}</div>
            <q-space></q-space>
            <q-btn flat color="primary" :label="lget(listing, 'accepted') && !lget(listing, 'sold') ? lget(listing, 'type') === 'obo' ? 'Bidding War' : 'Backup Offers Only' : !lget(listing, 'sold') ? 'Open' : ''"></q-btn>
          </div>

          <q-slide-transition>
            <div v-if="listing.accepted" class="q-my-md">
              <div class="q-pa-sm text-sm text-mb-sm text-weight-medium">Accepted Offer</div>
              <offer-card :subject="listing" :value="acceptedOffer"></offer-card>
            </div>
          </q-slide-transition>
          <offers-card adding :subject="listing" :query-in="offerQuery"></offers-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import MultiImageViewer from 'components/common/atoms/images/MultiImageViewer';
  import {mapGetters, mapState} from 'vuex';
  import Mapbox from 'components/utils/mapbox/map/mapbox';
  import OffersCard from 'components/offers/cards/OffersCard';
  import OfferCard from 'components/offers/cards/OfferCard';

  export default {
    components: { OfferCard, OffersCard, Mapbox, MultiImageViewer },
    props: {
      value: Object
    },
    watch: {
      listingId: {
        immediate: true,
        handler(newVal) {
          if (newVal && !this.listing) {
            this.$store.dispatch('crayv-classifieds/get', newVal);
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters('crayv-classifieds', { getListing: 'get' }),
      ...mapState('currency', { currencies: 'national_currencies' }),
      ...mapGetters('crayv-offers', { getOffer: 'get' }),
      tagList() {
        return Array.from(new Set(this.lget(this.value, 'tags', [])));
      },
      latLng() {
        return [this.lget(this.listing, 'location.longitude', -111.876183), this.lget(this.listing, 'location.latitude', 40.758701)];
      },
      acceptedOffer(){
        let id = this.lget(this.listing, 'accepted');
        return id ? this.getOffer(id) : null;
      },
      offerQuery(){
        return {
          $sort: { 'price.basePrice': -1 },
          _id: { $in: this.lget(this.listing, 'offers', [])}
        };
      },
      currency() {
        return this.$arrayFilterZero(this.currencies.filter(a => a.value === this.lget(this.value, 'price.currency', 'usd')));
      },
      listingId() {
        return this.$route.params.listingId;
      },
      listing() {
        return this.value ? this.value : this.listingId ? this.getListing(this.listingId) : null;
      }
    }
  };
</script>
