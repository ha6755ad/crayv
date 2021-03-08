// products-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const Common = require('./common.schemas');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const crayvProducts = new Schema({
    name: String,
    description: String,
    type: { type: String, enums: ['content', 'physical', 'service', 'subscription', 'event'] },
    tags: [String],
    active: { type: Boolean, default: true },
    images: [{ type: Common.Images }],
    events: [{
      type: Object, contains: {
        id: { type: String, },
        appId: String,
        appName: String
      }
    }],
    productLineups: [{ type: Schema.Types.ObjectId, ref: 'crayv-lineups' }],
    variants: [{ type: Common.ProductVariant }],
    options: [{ type: Common.ProductOption }],
    productGroups: [{ type: Schema.Types.ObjectId, ref: 'crayv-product-groups' }],
    groupOrders: { type: Boolean, default: false },
    settings: {
      productSettings: { type: Common.ProductSettings }
    },
    shipping: { type: Object },
    vendorId: { type: Schema.Types.ObjectId, ref: 'crayv-vendors' },
    subscriptions: [{ type: Schema.Types.ObjectId, ref: 'subscriptions' }],
    promotions: [{ type: Schema.Types.ObjectId, ref: 'crayv-promotions' }],
    price: Common.Pricing,
    inventory: { type: Common.ProductInventory },
    bom: {
      type: Object, contains: {
        content_ids: [{ type: String }]
      }
    },
    deleted: {
      type: Boolean,
      default:
          false
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'users' }
  }, {
    timestamps: true
  }
  )
  ;

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('crayv-products');
  } catch (e) {
    return mongooseClient.model('crayv-products', crayvProducts);
  }
};
