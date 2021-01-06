// Initializes the `tomtom-geocode` service on path `/tomtom-geocode`
const { TomtomGeocode } = require('./tomtom-geocode.class');
const hooks = require('./tomtom-geocode.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tomtom-geocode', new TomtomGeocode(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tomtom-geocode');

  service.hooks(hooks);
};
