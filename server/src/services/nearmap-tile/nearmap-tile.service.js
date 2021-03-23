// Initializes the `nearmap` service on path `/nearmap`
const { NearmapTile } = require('./nearmap-tile.class');
const hooks = require('./nearmap-tile.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/nearmap-tile', new NearmapTile(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('nearmap-tile');

  service.hooks(hooks);
};
