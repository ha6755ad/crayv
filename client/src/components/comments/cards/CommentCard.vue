<template>
  <q-card flat class="q-pa-sm" style="width: 100%">
    <div class="row">
      <default-avatar :value="poster">
        <template v-slot:menu>
          <slot name="menu" :value="poster"></slot>
        </template>
      </default-avatar>
      <q-space></q-space>
      <div style="z-index: 11; display: flex; align-items: center">
        <div class="text-xxs text-mb-xs text-weight-light">
          {{ $ago(lget(value, 'createdAt'), 'ddd MMM-DD, YYYY h:mm a') }}
        </div>
        <q-btn :dropdown-icon="null" size="sm" dense flat icon="mdi-dots-vertical" v-if="canEdit" style="z-index: 19">
          <q-menu style="box-shadow: none">
            <q-list dense>
              <q-item dense clickable @click="editDialog = true">
                <q-item-section avatar>
                  <q-icon name="mdi-pencil-box"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label>EDIT</q-item-label>
                </q-item-section>
              </q-item>
              <q-item dense clickable @click="rmvComment">
                <q-item-section avatar>
                  <q-icon name="mdi-delete"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label>REMOVE</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>
    <div class="q-pt-md" style="display: flex; flex-direction: column; justify-content: flex-end">
      <div class="text-xxs text-mb-xs"
           :style="{ width: '100%', maxHeight: expanded ? '1000vh' : '200px', overflow: 'hidden', textOverflow: 'ellipsis'}">
        {{ lget(value, 'body') }}
      </div>
    </div>
    <div class="q-pb-md row justify-end text-blue text-xxs text-mb-xs" v-if="value.body">
      <div class="pointer" @click="expanded = !expanded">
        {{ expanded ? 'show less' : 'show more' }}
      </div>
    </div>

    <div class="row q-my-md" v-if="videosLength">
      <div style="width: 400px; max-width: 100%">
        <post-videos :value="value"></post-videos>
      </div>
    </div>
    <div class="row q-my-md" v-if="imagesLength">
      <div style="width: 400px; max-width: 100%">
        <post-images :value="value"></post-images>
      </div>
    </div>

    <div class="row">
      <q-btn icon="mdi-chat" color="nice" size="sm" flat @click="commenting = !commenting"></q-btn>
      <q-space></q-space>
      <vote-widget :named-query="namedQuery" :subject="value" :service="service"></vote-widget>
    </div>

    <q-slide-transition>
      <template v-if="commenting">
        <comment-form :service="service" :parentModel="computedParentModel" @save="commenting = false"
                      :parent-in="commentTo"></comment-form>
      </template>
    </q-slide-transition>

    <div class="q-pl-lg" v-if="lget(commentTo, '_id') === lget(value, '_id')">
      <comments :service="service" :key="uuid()" :parent-model="parentModel" :subject-in="parentIn"
                :parent-in="value"></comments>
    </div>

    <q-dialog v-model="editDialog" :maximized="$q.screen.lt.sm" transition-show="slide-up" transition-hide="slide-down">
      <q-card style="width: 800px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="editDialog = false"/>
        <comment-form :service="service" :parent-model="service" :comment-in="value"
                      @input="editDialog = false"></comment-form>
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script>
  import DefaultAvatar from '../../common/atoms/avatars/DefaultAvatar';
  import {mapGetters} from 'vuex';
  import PostImages from '../../posts/cards/PostImages';
  import PostVideos from '../../posts/cards/PostVideos';
  import CommentForm from '../forms/CommentForm';
  import VoteWidget from '../../posts/cards/VoteWidget';
  import Comments from './Comments';

  export default {
    components: { Comments, VoteWidget, CommentForm, PostVideos, PostImages, DefaultAvatar },
    props: {
      namedQuery: String,
      parentIn: Object,
      parentModel: String,
      subjectIn: Object,
      value: Object,
      service: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        commenting: false,
        editDialog: false,
        expanded: false
      };
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      poster() {
        return this.lget(this.value, '_fastjoin.user');
      },
      videosLength() {
        return this.lget(this.value, 'videos', []).length;
      },
      imagesLength() {
        return this.lget(this.value, 'images', []).length;
      },
      commentTo() {
        // LIMIT COMMENTS TO 1 LAYER DEEP
        if (String(this.lget(this.parentIn, '_id', '1')) === String(this.lget(this.subjectIn, '_id', '2'))) {
          return this.value;
        } else return this.subjectIn;
      },
      computedParentModel() {
        if (String(this.lget(this.parentIn, '_id', '1')) === String(this.lget(this.subjectIn, '_id', '2'))) {
          return this.service;
        } else return this.parentModel;
      },
      canEdit() {
        return this.lget(this.user, '_id', '*') === this.lget(this.poster, '_id') || this.lget(this.subjectIn, '_fastjoin.user._id') === this.lget(this.user, '_id') || this.isWhitelist(this.lget(this.user, 'email'));
      }
    },
    methods: {
      rmvComment() {
        this.$q.dialog({
          title: 'Remove Comment?',
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
          this.$store.dispatch(`${this.service}/remove`, this.value._id)
            .catch(err => this.$errNotify(err.message));
        });
      }
    }
  };
</script>
