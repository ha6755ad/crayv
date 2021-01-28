<template>
  <q-card
    :style="{
      width: '100%',
      borderRadius: '8px',
      boxShadow: borderColor ? `0 0 0 1px ${borderColor}` : flat ? 'none' : '0 0 10px rgba(0,0,0,.2)'
    }"
  >
    <div class="q-pa-md" style="width: 100%">
    <div class="row">
      <default-avatar :value="lget(value, '_fastjoin.user')"></default-avatar>
      <q-space></q-space>
      <div style="z-index: 11; display: flex; align-items: center">
        <div class="text-xxs text-mb-xs text-weight-light">
          {{ $ago(lget(value, 'createdAt'), 'ddd MMM-DD, YYYY h:mm a') }}
        </div>
        <offer-actions :value="value" :subject="subject"></offer-actions>
      </div>
    </div>

    <div class="row justify-end">
      <price-display :value="value.price"></price-display>
    </div>
    <div class="text-xxs text-mb-xxs">
      <div>{{ value.content }}</div>
    </div>
    <q-separator class="q-my-xs"></q-separator>
    </div>
    <template v-if="!withSubject">
      <comments
        adding
        :subject-in="value"
        parent-model="crayv-offers"
        service="ir-comments"
        :parent-in="value"
      ></comments>
    </template>
    <template v-else>
      <classifieds-item :value="fullSubject"></classifieds-item>
    </template>

  </q-card>
</template>

<script>
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import {mapGetters, mapState} from 'vuex';
  import Comments from 'components/comments/cards/Comments';
  import OfferActions from 'components/offers/cards/OfferActions';
  import ClassifiedsItem from 'components/classifieds/cards/ClassifiedsItem';
  import PriceDisplay from 'components/common/atoms/price/PriceDisplay';

  export default {
    name: 'OfferCard',
    components: { PriceDisplay, ClassifiedsItem, OfferActions, DefaultAvatar, Comments },
    props: {
      withSubject: Boolean,
      borderColor: String,
      subject: Object,
      value: Object,
      flat: Boolean
    },
    data() {
      return {};
    },
    watch: {
      subjectId: {
        immediate: true,
        handler(newVal){
          if(newVal && this.withSubject && !this.fullSubject){
            this.$store.dispatch(`${this.lget(this.value, 'subjectModel')}/get`, this.subjectId);
          }
        }
      }
    },
    computed: {
      ...mapState('currency', { currencies: 'national_currencies' }),
      ...mapGetters('auth', { stateUser: 'user' }),
      currency() {
        return this.$arrayFilterZero(this.currencies.filter(a => a.value === this.lget(this.value, 'price.currency', 'usd')));
      },
      subjectId(){
        return this.lget(this.value, 'subject');
      },
      fullSubject(){
        let subject = this.lget(this.value, 'fullSubject');
        return subject ? subject : this.withSubject ? this.$store.getters[`${this.lget(this.value, 'subjectModel')}/get`](this.subjectId) : null;
      }
    },
    methods: {}
  };
</script>

<style scoped>

</style>
