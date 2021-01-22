// Initializes the `iy-cron-tasks` service on path `/iy-cron-tasks`
const { IyCronTasks } = require('./iy-cron-tasks.class');
const createModel = require('../../models/iy-cron-tasks.model');
const hooks = require('./iy-cron-tasks.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/iy-cron-tasks', new IyCronTasks(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('iy-cron-tasks');

  service.hooks(hooks);
};
