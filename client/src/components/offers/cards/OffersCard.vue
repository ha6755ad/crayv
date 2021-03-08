<template>
  <div class="__offer_card bg-light">
    <paginate-list
      title="Offers"
      :subtitle="subtitle"
      title-class="text-xs text-mb-xs text-weight-medium"
      subtitle-class="text-xxs text-mb-xxs text-weight-light"
      load-service="crayv-offers"
      :query-in="query"
      :value="selected"
      add-label="Make Offer"
      :adding="adding"
      form-position="standard"
      form-card-style="width: 500px; max-width: 100vw"
      :form-maximized="false"
      transition-show="slide-up"
      transition-hide="slide-down"
      empty-message="No Offers Yet"
    >
      <template v-slot:list-item="{item}">
        <template v-if="!priceMode">
        <offer-card border-color="rgba(0,0,0,.3)" :subject="subject" :value="item"></offer-card>
        </template>
        <template v-else>
          <offer-item @input="handleInput" :value="item" :subject="subject"></offer-item>
        </template>
      </template>
      <template v-slot:form="{close}">
        <offer-form
          :subject="subject"
          subject-model="crayv-classifieds"
          @input="close"
        ></offer-form>
      </template>
    </paginate-list>
  </div>
</template>

<script>
  import PaginateList from 'components/common/substance/lists/PaginateList';
  import OfferCard from 'components/offers/cards/OfferCard';
  import OfferForm from 'components/offers/forms/OfferForm';
  import OfferItem from 'components/offers/cards/OfferItem';
  import {SelectMixin} from 'src/mixins/SelectMixin';
  export default {
    name: 'OffersCard',
    mixins: [SelectMixin],
    components: { OfferItem, OfferForm, OfferCard, PaginateList },
    props: {
      multiple: Boolean,
      emitValue: Boolean,
      priceMode: Boolean,
      adding: Boolean,
      subject: Object,
      queryIn: Object
    },
    data(){
      return {
        selected: null
      };
    },
    computed: {
      query(){
        return this.queryIn;
      },
      subtitle(){
        let type = this.lget(this.subject, 'type');
        if(type === 'obo'){
          return 'Best offer listings can be bid on until marked as sold. The seller can accept a better offer at any time.';
        } else if(type === 'first'){
          return 'First offer listings can be bid on until marked as accepted. Backup offers can be made until the listing is marked as sold.';
        } else return '';
      }
    }
  };
</script>

<style scoped lang="scss">
  .__offer_card {
    position: relative;
    width: 100%;

  }
</style>
