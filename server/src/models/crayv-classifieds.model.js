// crayv-classifieds-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const Common = require('./common.schemas');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const crayvClassifieds = new Schema({
    deleted: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'users' },
    images: [{type: Common.Images}],
    name: String,
    description: String,
    price: { type: Common.Pricing },
    type: { type: String, enum: ['obo', 'first']},
    tags: [{type: String}],
    location: { type: Common.Address },
    boundary: { type: Common.GeoLocation },
    sold: Date,
    offers: [{type: Schema.Types.ObjectId, ref: 'crayv-offers'}],
    accepted: {type: Schema.Types.ObjectId, ref: 'crayv-offers'}
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('crayvClassifieds');
  } catch (e) {
    return mongooseClient.model('crayvClassifieds', crayvClassifieds);
  }
};
