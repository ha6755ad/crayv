// Initializes the `crayv-vendor-settings` service on path `/crayv-vendor-settings`
const { CrayvVendorSettings } = require('./crayv-vendor-settings.class');
const createModel = require('../../models/crayv-vendor-settings.model');
const hooks = require('./crayv-vendor-settings.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/crayv-vendor-settings', new CrayvVendorSettings(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('crayv-vendor-settings');

  service.hooks(hooks);
};
