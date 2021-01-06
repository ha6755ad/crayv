// Initializes the `tomtom-reverse-geocode` service on path `/tomtom-reverse-geocode`
const { TomtomReverseGeocode } = require('./tomtom-reverse-geocode.class');
const hooks = require('./tomtom-reverse-geocode.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tomtom-reverse-geocode', new TomtomReverseGeocode(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tomtom-reverse-geocode');

  service.hooks(hooks);
};
