// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const Common = require('./common.schemas');

module.exports = function (app) {
  const modelName = 'users';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    name: String,
    avatar: { type: Common.Images },
    email: { type: String, unique: true, lowercase: true, required: true },
    password: { type: String, required: true },
    addresses: [{type: Common.Address}],
    phone: { type: Common.Phone },
    orders: [{type: Schema.Types.ObjectId, ref: 'crayv-orders'}],
    carts: [{type: Schema.Types.ObjectId, ref: 'crayv-carts'}],
    vendors: [{type: Schema.Types.ObjectId, ref: 'crayv-vendors'}],
    theme: {
      '--q-color-primary': { type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
      '--q-color-secondary': { type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
      '--q-color-accent': { type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
      '--q-color-dark': { type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },

      '--q-color-positive': { type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
      '--q-color-negative': { type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
      '--q-color-info': { type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
      '--q-color-warning': { type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
    },

    auth0Id: { type: String },
    googleId: { type: String },
    facebookId: { type: String },
    twitterId: { type: String },
    githubId: { type: String },
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);

};
