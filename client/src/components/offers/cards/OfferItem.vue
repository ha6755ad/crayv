<template>
  <div style="width: 100%">
  <div style="width: 100%; position: relative" class="row justify-end">
    <div style="z-index: 11; display: flex; align-items: flex-start">
      <div class="text-xxs text-mb-xs text-weight-light q-pr-xl">
        {{ $ago(lget(value, 'createdAt'), 'ddd MMM-DD, YYYY h:mm a') }}
      </div>
      <div class="t-r-a">
      <offer-actions :value="value" :subject="subject"></offer-actions>
      </div>
    </div>
  </div>
  <q-item clickable @click="$emit('input', value)" style="width: 100%;">
    <q-item-section avatar>
      <default-avatar :value="lget(value, '_fastjoin.user')"></default-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-xs text-mb-xs text-weight-medium">
        <div class="flex no-wrap items-center">
          <q-icon :name="$getCurrencyIcon(lget(value, 'price.currency'))"></q-icon>
          <div class="text-xs text-mb-xs text-weight-medium">
            {{ dollarString(lget(value, 'price.basePrice', 0), '', 2) }}
          </div>
        </div>
      </q-item-label>
      <q-item-label caption>
        <div class="__one-liner">{{value.content}}</div>
      </q-item-label>
    </q-item-section>

  </q-item>
  </div>
</template>

<script>
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import {mapGetters, mapState} from 'vuex';
  import OfferActions from 'components/offers/cards/OfferActions';


  export default {
    name: 'OfferItem',
    components: { OfferActions, DefaultAvatar },
    props: {
      borderColor: String,
      subject: Object,
      value: Object,
      flat: Boolean
    },
    data() {
      return {
        editDialog: false
      };
    },
    computed: {
      ...mapState('currency', { currencies: 'national_currencies' }),
      ...mapGetters('auth', { stateUser: 'user' }),
      currency() {
        return this.$arrayFilterZero(this.currencies.filter(a => a.value === this.lget(this.value, 'price.currency', 'usd')));
      },
    },
    methods: {

    }
  };
</script>

<style scoped>

</style>
