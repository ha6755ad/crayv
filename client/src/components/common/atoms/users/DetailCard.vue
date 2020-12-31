<template>
  <q-card :flat="flat" class="q-pa-md fill_size">

    <div class="t-l" v-if="fullScorecard">
      <div class="__scorebadge text-white">{{$dollarString(lget(fullScorecard, 'network', lget(fullScorecard, 'referred', []).length, 0), '', 0)}}
        <q-tooltip content-class="bg-dark text-light text-xxs text-mb-xs">Network Score</q-tooltip>
      </div>
      <div class="__scorebadge text-secondary">{{$dollarString(lget(fullScorecard, 'referred', []).length, '', 0)}}
        <q-tooltip content-class="bg-dark text-light text-xxs text-mb-xs">Direct Referrals</q-tooltip>
      </div>
    </div>

    <div style="display: flex; align-items: center" class="t-r">
    <default-avatar  v-if="pledgePod" :value="pledgePod" size-in="30px">
      <template v-slot:menu>
        <q-menu>
          <q-card style="width: 200px" dark class="q-pa-sm text-center">
            <div class="text-xxs text-mb-xs">
              <div>Pledged in</div>
              <div style="width: 100%; overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;" class="text-weight-medium text-xs text-mb-sm">{{pledgePod.name}}</div>
              <q-separator dark class="q-my-xs"></q-separator>
              <div class="text-weight-light">
                {{getDateFormat(lget(value, 'legacy_pledge_date'), 'MM/DD/YYYY')}}
              </div>
            </div>
          </q-card>
        </q-menu>
      </template>
    </default-avatar>

    <q-btn dense flat class="bg-dark text-light" size="sm" @click="$emit('close')" v-if="closable"
           icon="mdi-close"/>
    </div>

    <div class="row justify-center q-my-sm" v-if="!noImg">
      <default-avatar size-in="60px" bg-in="background" dark :value="value"/>
    </div>
    <q-item-section>
      <div class="text-xs text-mb-sm text-weight-medium">{{ lget(value, 'name', lget(value, 'username', 'No Name')) }}
      </div>
      <q-separator color="secondary"/>

      <template v-if="!hideDetails">
      <div class="text-xxs text-mb-xxs text-weight-light"><span class="text-xxxs text-mb-xxxs text-weight-medium">Member Since:</span>
        {{ getDateFormat(lget(value, 'createdAt', new Date()), 'MMM DD, YYYY') }}
      </div>
      <div class="row justify-around">
        <a :href="`sms: ${lget(value, 'phone.number.e164')}`" style="text-decoration: none">
          <q-btn dense color="primary" flat size="sm" label="text" icon="mdi-cellphone-message">
            <q-tooltip>send text</q-tooltip>
          </q-btn>
        </a>
<!--        <a :href="`tel: ${lget(value, 'phone.number.e164')}`" style="text-decoration: none">-->
<!--          <q-btn dense color="info" flat size="sm" label="call" icon="mdi-phone"/>-->
<!--        </a>-->
        <q-btn dense flat size="sm" label="chat" icon="mdi-chat" @click="$store.dispatch('ir-chat-context/dmRequest', value)">
          <q-tooltip>direct message</q-tooltip>
        </q-btn>
        <a :href="`mailto:${lget(value, 'email')}`" style="text-decoration: none">
          <q-btn dense color="accent" flat size="sm" label="email" icon="mdi-email">
            <q-tooltip>email</q-tooltip>
          </q-btn>
        </a>
        <q-btn v-show="showLineage" dense color="purple" flat size="sm" label="Lineage" icon="mdi-file-tree"
               @click="$emit('tree')"/>
      </div>
      </template>
    </q-item-section>
  </q-card>
</template>

<script>
  import {mapGetters} from 'vuex';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';

  export default {
    name: 'DetailCard',
    components: { DefaultAvatar },
    props: {
      hideDetails: Boolean,
      noImg: Boolean,
      flat: Boolean,
      value: Object,
      chatOff: Boolean,
      closable: Boolean,
      showLineage: Boolean
    },
    watch: {
      scorecardId: {
        immediate: true,
        handler(newVal) {
          if (newVal && !this.fullScorecard) {
            this.$store.dispatch('lc-scorecard/get', this.scorecardId);
          }
        }
      },
      pledgeId: {
        immediate: true,
        handler(newVal){
          if(newVal && !this.pledgePod){
            this.$store.dispatch('bw-pods/get', newVal);
          }
        }
      }
    },
    computed: {
      ...mapGetters('lc-scorecard', { getScorecard: 'get' }),
      ...mapGetters('bw-pods', { getPod: 'get' }),
      pledgeId(){
        return this.lget(this.value, 'legacy_pledge');
      },
      pledgePod(){
        if (this.pledgeId) {
          return this.lget(this.value, 'pledgePod', this.getPod(this.pledgeId));
        } else return null;
      },
      scorecardId() {
        return this.lget(this.value, 'scorecard');
      },
      fullScorecard() {
        if (this.scorecardId) {
          return this.lget(this.value, 'fullScorecard', this.getScorecard(this.scorecardId));
        } else return null;
      },
    }
  };
</script>

<style scoped lang="scss">
  .__contact_row {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .__scorebadge {
    padding: 0 4px;
    border-radius: 3px;
    box-shadow: 0 1px 3px rgba(0,0,0,.4);
    display: grid;
    align-items: center;
    justify-items: center;
    font-weight: 600;
    background: rgba(0,0,0,.6);
  }
</style>
