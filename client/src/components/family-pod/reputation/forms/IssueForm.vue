<template>
  <q-card flat class="q-pa-md">
    <div>
      <div class="row items-center">
        <div class="q-mr-sm text-sm text-mb-sm text-weight-medium">
          Issue {{ lget(issuingIn, 'name', 'Score') }}
        </div>
        <q-space></q-space>
        <default-avatar :value="issuingIn">
          <template v-slot:menu>
            <q-menu>
              <reputation-item :value="issuingIn"></reputation-item>
            </q-menu>
          </template>
        </default-avatar>
      </div>
      <div style="transform: translate(0, -30%)" class="text-xs text-mb-xs text-weight-light">
        to {{subjectToAdd ? subjectToAdd.name : 'someone who deserves it'}}
      </div>
    </div>

    <template v-if="!noSelect">

    <q-separator class="q-mb-sm"></q-separator>

    <search-query
      chip
      backup-label="username"
      :limit="10"
      service="users"
      optionLabel="name"
      optionAvatar="avatar"
      optionSubtitle="email"
      optionValue="_id"
      :label="`Choose whom to issue ${lget(issuingIn, 'name', 'Score')} to`"
      :multiple="false"
      v-model="subjectToAdd"
      behavior="menu"
      avatar
    ></search-query>

    </template>

    <div class="q-pa-md row justify-end">
      <div>
        <q-tooltip v-if="!lget(subjectToAdd, '_id')">
          Choose person or organization
        </q-tooltip>
      <q-btn :disable="!lget(subjectToAdd, '_id')" color="blue" push label="Issue Score" @click="save">
      </q-btn>
      </div>
    </div>
  </q-card>
</template>

<script>
  import {models} from 'feathers-vuex';
  import {mapGetters} from 'vuex';
  import SearchQuery from 'components/common/atoms/search/SearchQuery';
  import {vCheck} from 'src/Mixins/ir-validate';
  import ReputationItem from 'components/family-pod/reputation/cards/ReputationItem';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';

  export default {
    name: 'IssueForm',
    mixins: [vCheck],
    components: { DefaultAvatar, ReputationItem, SearchQuery },
    props: {
      noSelect: Boolean,
      subjectIn: Object,
      issuingIn: Object,
    },
    mounted(){
      this.form = new models.api.FcReputationIssue().clone();
      if(this.subjectIn) this.subjectToAdd = this.subjectIn;
    },
    data() {
      return {
        form: {},
        subjectToAdd: null,
      };
    },
    watch: {},
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      type() {
        return this.lget(this.value, 'type', 'peer');
      },
      validCheck() {
        return {
          subject: { name: 'Choose Who To Issue To', v: ['notEmpty'] },
          subjectModel: { name: 'Person or Organization', v: ['notEmpty'] },
          issuer: { name: 'Issuer', v: ['notEmpty'] },
          issuerModel: { name: 'Issuer Type', v: ['notEmpty'] },
          issuing: { name: 'Issuing', v: ['notEmpty'] },
          issuingModel: { name: 'Issuing Type', v: ['notEmpty'] }
        };
      },
    },
    methods: {
      save() {
        this.$q.dialog({
          title: `You are about to issue ${this.lget(this.issuingIn, 'name', 'Score')} to ${this.lget(this.subjectToAdd, 'name', this.lget(this.subjectToAdd, 'username'))}`,
          message: 'Remember - issuing Scores boosts your reputation if they are well deserved, but hurts your reputation if they are not.',
          ok: {
            color: 'positive',
            push: true,
            size: 'sm'
          },
          cancel: {
            color: 'negative',
            push: true,
            size: 'sm'
          }
        }).onOk(async () => {
          this.form.issuing = this.issuingIn._id;
          this.form.issuingModel = 'fc-scores';
          this.form.issuer = this.user._id;
          this.form.issuerModel = 'users';
          this.form.subject = this.lget(this.subjectToAdd, '_id');
          this.form.subjectModel = 'users';
          this.form.issuerSignature = new Date();

          // console.log('checking valid', this.form);
          const errors = this.$vCheck(this.form);
          if (errors && errors.length) {
            errors.forEach(err => {
              this.$vErrNotify(err);
            });
          } else {
            this.$isLoading('Issuing');
            await this.form.save()
              .then(() => {
                this.$isLoading(false);
                this.$successNotify('Score sent to ' + this.lget(this.subjectToAdd, 'name', this.lget(this.subjectToAdd, 'username')));
              })
              .catch(err => {
                this.$isLoading(false);
                this.$infoNotify(err.message);
              });
          }
        });
      }
    }
  };
</script>
