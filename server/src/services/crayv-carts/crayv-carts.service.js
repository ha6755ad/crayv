// Initializes the `carts` service on path `/carts`
const { CrayvCarts } = require('./crayv-carts.class');
const createModel = require('../../models/crayv-carts.model');
const hooks = require('./crayv-carts.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/crayv-carts', new CrayvCarts(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('crayv-carts');

  service.hooks(hooks);
};
