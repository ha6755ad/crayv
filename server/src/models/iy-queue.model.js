// iy-queue-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const iyQueue = new Schema({
    deleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'users' },
    status: { type: String, enum: ['complete', 'queue', 'error', 'abandoned']},
    tries: { type: Number, default: 0},
    service: String,
    id: {type: Schema.Types.ObjectId},
    contextParams: {type: Object},
    action: {type: String, enum: ['create', 'update', 'patch', 'remove']},
    path: {type: String},
    operator: String,
    value: { type: Schema.Types.Mixed },
    logs: [{ type: Schema.Types.ObjectId, ref: 'iy-queue-logs' }]
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('iyQueue');
  } catch (e) {
    return mongooseClient.model('iyQueue', iyQueue);
  }
};
