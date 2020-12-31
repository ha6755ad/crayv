// ir-commerce-vendor-settings-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const Common = require('./common.schemas');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const crayvVendorSettings = new Schema({
    deleted: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'users' },
    marketplace: { type: Schema.Types.ObjectId, ref: 'crayv-marketplaces' },
    name: String,
    avatar: { type: Common.Images },
    img: { type: Common.Images },
    settings: { type: Common.VendorSettings },
    syncProducts: Boolean,
    products: [{ type: Schema.Types.ObjectId, ref: 'crayv-products' }],
    disallowedProducts: [{ type: Schema.Types.ObjectId, ref: 'crayv-products' }],
    pendingProducts: [{type: Schema.Types.ObjectId, ref: 'crayv-products'}],
    productGroups: [{ type: Schema.Types.ObjectId, ref: 'crayv-product-groups' }],
    productLineups: [{ type: Schema.Types.ObjectId, ref: 'crayv-product-lineups' }],
    promotions: [{ type: Schema.Types.ObjectId, ref: 'crayv-promotions' }]
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('irCommerceVendorSettings');
  } catch (e) {
    return mongooseClient.model('irCommerceVendorSettings', crayvVendorSettings);
  }
};
