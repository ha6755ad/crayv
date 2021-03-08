// crayv-crowd-buy-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const Common = require('./common.schemas');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const Discount = new Schema({
    rangeType: { type: String, enum: ['quantity', 'total'], default: 'total'},
    min: Number,
    max: Number,
    discountType: { type: String, enum: ['percent', 'flat'], default: 'percent'},
    discount: Number
  });

  const crayvCrowdBuys = new Schema({
    deleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'users' },
    name: String,
    description: String,
    start: Date,
    end: Date,
    settings: {
      crowdBuySettings: { type: Common.CrowdBuySettings }
    },
    images: [{ type: Common.Images }],
    vendorSettings: { type: Schema.Types.ObjectId, ref: 'crayv-vendor-settings' },
    selling: [{ type: Schema.Types.ObjectId, refPath: 'sellingModel' }],
    sellingModel: { type: String, enum: ['crayv-products', 'crayv-product-groups', 'crayv-product-lineups']},
    minimum: { type: Number, default: 1 },
    maximum: { type: Number },
    discounts: [{type: Discount}],
    orders: [{
      id: { type: Schema.Types.ObjectId, ref: 'crayv-orders' },
      price: Number,
      quantity: Number
    }]
  }, {
    timestamps: true
  });

  const getOrderTotals = () => {
    let total = 0;
    let quantity = 0;
    if (this.orders && this.orders[0]) {
      this.orders.forEach(order => {
        if (order.total) total += order.total;
        if (order.quantity) total += order.quantity;
      })
    }
    return { total: total, quantity: quantity }
  };
  // Define a virtual attribute `UID`
  crayvCrowdBuys.virtual('totalSpend').get(function(){
    return getOrderTotals().total
  });

  crayvCrowdBuys.virtual('totalQuantity').get(function(){
    return getOrderTotals().quantity
  });

  crayvCrowdBuys.set('toObject', { virtuals: true });    // add this
  crayvCrowdBuys.set('toJSON', { virtuals: true });      // add this

  crayvCrowdBuys.plugin(mongooseLeanVirtuals);           // add this

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('crayvCrowdBuys');
  } catch (e) {
    return mongooseClient.model('crayvCrowdBuys', crayvCrowdBuys);
  }
};
