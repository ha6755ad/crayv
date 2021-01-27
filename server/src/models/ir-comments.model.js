//ir-comments-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const Common = require('./common.schemas');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const irComments = new Schema({
    parent: {type: Schema.Types.ObjectId, refPath: 'parentModel'},
    parentModel: {type: String, enum: ['ir-blog', 'ir-comments', 'ir-forum', 'ir-forum-answers', 'crayv-offers'], required: true},
    deleted: {type: Boolean, default: false},
    createdBy: {type: Schema.Types.ObjectId, ref: 'users'},
    updatedBy: {type: Schema.Types.ObjectId, ref: 'users'},
    body: {type: String},
    bodyColor: String,
    images: [{type: Common.Images}],
    videos: [{type: Schema.Types.ObjectId, ref: 'fv-video-uploads'}],
    voteScore: {type: Number, default: 0},
    upVotes: [{type: Schema.Types.ObjectId, ref: 'users'}],
    downVotes: [{type: Schema.Types.ObjectId, ref: 'users'}],
    comments: [{type: Schema.Types.ObjectId, ref: 'ir-comments'}]
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('irComments');
  } catch (e) {
    return mongooseClient.model('irComments', irComments);
  }
};
