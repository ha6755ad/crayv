// Initializes the `iy-queue-logs` service on path `/iy-queue-logs`
const { IyQueueLogs } = require('./iy-queue-logs.class');
const createModel = require('../../models/iy-queue-logs.model');
const hooks = require('./iy-queue-logs.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/iy-queue-logs', new IyQueueLogs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('iy-queue-logs');

  service.hooks(hooks);
};
