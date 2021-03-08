<template>
  <q-card flat style="border-radius: 10px; perspective: 1000px; height: 275px">

    <div class="t-r">
      <q-btn flat dense icon="mdi-eye" @click.stop="$emit('input')" color="white"></q-btn>
    </div>

    <div class="t-l">
      <default-avatar bordered bg-in="light" :value="value" size-in="45px">
        <template v-slot:menu>
          <q-menu>
            <q-card>
            <user-contact size-in="150px" :value="lget(value, '_fastjoin.user')" show-info hide-contact></user-contact>
            </q-card>
          </q-menu>
        </template>
      </default-avatar>
    </div>

    <q-img style="border-radius: inherit; height: 275px" class="q-pa-sm" :src="getAvatar(value, 'profileBanner', 'medium', null, 'https://cdn.quasar.dev/img/material.png')">
      <div class="__profile_card_grid">
        <div></div>
        <div>
          <div class="text-sm text-mb-md text-weight-medium __one-liner">{{ lget(value, 'title') }}
            <q-tooltip>{{ lget(value, 'title') }}</q-tooltip>
          </div>
          <div class="text-xs text-mb-xs text-weight-light __one-liner">
            {{lget(value, 'description')}}
          </div>

          <q-separator dark class="q-my-xs"></q-separator>

          <div class="row" style="width: 100%; overflow-x: scroll">
            <div class="q-ma-sm" v-for="(score, i) in stateItems" :key="`my-score-${i}`">
              <default-avatar bordered bg-in="dark" :value="lget(score, '_fastjoin.issuing')">
                <template v-slot:menu>
                  <q-menu>
                    <div style="width: 300px">
                      <score-card :value="score"></score-card>
                    </div>
                  </q-menu>
                </template>
              </default-avatar>
            </div>
          </div>
        </div>
      </div>
    </q-img>
  </q-card>
</template>

<script>
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import {loadPaginatedMixin} from 'src/Mixins/LoadPaginatedMixin';
  import UserContact from 'components/common/atoms/users/UserContact';
  import ScoreCard from 'components/family-pod/reputation/cards/ScoreCard';

  export default {
    name: 'ProfileCard',
    mixins: [loadPaginatedMixin],
    components: { ScoreCard, UserContact, DefaultAvatar },
    props: {
      value: Object
    },
    data() {
      return {
        loadService: 'fc-score-issue'
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal){
          if(newVal && this.lget(newVal, 'scores', []).length){
            setTimeout(() => {
              if(!this.stateItems || !this.stateItems.length){
                this.reloadItems(0);
              }
            });
          }
        }
      }
    },
    computed: {
      queryAdders() {
        return {
          _id: { $in: this.lget(this.value, 'scores', []) }
        };
      }
    }
  };
</script>

<style scoped lang="scss">
  .__profile_card_grid {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 120px 155px;
  }
</style>
