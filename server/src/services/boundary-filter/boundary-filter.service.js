// Initializes the `boundary-filter` service on path `/boundary-filter`
const { BoundaryFilter } = require('./boundary-filter.class');
const hooks = require('./boundary-filter.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/boundary-filter', new BoundaryFilter(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('boundary-filter');

  service.hooks(hooks);
};
