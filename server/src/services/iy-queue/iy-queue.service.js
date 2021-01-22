// Initializes the `iy-queue` service on path `/iy-queue`
const { IyQueue } = require('./iy-queue.class');
const createModel = require('../../models/iy-queue.model');
const hooks = require('./iy-queue.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/iy-queue', new IyQueue(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('iy-queue');

  service.hooks(hooks);
};
