// Initializes the `crayv-marketplaces` service on path `/crayv-marketplaces`
const { CrayvMarketplaces } = require('./crayv-marketplaces.class');
const createModel = require('../../models/crayv-marketplaces.model');
const hooks = require('./crayv-marketplaces.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/crayv-marketplaces', new CrayvMarketplaces(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('crayv-marketplaces');

  service.hooks(hooks);
};
