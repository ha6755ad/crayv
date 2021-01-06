// sales-tax-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const salesTax = new Schema({
    country: String, //two letter
    city: String,
    postal_code: String,
    total_tax: Number,
    rates: [
      {
        type: Object,
        contains: {
          name: String,
          rate: Number,
        },
      }
    ],
    expires: Date
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('salesTax');
  } catch (e) {
    return mongooseClient.model('salesTax', salesTax);
  }
};
