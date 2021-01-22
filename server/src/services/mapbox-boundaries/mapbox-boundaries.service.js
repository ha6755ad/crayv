// Initializes the `mapbox-boundaries` service on path `/mapbox-boundaries`
const { MapboxBoundaries } = require('./mapbox-boundaries.class');
const hooks = require('./mapbox-boundaries.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/mapbox-boundaries', new MapboxBoundaries(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('mapbox-boundaries');

  service.hooks(hooks);
};
