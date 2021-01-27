<template>
  <q-card flat class="bg-transparent" style="width: 100%">
    <div class="row justify-end" v-if="adding">
      <q-btn color="primary" size="sm" dense flat icon="mdi-chat" @click="commenting = !commenting"></q-btn>
    </div>
    <q-slide-transition>
      <template v-if="adding && commenting">
        <comment-form
          :parent-in="parentIn"
          :parent-model="parentModel"
          :service="service"
        ></comment-form>
      </template>
    </q-slide-transition>
    <paginate-list
      :qid-in="lget(parentIn, '_id', lget(subjectIn, '_id'))"
      :load-service="service"
      :query-in="queryAdders"
      :params-in="paramsAdders"
      :value="null"
    >
      <template v-slot:list-item="scope">
        <q-slide-transition>
          <template v-if="scope.index < showing">
        <comment-card :parent-model="parentModel" :value="scope.item" :parent-in="parentIn" :service="service" :subject-in="subjectIn"
        ></comment-card>
          </template>
        </q-slide-transition>
      </template>
      <template v-slot:bottom="{total}">
        <div class="row justify-end" v-if="total">
          <q-btn flat v-if="total > showing" size="sm" color="blue" label="more" icon-right="mdi-menu-down" @click="showMore"></q-btn>
          <q-btn flat v-if="showing > 0 && total > 0" size="sm" color="dark" label="less" icon-right="mdi-menu-up" @click="showing > show ? showing = show : showing = 0"></q-btn>
        </div>
      </template>
    </paginate-list>
  </q-card>
</template>

<script>
  import {mapGetters} from 'vuex';
  import CommentCard from 'components/comments/cards/CommentCard';
  import PaginateList from 'components/common/substance/lists/PaginateList';
  import CommentForm from 'components/comments/forms/CommentForm';

  export default {
    name: 'Comments',
    components: { CommentForm, PaginateList, CommentCard },
    mixins: [],
    props: {
      adding: Boolean,
      subjectIn: Object,
      parentModel: String,
      service: String,
      parentIn: Object,
      show: {
        type: Number,
        default: 2
      }
    },
    mounted(){
      this.showing = this.show;
    },
    data(){
      return {
        commenting: false,
        showing: 2,
      };
    },
    watch: {

    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      loadService(){
        return this.service;
      },
      queryAdders(){
        return {
          $sort: { createdAt: -1 },
          _id: { $in: this.lget(this.parentIn, 'comments', [])}
        };
      },
      paramsAdders(){
        return {
          $populateParams: { name: 'withVideos' }
        };
      }
    },
    methods: {
      showMore(){
        this.showing += this.show;
      },

    }
  };
</script>
