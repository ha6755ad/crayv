// Initializes the `fv-youtube` service on path `/fv-youtube`
const { FvYoutube } = require('./fv-youtube.class');
const hooks = require('./fv-youtube.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/fv-youtube', new FvYoutube(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('fv-youtube');

  service.hooks(hooks);
};
