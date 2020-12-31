<template>
  <q-card flat class="q-pa-md">
    <div class="text-sm text-mb-md">Award {{activeType.label}} to {{lget(subjectIn, 'name')}}</div>
    <q-btn-group rounded flat>
      <q-btn :size="$q.screen.lt.md ? 'sm' : ''" v-for="(type, i) in types" :key="`type-${i}`" :label="type.label" flat :color="tab === i ? 'nice' : 'grey-5'" @click="tab = i">
        <div class="__underline bg-nice" :style="tab === i ? {background: 'var(--q-color-nice)'} : {width: 0}"></div>
      </q-btn>
    </q-btn-group>
    <pick-item
      :query-in="activeType.query"
      :service-in="activeType.value"
      v-model="selected"
    ></pick-item>
    <q-slide-transition>
    <template v-if="selected">
      <issue-form
        :subject-in="subjectIn"
        no-select
        :issuing-in="selected">
      </issue-form>
    </template>
    </q-slide-transition>
  </q-card>
</template>

<script>
  import PickItem from 'components/family-pod/reputation/forms/PickItem';
  import {mapGetters} from 'vuex';
  import IssueForm from 'components/family-pod/reputation/forms/IssueForm';
  export default {
    name: 'ShareReputation',
    components: { IssueForm, PickItem },
    props: {
      subjectIn: Object
    },
    data(){
      return {
        tab: 0,
        selected: null
      };
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      activeType(){
        return this.types[this.tab];
      },
      types(){
        return [
          {
            label: 'Scores',
            value: 'fc-scores',
            query: () => {
              return {
                _id: { $in: this.lget(this.user, 'canIssueScores')},
                type: 'peer'
              };
            }
          },
          {
            label: 'Credentials',
            value: 'fc-scores',
            query: () => {
              return {
                _id: { $in: this.lget(this.user, 'canIssueScores')},
                type: 'credential'
              };
            }
          },
          {
            label: 'Experiences',
            value: 'fc-scores',
            query: () => {
              return {
                _id: { $in: this.lget(this.user, 'canIssueScores')},
                type: 'experience'
              };
            }
          }
        ];
      }
    }
  };
</script>
