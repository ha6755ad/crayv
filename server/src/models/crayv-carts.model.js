// carts-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const crayvCarts = new Schema({
    active: {type: Boolean, default: true},
    deleted: {type: Boolean, required: true, default: false},
    person: {type: Schema.Types.ObjectId, ref: 'users'},
    group: {type: Schema.Types.ObjectId, ref: 'organizations'},
    currency: {type: String, enum: ['usd', 'ngn'], required: true, default: 'usd'},
    createdBy: {type: Schema.Types.ObjectId, ref: 'users'},
    updatedBy: {type: Schema.Types.ObjectId, ref: 'users'}
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('crayv-carts');
  } catch (e) {
    return mongooseClient.model('crayv-carts', crayvCarts);
  }
};
