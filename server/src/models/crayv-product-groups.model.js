// product-groups-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const Common = require('./common.schemas');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {Schema} = mongooseClient;
  const crayvProductGroups = new Schema({
    name: String,
    description: String,
    active: {type: Boolean, default: true},
    events: [{
      appId: String,
      appName: String,
      eventId: String
    }],
    type: [{type: String, enum: ['a-la-carte', 'package', 'combo']}],
    price: { type: Common.Pricing },
    lineups: [{type: Schema.Types.ObjectId, ref: 'crayv-lineups'}],
    images: [{type: Common.Images}],
    vendorId: {type: Schema.Types.ObjectId, ref: 'crayv-vendors'},
    parent: {type: Schema.Types.ObjectId, ref: 'crayv-product-groups'}, //TODO: add parent children workflow to the UI
    children: [{type: Schema.Types.ObjectId, ref: 'crayv-product-groups'}],
    settings: {type: Common.ProductSettings},
    options: [{type: Common.ProductOption}],
    products: [{
      type: Object, contains: {
        id: {type: Schema.Types.ObjectId, ref: 'crayv-products'},
        price: Common.Pricing
      }
    }],
    subscriptions: [{ type: Schema.Types.ObjectId, ref: 'crayv-subscriptions' }],
    deleted: {type: Boolean, default: false},
    createdBy: {type: Schema.Types.ObjectId, ref: 'users'},
    updatedBy: {type: Schema.Types.ObjectId, ref: 'users'}
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('productGroups');
  } catch (e) {
    return mongooseClient.model('productGroups', crayvProductGroups);
  }
};
