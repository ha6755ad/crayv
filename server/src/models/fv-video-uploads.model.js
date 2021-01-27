// fv-video-uploads-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const FvVideoUploads = new Schema({
    deleted: {type: Boolean, required: true, default: false},
    author: String,
    creator: {type: Schema.Types.ObjectId, ref: 'users'},
    uploadId: String,
    name: String,
    description: String,
    embed: String,
    file: String,
    uriRef: String,
    host: String,
    uri: String,
    status: {type: String, enum: [null, 'uploading', 'processing', 'ready', 'error']},
    thumbnails: [String],
    views: [{type: Schema.Types.ObjectId, ref: 'll-views'}]
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('FvVideoUploads');
  } catch (e) {
    return mongooseClient.model('FvVideoUploads', FvVideoUploads);
  }
};
