// Initializes the `cart-lines` service on path `/cart-lines`
const { CrayvCartLines } = require('./crayv-cart-lines.class');
const createModel = require('../../models/crayv-cart-lines.model');
const hooks = require('./crayv-cart-lines.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/crayv-cart-lines', new CrayvCartLines(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('crayv-cart-lines');

  service.hooks(hooks);
};
