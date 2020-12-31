// orders-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const Common = require('./common.schemas');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const crayvOrders = new Schema({
    confirmation: {
      id: String
    },
    status: {type: String, enum: ['pending', 'complete', 'error', 'cancelled', null]},
    deleted: {type: Boolean, required: true, default: false},
    subtotal: Number,
    tax: Number,
    soldBy: {type: Schema.Types.ObjectId, ref: 'lc-scorecard'},
    cart: {type: Schema.Types.ObjectId, ref: 'crayv-carts'},
    person: {type: Schema.Types.ObjectId, ref: 'users'},
    group_order: {type: Schema.Types.ObjectId, ref: 'group_orders'},
    products: [{type: Common.productOrder}],
    location: {type: Common.Address, required: false},
    reference: {
      id: String,
      url: String,
      blinq_transaction: String
    },
    device: {},
    createdBy: {type: Schema.Types.ObjectId, ref: 'users'},
    updatedBy: {type: Schema.Types.ObjectId, ref: 'users'}
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('orders');
  } catch (e) {
    return mongooseClient.model('orders', crayvOrders);
  }
};
