// iy-events-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const Common = require('./common.schemas');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const Attendee = new Schema({
    id: { type: Schema.Types.ObjectId, refPath: 'idModel' },
    idModel: { type: String },
    name: String,
    email: String,
    phone: { type: Common.Phone },
    type: { type: String, enum: ['inbound', 'outbound']},
    status: { type: String, enum: ['pending', 'accepted', 'rejected']},
    ticket: { type: Schema.Types.ObjectId },
  });

  const iyEvents = new Schema({
    deleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'users' },
    name: String,
    description: String,
    images: [{type: Common.Images}],
    color: { type: Common.Color },
    online: {
      isOnline: Boolean,
      location: String,
      instructions: String,
    },
    location: { type: Common.GeoLocation },
    address: { type: Common.Address },
    start: Date,
    end: Date,
    recurrence: { type: Common.RRULE },
    parent: { type: Schema.Types.ObjectId, ref: 'iy-events' },
    children: [{ type: Schema.Types.ObjectId, ref: 'iy-events' }],
    privacy: { type: String, enum: Common.privacyEnum },
    attendees: {
      limit: Number,
      approval: { String, enum: ['open', 'required']},
      attendees: [{ type: Attendee }]
    }
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('iyEvents');
  } catch (e) {
    return mongooseClient.model('iyEvents', iyEvents);
  }
};
