const { relateOtm, removeOtm } = require('../../hooks/relate');

const relateQueue = async context => {
  let config = {
    herePath: 'queue',
    therePath: 'logs',
    thereService: 'iy-queue'
  };
  if(context.method === 'remove') return await removeOtm(config)(context);
  else return await relateOtm(config)(context);
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [relateQueue],
    update: [relateQueue],
    patch: [relateQueue],
    remove: [relateQueue]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
