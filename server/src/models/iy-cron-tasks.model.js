// iy-cron-tasks-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const iyCronTasks = new Schema({
    deleted: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'users' },
    name: String,
    description: String,
    service: String,
    path: String,
    timeout: Number,
    interval: Number,
    date: Date,
    second: [{type: Number, min: 0, max: 59}],
    minute: [{type: Number, min: 0, max: 59}],
    hour: [{type: Number, min: 0, max: 23}],
    daysOfMonth: [{type: Number, min: 0, max: 31}],
    month: [{ type: Number, min: 0, max: 12}],
    daysOfWeek: [{ type: Number, min: 0, max: 6}],
    functionName: String
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('iyCronTasks');
  } catch (e) {
    return mongooseClient.model('iyCronTasks', iyCronTasks);
  }
};
