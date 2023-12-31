// crayv-offers-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const Common = require('./common.schemas');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const crayvOffers = new Schema({
    deleted: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'users' },
    price: { type: Common.Pricing },
    content: { type: String },
    comments: [{type: Schema.Types.ObjectId, ref: 'ir-comments'}],
    accepted: Date,
    subject: { type: Schema.Types.ObjectId, ref: 'subjectModel'},
    subjectModel: { type: String, enum: ['crayv-classifieds']}
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('crayvOffers');
  } catch (e) {
    return mongooseClient.model('crayvOffers', crayvOffers);
  }
};
