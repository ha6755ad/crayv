// Initializes the `crayv-promotions` service on path `/crayv-promotions`
const { CrayvPromotions } = require('./crayv-promotions.class');
const createModel = require('../../models/crayv-promotions.model');
const hooks = require('./crayv-promotions.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/crayv-promotions', new CrayvPromotions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('crayv-promotions');

  service.hooks(hooks);
};
