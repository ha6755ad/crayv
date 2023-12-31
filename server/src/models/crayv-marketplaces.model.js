// ir-commerce-marketplaces-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const Common = require('./common.schemas');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const crayvMarketplaces = new Schema({
    deleted: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'users' },
    name: { type: String, index: true, unique: true },
    description: String,
    host: { type: Schema.Types.ObjectId },
    tags: [String],
    privacy: { type: String, enum: Common.privacyEnum, default: 'public' },
    avatar: { type: Common.Images },
    images: [{ type: Common.Images }],
    vendorSettings: [{ type: Schema.Types.ObjectId, ref: 'crayv-vendor-settings' }],
    recommendProducts: [{
      description: String,
      id: { type: Schema.Types.ObjectId, ref: 'crayv-products' }
    }],
    currency: { type: String, default: 'usd' },
    currencies: [String],
    settings: {
      stripe_account: {type: String},
      approvals: {type: String, enum: ['vendor', 'admin']}
    },

    pricing: {
      flatFee: Number,
      flatFeeType: {type: String, enum: ['transaction', 'subscription'], default: 'transaction'},
      flatFeeRecurrence: {type: Common.RRULE},
      percentageFee: Number,
      feeType: {type: String, enum: ['percentage', 'flat', 'combo', 'option']}
    },
    roles: {
      superadmin: [{type: Schema.Types.ObjectId, ref: 'users'}],
      admin: [{type: Schema.Types.ObjectId, ref: 'users'}],
    }
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('irCommerceMarketplaces');
  } catch (e) {
    return mongooseClient.model('irCommerceMarketplaces', crayvMarketplaces);
  }
};
