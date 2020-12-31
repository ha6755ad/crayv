// promotions-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const Common = require('./common.schemas');
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const crayvPromotions = new Schema({
    active: {type: Boolean, default: true},
    deleted: Boolean,
    appName: String,
    appId: String,
    groups: [{
      id: String,
      idRef: String
    }],
    vendor: {type: Schema.Types.ObjectId, ref: 'crayv-vendors'},
    vendorLocations: [{type: String}],
    type: {type: String, enum: ['global', 'deal', null]}, //TODO: add more type scenarios
    products: [{type: Schema.Types.ObjectId, ref: 'crayv-products'}],
    excludeProducts: [{type: Schema.Types.ObjectId, ref: 'crayv-products'}],
    allProducts: Boolean,
    name: String,
    usage: {
      checkIns: [{
        type: Object, contains: {
          person: String,
          date: {type: Date}
        }
      }]
    },
    settings: {
      available: Date,
      limitations: String,
      expires: {type: Date},
      limit: Number,
      productWhitelist: [{type: Schema.Types.ObjectId, ref: 'crayv-products'}]
    },
    images: [{type: Common.Images}],
    description: String,
    value: {
      type: Object, contains: {
        type: {type: String, enum: ['percentage', 'flat', 'bogo']},
        bogoBuy: {type: Number},
        bogoGet: {type: Number},
        maxDiscountAmount: Number,
        maxDiscountQuantity: Number,
        minPurchaseAmount: Number,
        minPurchaseQuantity: Number,
        value: [String, Number]
      }
    }
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('crayv-promotions');
  } catch (e) {
    return mongooseClient.model('crayv-promotions', crayvPromotions);
  }
};
