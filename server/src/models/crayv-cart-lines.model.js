// cart-lines-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const Common = require('./common.schemas');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const crayvCartLines = new Schema({
    cart: {type: Schema.Types.ObjectId, ref: 'crayv-carts'},
    deleted: {type: Boolean, required: true, default: false},
    group_order: {type: Schema.Types.ObjectId, ref: 'group-orders'},
    product: {type: Common.productOrder, required: true},
    createdBy: {type: Schema.Types.ObjectId, ref: 'users'},
    updatedBy: {type: Schema.Types.ObjectId, ref: 'users'}
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('cartLines');
  } catch (e) {
    return mongooseClient.model('cartLines', crayvCartLines);
  }
};
