<template>
  <div class="fill_size">
    <div class="q-pa-md">
    <div class="text-xs text-mb-sm text-weight-medium row items-center">
      <div>People who you trust to verify your account</div>
      <q-space/>
      <q-btn label="add new" icon="mdi-plus" flat @click="addDialog = true"/>
    </div>
      <q-separator class="q-my-sm"/>
    <div class="text-xxs text-mb-xs text-weight-light">Do NOT give this right to anyone you don't trust having access to your account.</div>
    </div>
    <div class="q-pa-xl text-xs text-mb-sm text-italic text-weight-light" v-if="!verifyContacts || !verifyContacts.length">
      No one here yet
    </div>
  <div class="q-my-md row no-wrap" style="width: 100%; overflow-x: scroll">
    <q-card style="min-width: 220px; height: 180px" class="q-ma-xs" v-for="(contact, i) in verifyContacts" :key="`contact-${i}`">
      <q-btn dense flat icon="mdi-close" color="red" @click="removeNode(contact)" class="t-r" size="sm"/>
      <detail-card chat-off :value="contact"/>
    </q-card>
  </div>

    <q-dialog transition-show="slide-up" transition-hide="slide-down" :maximized="$q.screen.lt.sm" v-model="addDialog">
      <q-card class="q-pa-md" style="width: 100vw; max-width: 650px;">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="addDialog = false"/>
        <div class="q-pa-md">
          <div class="text-xs text-mb-sm text-weight-medium">Remember, don't give anyone this ability who you don't trust with your account</div>
        </div>
        <search-query
          :limit="10"
          service="users"
          optionLabel="name"
          optionAvatar="avatar"
          optionSubtitle="email"
          optionValue="_id"
          label="Search Users"
          :multiple="true"
          v-model="peopleToAdd"
        ></search-query>

        <div class="q-pa-md row justify-end">
          <q-btn label="save verifiers" color="positive" size="sm" push @click="addNew(peopleToAdd)"/>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import DetailCard from 'components/common/atoms/users/DetailCard';
  import SearchQuery from 'components/common/atoms/search/SearchQuery';

  export default {
    name: 'TrustedNodes',
    components: { SearchQuery, DetailCard },
    data(){
      return {
        addDialog: false,
        peopleToAdd: [],
        fullUser: null
      };
    },
    watch: {
      user: {
        immediate: true,
        handler(newVal){
          if(newVal && newVal._id){
            this.$store.dispatch('users/get', [this.user._id, { $populateParams: { name: 'withVerifiers'}}])
              .then(res => this.fullUser = res.clone());
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      verifyContacts(){
        return this.lget(this.fullUser, 'verifiersList', []);
      }
    },
    methods: {
      addNew(people){
        console.log('adding new', people, this.peopleToAdd);
        this.$q.dialog({
          title: `Adding ${people.length} Verifiers`,
          message: 'Make sure you want to give these people ability to recover your account for you'
        }).onOk(() => {
          let verifiers = this.lget(this.fullUser, 'verifiers', []);
          people.forEach(person => {
            verifiers ? !verifiers.includes(person._id) ? verifiers.push(person._id) : '' :  verifiers = [person._id];
          });
          console.log('patching', verifiers);
          this.$store.dispatch('users/patch', [this.user._id, { verifiers: verifiers }, { $populateParams: { name: 'withVerifiers' } }])
            .then(res => {
              console.log('patched', res);
              this.fullUser = res.clone();
              this.$successNotify('Added Verifiers');
            });
        });
      },
      removeNode(node){
        this.$q.dialog({
          title: `Remove ${this.lget(node, 'name', this.lget(node, 'username'))} from your verifiers?`,
          ok: {
            push: true,
            size: 'sm',
            color: 'positive',
            label: 'remove'
          },
          cancel: {
            flat: true,
            size: 'sm',
            color: 'negative',
            label: 'cancel'
          }
        }).onOk(() => {
          let verifiers = this.lget(this.user, 'verifiers', []).map(a => JSON.stringify(a));
          let idx = verifiers.indexOf(JSON.stringify(node._id));
          if (idx > -1) {
            verifiers.splice(idx, 1);
            this.$store.dispatch('users/patch', [this.user._id, { verifiers: verifiers }, { $populateParams: { name: 'withVerifiers' } }])
              .then(res => {
                this.fullUser = res.clone();
                this.$successNotify('Removed verifier');
              });
          }
        });
      }
    }
  };
</script>
