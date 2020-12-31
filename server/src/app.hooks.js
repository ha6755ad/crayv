// Application hooks that run for every service
const { softDelete, paramsFromClient, iff } = require('feathers-hooks-common');
const { 'paramsFromClient': fGraphParams } = require('feathers-graph-populate');

const removeFastjoin = require('./hooks/remove_fastjoin');

const ServiceLogger = require('./hooks/service-logger');


const createdBy = require('./hooks/created-by');
const updatedBy = require('./hooks/updated-by');


module.exports = {
  before: {
    all: [
      paramsFromClient('disableSoftDelete', 'verify_methods'),
      iff(
        context => !['authentication', 'file-uploader', 'app-tokens'].includes(context.path),
        [
          softDelete()
        ]
      ),
      fGraphParams('$populateParams'),
      // beforeHook,
      removeFastjoin(),
      // paramsFromClient('$populateParams')
    ],
    find: [],
    get: [],
    create: [createdBy(), updatedBy()],
    update: [updatedBy()],
    patch: [updatedBy()],
    remove: [updatedBy()]
  },

  after: {
    all: [
      ServiceLogger({ LEVEL: 'info' })
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [
      ServiceLogger({ LEVEL: 'info' })
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
