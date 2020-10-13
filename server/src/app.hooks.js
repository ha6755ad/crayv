// Application hooks that run for every service
const ServiceLogger = require('./hooks/service-logger');

const restQueryUnstringify = require('./hooks/rest-query-unstringify');


module.exports = {
  before: {
    all: [
      restQueryUnstringify(),
      ServiceLogger({LEVEL: 'warning'}),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      ServiceLogger({LEVEL: 'info'}),
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
      ServiceLogger({LEVEL: 'info'}),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
