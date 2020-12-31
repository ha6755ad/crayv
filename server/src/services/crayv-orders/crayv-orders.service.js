// Initializes the `crayv-orders` service on path `/crayv-orders`
const { CrayvOrders } = require('./crayv-orders.class');
const createModel = require('../../models/crayv-orders.model');
const hooks = require('./crayv-orders.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$elemMatch']
  };

  // Initialize our service with any options it requires
  app.use('/crayv-orders', new CrayvOrders(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('crayv-orders');

  service.hooks(hooks);
};
