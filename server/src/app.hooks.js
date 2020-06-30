// Application hooks that run for every service
const ServiceLogger = require('./hooks/service-logger');




module.exports = {
  before: {
    all: [ServiceLogger({LEVEL: 'warning'})],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      ServiceLogger({LEVEL: 'info'})
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
      ServiceLogger({LEVEL: 'info'})
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
