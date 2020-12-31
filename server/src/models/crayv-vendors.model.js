// vendors-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const Common = require('./common.schemas');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const crayvVendors = new Schema({
    owner: { type: Schema.Types.ObjectId },
    ownerModel: {
      type: String,
      required: true,
      enum: ['users', 'organizations']
    },
    name: '',
    description: '',
    promotions: [{ type: Schema.Types.ObjectId, ref: 'crayv-promotions'}],
    avatar: { type: Common.Images },
    img: { type: Common.Images },
    vendorSettings: [{ type: Schema.Types.ObjectId, ref: 'crayv-vendor-settings' }],
    settings: { type: Common.VendorSettings },
    products: [{ type: Schema.Types.ObjectId, ref: 'crayv-products' }],
    productGroups: [{ type: Schema.Types.ObjectId, ref: 'crayv-product-groups' }],
    productLineups: [{ type: Schema.Types.ObjectId, ref: 'crayv-product-lineups' }],
    stripe: {
      accounts: [{
        id: String,
        completedStepsCount: String
      }],
    },
    roles: {
      superadmin: [{type: Schema.Types.ObjectId, ref: 'users'}],
      admin: [{type: Schema.Types.ObjectId, ref: 'users'}],
    },
    deleted: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'users' },
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('crayv-vendors');
  } catch (e) {
    return mongooseClient.model('crayv-vendors', crayvVendors);
  }
};
