<template>
  <q-card class="q-pa-sm" @click.stop="$emit('add', value)">

<!--    EDIT MENU-->
    <div class="t-r-a flex items-center" style="z-index: 10">
      <q-btn round flat icon="mdi-dots-vertical" size="sm" v-if="canEdit">
        <q-menu>
          <div>
            <q-btn dense size="sm" flat icon="mdi-close" @click.stop="$emit('rmv')">
              <q-tooltip>remove</q-tooltip>
            </q-btn>
            <q-btn dense size="sm" flat icon="mdi-pencil-box" @click.stop="editDialog = true">
              <q-tooltip>edit</q-tooltip>
            </q-btn>
          </div>
        </q-menu>
      </q-btn>
    </div>

<!--    REQUEST OR ISSUE BUTTON-->
    <div class="t-l-a">
      <q-btn v-if="canIssue" flat color="positive" size="xs" label="Issue Score"
             @click="issueDialog = true"></q-btn>
      <q-btn v-else flat color="nice" size="xs" label="Request Score"
             @click="requestDialog = true"></q-btn>
    </div>

    <div class="row justify-center">
      <default-avatar :value="item"></default-avatar>
    </div>
    <div class="q-my-sm">
      <div class="text-xs text-mb-sm text-weight-bold">
        {{ lget(item, 'name', 'Untitled') }}
      </div>
      <div class="text-xxs text-mb-xs text-weight-light">
        {{ lget(item, 'description') }}
      </div>
    </div>

    <q-separator class="q-my-sm"></q-separator>

    <div class="row items-center">
      <q-btn class="q-mr-xs" dense rounded size="xs" color="dark"
             :icon="$privacyObj[lget(item, 'privacy', 'private')]['icon']"
             :label="$privacyObj[lget(item, 'privacy', 'private')]['label']">
        <q-tooltip content-class="bg-dark text-light text-xxs text-mb-xs">
          {{ $privacyObj[lget(item, 'privacy', 'private')]['description'] }}
        </q-tooltip>
      </q-btn>
      <div class="text-xxs text-mb-xxs text-weight-bold">
        {{ $dollarString(lget(item, 'issueCount', 0), '', 0) }}
        <span class="text-weight-light">issued</span>
      </div>
      <q-space></q-space>
      <template v-if="!hideVotes && itemType === 'issue'">
        <vote-widget size="26px" :subject="issue" service="fc-scores"></vote-widget>
      </template>
    </div>

<!--    SUPPORTERS AND DETRACTORS-->

    <div class="row items-center" v-if="itemType === 'issue'">
      <q-separator class="q-my-sm"></q-separator>
      <div class="text-xxxs text-mb-xxs text-weight-bold text-uppercase"
           style="display: grid; grid-template-columns: 100%; grid-template-rows: auto auto">
        Issued By:
        <default-avatar :value="issuer">
          <template v-slot:menu>
            <q-menu>
              <template v-if="lget(item, 'issuerModel') === 'organization'">
                <pod-card :value="lget(item, '_fastjoin.issuer')" hide-members></pod-card>
              </template>
              <template v-else>
                <user-contact hide-contact show-info :value="lget(item, '_fastjoin.issuer')" message="Issuer"
                              size-in="150px"></user-contact>
              </template>
            </q-menu>
          </template>
        </default-avatar>
      </div>
      <q-space></q-space>
      <count-widget :value="value" service-in="fc-scores"></count-widget>
    </div>

    <q-dialog v-model="requestDialog">
      <q-card class="q-pa-md" style="width: 500px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat icon="mdi-close" @click="requestDialog = false"/>

        <div class="row justify-center">
          <user-contact hide-contact :value="lget(item, '_fastjoin.issuer')" message="" size-in="150px"></user-contact>
        </div>
        <q-separator class="q-my-md"></q-separator>
        <div class="text-sm text-mb-sm text-weight-medium">Ask {{ issuer.name }} to issue this Score to you</div>
        <div class="text-xs text-mb-xs text-weight-light">{{ lget(issuer, 'name', 'They') }} will get a request to
          respond to.
        </div>

        <div class="q-pa-md row justify-end">
          <q-btn push color="nice" icon="mdi-check" label="request" @click="request"></q-btn>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editDialog">
      <q-card style="width: 700px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat icon="mdi-close" @click="editDialog = false"/>
        <add-card :value="value"></add-card>
      </q-card>
    </q-dialog>

    <q-dialog v-model="issueDialog">
      <q-card style="width: 600px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat icon="mdi-close" @click="issueDialog = false"/>
        <issue-form :issuing-in="value"></issue-form>
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script>
  import CountWidget from 'components/family-pod/reputation/cards/CountWidget';
  import IssueForm from 'components/family-pod/reputation/forms/IssueForm';
  import UserContact from 'components/common/atoms/users/UserContact';
  import PodCard from 'components/pods/cards/PodCard';
  import VoteWidget from 'components/posts/cards/VoteWidget';
  import AddCard from 'components/family-pod/reputation/forms/AddCard';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import {mapGetters} from 'vuex';

  export default {
    name: 'ScoreCard',
    components: { CountWidget, IssueForm, UserContact, PodCard, VoteWidget, AddCard, DefaultAvatar },
    props: {
      hideVotes: Boolean,
      editing: Boolean,
      flat: Boolean,
      value: Object,
      openExpanded: Boolean
    },
    mounted() {
      if (this.openExpanded) this.expanded = true;
    },
    data() {
      return {
        requestDialog: false,
        editDialog: false,
        issueDialog: false,
        expanded: false,
      };
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      type() {
        return this.lget(this.value, 'type', 'peer');
      },
      service() {
        return 'fc-scores';
      },
      itemType() {
        let list = Object.keys(this.value);
        return list && list.includes('issuers') ? 'root' : 'issue';
      },
      issue() {
        if (this.itemType === 'issue') return this.value;
        else return null;
      },
      issuer() {
        return this.lget(this.item, '_fastjoin.issuer');
      },
      item() {
        return this.itemType === 'root' ? this.value : this.lget(this.value, '_fastjoin.issuing');
      },
      canEdit() {
        let issuer = this.lget(this.issuer, '_id', '1');
        return JSON.stringify(issuer) === JSON.stringify(this.lget(this.user, '_id', '2'));
      },
      canIssue() {
        let issuers = this.lget(this.item, 'issuers', []);
        return issuers.includes(this.lget(this.user, '_id'));
      }
    },
    methods: {
      async request() {
        this.$isLoading(true);
        let repIssue = {
          issuing: this.item._id,
          issuer: this.item.issuer,
          issuerModel: this.item.issuerModel,
          subject: this.user._id,
          subjectModel: 'users',
          subjectSignature: new Date()
        };
        // console.log('rep issue', repIssue, this.item, this.service);
        let valid = true;
        Object.keys(repIssue).forEach(key => {
          if (!repIssue[key] || typeof repIssue[key] === 'undefined') {
            valid = false;
            this.$isLoading(false);
            this.$errNotify('Missing Data For Request');
          }
        });
        if (valid) {
          await this.$store.dispatch('fc-reputation-issue/create', repIssue)
            .then(() => {
              this.$isLoading(false);
              this.$successNotify(this.type + ' sent to ' + this.lget(this.issuer, 'name', 'issuer'));
            }).catch(err => {
              this.$isLoading(false);
              this.$infoNotify(err.message);
            });
        }
      }
    }
  };
</script>
