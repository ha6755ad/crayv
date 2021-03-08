// Initializes the `iy-events` service on path `/iy-events`
const { IyEvents } = require('./iy-events.class');
const createModel = require('../../models/iy-events.model');
const hooks = require('./iy-events.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/iy-events', new IyEvents(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('iy-events');

  service.hooks(hooks);
};
