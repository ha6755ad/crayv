// Initializes the `lc-crayv-product-lineups` service on path `/lc-crayv-product-lineups`
const { CrayvProductLineups } = require('./crayv-product-lineups.class');
const createModel = require('../../models/crayv-product-lineups.model');
const hooks = require('./crayv-product-lineups.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/crayv-product-lineups', new CrayvProductLineups(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('crayv-product-lineups');

  service.hooks(hooks);
};
