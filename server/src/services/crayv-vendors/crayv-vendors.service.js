// Initializes the `crayv-vendors` service on path `/crayv-vendors`
const { CrayvVendors } = require('./crayv-vendors.class');
const createModel = require('../../models/crayv-vendors.model');
const hooks = require('./crayv-vendors.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$exists']
  };

  // Initialize our service with any options it requires
  app.use('/crayv-vendors', new CrayvVendors(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('crayv-vendors');

  service.hooks(hooks);
};
