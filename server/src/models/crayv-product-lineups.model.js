// product-lineups-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const crayvProductLineups = new Schema({
    name: String,
    description: String,
    vendor: {type: String},
    events: [{
      type: Object, contains: {
        id: { type: String, },
        appId: String,
        appName: String
      }
    }],
    deleted: {type: Boolean, required: true, default: false},
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
