<template>
  <q-card class="bg-dark text-white" :style="{ height: height, width: width }">

    <div class="t-l">
      <template v-if="fullScorecard && !hideScores">
      <div class="__scorebadge text-white">
        {{ $dollarString(lget(fullScorecard, 'network', lget(fullScorecard, 'referred', []).length, 0), '', 0) }}
        <q-tooltip content-class="bg-dark text-light text-xxs text-mb-xs">Network Score</q-tooltip>
      </div>
      <div class="__scorebadge text-secondary">{{ $dollarString(lget(fullScorecard, 'referred', []).length, '', 0) }}
        <q-tooltip content-class="bg-dark text-light text-xxs text-mb-xs">Direct Referrals</q-tooltip>
      </div>
      </template>
      <q-btn size="sm" dense flat white icon="mdi-eye" @click="$router.push({name: 'personal-profile', params: { subjectId: value._id }, query: $route.query})"></q-btn>
    </div>


    <div class="t-r" style="z-index: 10">
      <div style="position: relative">
      <q-btn style="z-index: 10" class="__online-icon __mid-position" dense flat size="sm" color="green" v-if="isOnline" icon="mdi-circle"></q-btn>
      <default-avatar v-if="pledgePod" :value="pledgePod" size-in="30px">
        <template v-slot:menu>
          <q-menu>
            <q-card dark class="q-pa-sm">
              <div class="text-xs text-mb-sm">
                <div class="text-weight-medium">Pledged in {{ pledgePod.name }}</div>
                <q-separator dark class="q-my-xs"></q-separator>
                <div class="text-weight-light">
                  {{ getDateFormat(lget(value, 'legacy_pledge_date'), 'MM/DD/YYYY') }}
                </div>
              </div>
            </q-card>
          </q-menu>
        </template>
      </default-avatar>
      </div>
    </div>

    <q-img :src="avatar" v-if="avatar" style="height: 100%; width: 100%"></q-img>
    <div v-else class="fill_size flex flex-center">
      <default-avatar :value="value" :size-in="avatarSize"></default-avatar>
    </div>
    <div class="__contact_row row justify-around" v-if="!hideContact">
      <a :href="`sms: ${lget(value, 'phone.number.e164')}`" style="text-decoration: none">
        <q-btn dense color="yellow" flat size="xs" :label="noLabel ? '' : 'text'" icon="mdi-cellphone-message">
          <q-tooltip>send text</q-tooltip>
        </q-btn>
      </a>
<!--      <a :href="`tel: ${lget(value, 'phone.number.e164')}`" style="text-decoration: none">-->
<!--        <q-btn dense color="info" flat size="xs" :label="noLabel ? '' : 'call'" icon="mdi-phone"/>-->
<!--      </a>-->
      <q-btn dense flat size="xs" :label="noLabel ? '' : 'chat'" icon="mdi-chat"
             @click="$store.dispatch('ir-chat-context/dmRequest', value)">
        <q-tooltip>direct message</q-tooltip>
      </q-btn>
      <a :href="`mailto:${lget(value, 'email')}`" style="text-decoration: none">
        <q-btn dense color="orange" flat size="xs" :label="noLabel ? '' : 'email'" icon="mdi-email">
          <q-tooltip>email</q-tooltip>
        </q-btn>
      </a>
      <q-btn v-show="showLineage" dense color="purple" flat size="xs" :label="noLabel ? '' : 'Lineage'"
             icon="mdi-file-tree"
             @click="$emit('tree')"/>
    </div>
    <div style="background: rgba(0,0,0,.5)"
         class="absolute-bottom q-pa-xs text-xxs text-mb-xs text-weight-bold text-white" v-if="showInfo">
      <div class="__one-liner">{{ lget(value, 'name', lget(value, 'username')) }}</div>
      <div class="text-xxxs text-mb-xxxs __one-liner">Member: <span
        class="text-xxxs text-mb-xxxs text-weight-medium">{{ getDateFormat(lget(value, 'createdAt', new Date()), 'MMM DD, YYYY') }}</span>
      </div>
    </div>
    <slot name="menu"></slot>
  </q-card>
</template>

<script>
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import {mapGetters} from 'vuex';

  export default {
    name: 'UserContact',
    components: {DefaultAvatar},
    props: {
      hideScores: Boolean,
      hideContact: Boolean,
      showInfo: Boolean,
      noLabel: Boolean,
      dark: Boolean,
      sizeIn: String,
      widthIn: String,
      heightIn: String,
      value: Object,
      bgIn: String,
      bordered: Boolean,
      chatOff: Boolean,
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
        handler(newVal) {
          if (newVal && !this.pledgePod) {
            this.$store.dispatch('bw-pods/get', newVal);
          }
        }
      }
    },
    computed: {
      ...mapGetters('lc-scorecard', {getScorecard: 'get'}),
      ...mapGetters('bw-pods', {getPod: 'get'}),
      pledgeId() {
        return this.lget(this.value, 'legacy_pledge');
      },
      pledgePod() {
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
      width() {
        return this.sizeIn ? this.sizeIn : this.widthIn ? this.widthIn : '100%';
      },
      height() {
        return this.sizeIn ? this.sizeIn : this.heightIn ? this.heightIn : '100%';
      },
      avatarSize() {
        if (!this.sizeIn || this.sizeIn.indexOf('%') > -1) return '60px';
        else return parseInt(this.sizeIn) / 2 + 'px';
      },
      avatar() {
        return this.getAvatar(this.value, 'avatar', 'small');
      },
      isOnline() {
        return this.lget(this.value, 'isOnline', false);
      }
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
    padding: 2px;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .4);
    display: grid;
    align-items: center;
    justify-items: center;
    font-weight: 600;
    background: rgba(0, 0, 0, .6);
  }

  .__online-icon{
    animation: blink 2s infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: .5; }
    50% { opacity: 1; }

  }

</style>

