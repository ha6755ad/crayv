// iy-queue-logs-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const iyQueueLogs = new Schema({
    deleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'users' },
    queue: { type: Schema.Types.ObjectId, ref: 'iy-queue' },
    message: String,
    context: {
      data: { type: Object },
      result: { type: Object },
      params: { type: Object },
      path: String,
      method: String,
      type: String,
      id: String,
      error: { type: Object },
      statusCode: String,
    }
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('iyQueueLogs');
  } catch (e) {
    return mongooseClient.model('iyQueueLogs', iyQueueLogs);
  }
};
