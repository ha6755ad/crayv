// Initializes the `crayv-products` service on path `/crayv-products`
const { CrayvProducts } = require('./crayv-products.class');
const createModel = require('../../models/crayv-products.model');
const hooks = require('./crayv-products.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$exists', '$elemMatch']
  };

  // Initialize our service with any options it requires
  app.use('/crayv-products', new CrayvProducts(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('crayv-products');

  service.hooks(hooks);
};
