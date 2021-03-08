// Initializes the `crayv-crowd-buy` service on path `/crayv-crowd-buy`
const { CrayvCrowdBuys } = require('./crayv-crowd-buys.class');
const createModel = require('../../models/crayv-crowd-buys.model');
const hooks = require('./crayv-crowd-buys.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    lean: {virtuals: true},
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/crayv-crowd-buys', new CrayvCrowdBuys(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('crayv-crowd-buys');

  service.hooks(hooks);
};
