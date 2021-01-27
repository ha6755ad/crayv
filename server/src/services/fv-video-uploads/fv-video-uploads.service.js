// Initializes the `fv-video-uploads` service on path `/fv-video-uploads`
const { FvVideoUploads } = require('./fv-video-uploads.class');
const createModel = require('../../models/fv-video-uploads.model');
const hooks = require('./fv-video-uploads.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whiteList: ['$regex', '$options']
  };

  // Initialize our service with any options it requires
  app.use('/fv-video-uploads', new FvVideoUploads(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('fv-video-uploads');

  service.hooks(hooks);
};
