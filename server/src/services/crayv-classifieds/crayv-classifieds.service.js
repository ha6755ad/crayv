// Initializes the `crayv-classifieds` service on path `/crayv-classifieds`
const { CrayvClassifieds } = require('./crayv-classifieds.class');
const createModel = require('../../models/crayv-classifieds.model');
const hooks = require('./crayv-classifieds.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$exists']
  };

  // Initialize our service with any options it requires
  app.use('/crayv-classifieds', new CrayvClassifieds(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('crayv-classifieds');

  service.hooks(hooks);
};
