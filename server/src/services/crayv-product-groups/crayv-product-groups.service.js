// Initializes the `crayv-product-groups` service on path `/crayv-product-groups`
const { CrayvProductGroups } = require('./crayv-product-groups.class');
const createModel = require('../../models/crayv-product-groups.model');
const hooks = require('./crayv-product-groups.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['$regex', '$options', '$exists']
  };

  // Initialize our service with any options it requires
  app.use('/crayv-product-groups', new CrayvProductGroups(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('crayv-product-groups');

  service.hooks(hooks);
};
