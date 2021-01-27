// Initializes the `crayv-offers` service on path `/crayv-offers`
const { CrayvOffers } = require('./crayv-offers.class');
const createModel = require('../../models/crayv-offers.model');
const hooks = require('./crayv-offers.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$exists']
  };

  // Initialize our service with any options it requires
  app.use('/crayv-offers', new CrayvOffers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('crayv-offers');

  service.hooks(hooks);
};
