<template>
  <q-card flat style="height: 100%; width: 100%">
    <q-card-section>
      <div class="row text-sm text-mb-sm text-weight-light">Subscriptions
        <q-space/>
        <q-btn round color="secondary" icon="mdi-plus" @click="addDialog = true"/>
      </div>
    </q-card-section>
    <q-separator/>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div v-for="(sub, i) in stateSubscriptions" :key="`sub-${i}`" class="col-12 col-lg-6">
          <q-card style="width: 100%; height: 380px">
            <subscription-card :subscription-in="sub"></subscription-card>
          </q-card>
        </div>
      </div>
    </q-card-section>
    <q-dialog :maximized="$q.screen.lt.md" v-model="addDialog" :position="$q.screen.lt.md ? 'top' : 'right'" transition-show="slide-left" transition-hide="slide-right">
      <q-card :style="{minHeight: '100vw', width: $q.screen.lt.md ? '100vw' : '500px'}">
        <q-btn icon="mdi-close" round flat class="bg-light text-dark t-r" @click="addDialog = false"/>
        <subscription-form v-bind="$attrs" :subscription-in="editing"/>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
  import SubscriptionForm from '../../components/subscriptions/forms/SubscriptionForm';
  import {mapGetters} from 'vuex';
  import SubscriptionCard from '../../components/subscriptions/cards/SubscriptionCard';
  export default {
    name: 'Subscriptions',
    components: { SubscriptionCard, SubscriptionForm },
    data(){
      return {
        addDialog: false,
        editing: null
      };
    },
    computed: {
      ...mapGetters('subscriptions', { findSubscriptions: 'find' }),
      stateSubscriptions(){
        return this.findSubscriptions().data;
      }
    }
  };
</script>
