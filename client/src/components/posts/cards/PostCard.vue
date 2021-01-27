<template>
  <q-card class="q-pa-sm" flat style="z-index: 2">

    <div class="row items-start" style="z-index: 11;">
      <vote-widget named-query="withVideos" :subject="value" service="bw-posts"></vote-widget>
      <q-space></q-space>
      <div class="text-xxs text-mb-xs text-weight-light q-pt-sm">
        {{ $ago(lget(value, 'createdAt'), 'ddd MMM-DD, YYYY h:mm a') }}
      </div>
      <q-fab size="sm" direction="down" dense flat icon="mdi-dots-vertical" v-if="canEdit" style="z-index: 19">
        <q-fab-action color="dark" label="edit" icon="mdi-pencil-box" @click="editDialog = true"></q-fab-action>
        <q-fab-action color="dark" label="remove" icon="mdi-delete" @click="rmvPost"></q-fab-action>
      </q-fab>
    </div>
    <div class="row items-end">
      <default-avatar :value="poster">
        <template v-slot:menu>
          <q-menu>
            <user-contact size-in="120px" :value="poster" hide-contact show-info></user-contact>
          </q-menu>
        </template>
      </default-avatar>
      <div v-if="value.title"
           :class="`text-md text-mb-lg q-ml-sm text-weight-medium text-${lget(value, 'titleColor')}`">
        {{ value.title }}
      </div>
    </div>

    <q-separator class="q-my-sm" v-if="value && value.body"></q-separator>

    <post-videos :value="value"></post-videos>

    <div>
      <post-images :value="value"></post-images>
    </div>
    <div class="q-px-md q-pt-md text-xs text-mb-sm text-weight-light"
         :style="{ width: '100%', maxHeight: expanded ? '1000vh' : '200px', overflow: 'hidden', textOverflow: 'ellipsis'}"
         v-if="value.body">
      <div v-html="sanitize(value.body)"></div>
    </div>
    <div class="row justify-end text-blue text-xs text-mb-sm" v-if="value.body">
      <div class="pointer q-pb-md" @click="expanded = !expanded">
        {{ expanded ? 'show less' : 'show more' }}
      </div>
    </div>

    <div class="row">
      <div v-if="lget(value, 'comments', []).length" class="text-xs text-mb-sm text-weight-medium">Comments</div>
      <q-space></q-space>
    <q-btn icon="mdi-chat" label="comment" color="blue"  size="sm" flat @click="commenting = true"></q-btn>
    </div>

    <q-slide-transition>
      <template v-if="commenting">
        <comment-form parent-model="bw-posts"  @save="commenting = false" :parent-in="value" service="bw-comments"></comment-form>
      </template>
    </q-slide-transition>

    <div class="q-pl-md">
    <comments parent-model="bw-posts" service="bw-comments" :subject-in="value" :parent-in="value"></comments>
    </div>

    <q-dialog v-model="editDialog" :maximized="$q.screen.lt.sm" transition-show="slide-up" transition-hide="slide-down">
      <q-card style="width: 800px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="editDialog = false"/>
        <post-form start-posting :post-in="value" @input="editDialog = false"></post-form>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import UserContact from 'components/common/atoms/users/UserContact';
  import {mapGetters} from 'vuex';
  import PostForm from 'components/posts/forms/PostForm';
  import PostImages from 'components/posts/cards/PostImages';
  import PostVideos from 'components/posts/cards/PostVideos';
  import CommentForm from 'components/comments/forms/CommentForm';
  import VoteWidget from 'components/posts/cards/VoteWidget';

  export default {
    name: 'PostCard',
    components: { VoteWidget, CommentForm, PostVideos, PostImages, PostForm, UserContact, DefaultAvatar },
    props: {
      value: Object
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
      canEdit() {
        return this.lget(this.user, '_id', '*') === this.lget(this.poster, '_id') || this.isWhitelist(this.lget(this.user, 'email'));
      }
    },
    methods: {
      rmvPost() {
        this.$q.dialog({
          title: 'Remove Post?',
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
          this.$store.dispatch('bw-posts/remove', this.value._id)
            .catch(err => this.$errNotify(err.message));
        });
      }
    }
  };
</script>

<style scoped lang="scss">

</style>
