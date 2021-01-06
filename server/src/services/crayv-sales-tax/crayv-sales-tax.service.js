// Initializes the `sales-tax` service on path `/sales-tax`
const { CrayvSalesTax } = require('./crayv-sales-tax.class');
const createModel = require('../../models/crayv-sales-tax.model');
const hooks = require('./crayv-sales-tax.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/crayv-sales-tax', new CrayvSalesTax(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('crayv-sales-tax');

  service.hooks(hooks);
};
