// Initializes the `bw-comments` service on path `/bw-comments`
const { IrComments } = require('./ir-comments.class');
const createModel = require('../../models/ir-comments.model');
const hooks = require('./ir-comments.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/ir-comments', new IrComments(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('ir-comments');

  service.hooks(hooks);
};
