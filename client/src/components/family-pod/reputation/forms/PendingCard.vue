<template>
  <q-card flat>
    <q-item>
      <q-item-section avatar>
        <default-avatar :value="issuing"></default-avatar>
      </q-item-section>
      <q-item-section>
        <div class="row items-center q-my-xs">
          <default-avatar dark :size-in="avatarSize" :value="issuer">
            <template v-slot:menu>
              <q-menu>
                <user-contact hide-contact show-info :value="issuer" :message="`${lget(issuing, 'name', '')} Issuer`" size-in="150px"></user-contact>
              </q-menu>
            </template>
          </default-avatar>
          <q-icon size="30px" class="q-mx-md" :name="`mdi-arrow-${isRequest ? 'left' : 'right'}-bold`"></q-icon>
          <default-avatar dark :size-in="avatarSize" :value="subject">
            <template v-slot:menu>
              <q-menu>
                <user-contact hide-contact show-info :value="subject" :message="`Issued ${lget(issuing, 'name', '')}`" size-in="150px"></user-contact>
              </q-menu>
            </template>
          </default-avatar>
        </div>
        <q-item-label>
          <div class="row items-center text-xxs text-mb-xs text-weight-light">
            <div>{{ lget(issuer, 'name') }}</div>
            <div class="q-mx-sm">{{isRequest ? 'request for' : 'issued'}}</div>
            <div class="text-weight-bold">{{ lget(issuing, 'name', 'Untitled') }}</div>
            <div class="q-mx-sm">{{isRequest ? 'from' : 'to'}}</div>
            <div>{{ lget(subject, 'name') }}</div>
          </div>
        </q-item-label>
        <q-item-label caption>{{ getDateFormat(lget(value, 'createdAt'), 'ddd, MMM-DD YYYY') }}</q-item-label>
        <div class="row justify-end">
          <div v-if="lget(value, 'status') === 'pending' && (isRequest ? isIssuer : isSubject)">
            <q-btn flat icon="mdi-check" label="Accept" :size="$q.screen.lt.sm ? 'xs' : 'sm'"
                   color="positive" push @click="accept(false)"></q-btn>
            <q-btn flat icon="mdi-close" label="Reject" :size="$q.screen.lt.sm ? 'xs' : 'sm'"  @click="accept(true)" color="negative"></q-btn>
          </div>
          <q-btn v-else flat :size="$q.screen.lt.sm ? 'xs' : 'sm'" color="accent">
            {{ lget(value, 'status', 'pending') }}
          </q-btn>
        </div>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script>
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import {mapGetters} from 'vuex';
  import UserContact from 'components/common/atoms/users/UserContact';

  export default {
    components: { UserContact, DefaultAvatar },
    props: {
      value: Object,
      avatarSizeIn: String
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      isSubject(){
        return this.lget(this.value, 'subject') === this.lget(this.user, '_id', '4');
      },
      isRequest(){
        return this.lget(this.value, 'subjectSignature') && !this.lget(this.value, 'issuerSignature');
      },
      isIssuer(){
        return this.lget(this.value, 'issuer') === this.lget(this.user, '_id', '4');
      },
      avatarSize() {
        if (this.avatarSizeIn) return this.avatarSizeIn;
        else return '30px';
      },
      issuing() {
        return this.lget(this.value, '_fastjoin.issuing');
      },
      issuer() {
        return this.lget(this.value, '_fastjoin.issuer');
      },
      subject() {
        return this.lget(this.value, '_fastjoin.subject');
      }
    },
    methods: {
      async accept(reject) {
        this.$isLoading(true);
        let val = Object.assign({}, this.value);
        !this.isRequest && this.isSubject ? val.subjectSignature = new Date() : this.isIssuer ? val.issuerSignature = new Date() : '';
        if(reject) val.rejectedBy = this.isSubject ? this.lget(this.value, 'subject', this.user._id) : this.lget(this.value, 'issuer', this.user._id);
        await this.$store.dispatch('fc-reputation-issue/patch', [this.value._id, val])
          .then(() => {
            this.$isLoading(false);
            this.$successNotify(`${reject ? 'Rejected' : 'Accepted!'}`);
          })
          .catch(err => {
            this.$isLoading(false);
            this.$errNotify('Error accepting ' + err.message);
            console.log('error issuing', err);
          });
      }
    }
  };
</script>

<style scoped>

</style>
