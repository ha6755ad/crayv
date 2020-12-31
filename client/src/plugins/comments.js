import Comments from 'components/comments/cards/Comments';

const CommentsComponent = {
  install (Vue) {
    Vue.component('Comments', Comments);
  }
};

export default CommentsComponent;
