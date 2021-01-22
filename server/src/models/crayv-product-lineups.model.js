// product-lineups-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const Common = require('./common.schemas');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const crayvProductLineups = new Schema({
    deleted: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'users' },
    img: { type: Common.Images },
    name: String,
    description: String,
    vendorId: {type: Schema.Types.ObjectId, ref: 'crayv-vendors'},
    vendorSettings: [{type: Schema.Types.ObjectId, ref: 'crayv-vendor-settings'}],
    events: [{
      type: Object, contains: {
        id: { type: String, },
        appId: String,
        appName: String
      }
    }],
    recommended: [{id: {type: Schema.Types.ObjectId, refPath: 'idModel'}, idModel: { type: String, enum: ['crayv-products', 'crayv-product-groups']}}],
    settings: {
      productSettings: { type: Common.ProductSettings }
    },
    products: [{type: Schema.Types.ObjectId, ref: 'crayv-products'}],
    productGroups: [{type: Schema.Types.ObjectId, ref: 'crayv-product-groups'}]
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('ProductLineups');
  } catch (e) {
    return mongooseClient.model('ProductLineups', crayvProductLineups);
  }
};
