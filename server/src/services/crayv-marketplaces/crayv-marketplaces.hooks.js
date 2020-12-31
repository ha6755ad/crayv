const { authenticate } = require('@feathersjs/authentication');
const lget = require('lodash.get');
const { relateOto, removeOto } = require('../../hooks/relate');

const preventRemove = async context => {
  let current = await context.app.service('crayv-marketplaces').get(context.id);
  if(lget(current, ['vendorSettings', 0])){
    throw new Error('You cannot delete a marketplace with active vendor accounts');
  }
};

const relateHost = async context => {
  let config = {
    herePath: 'host',
    therePath: 'marketplace',
    thereService: 'bw-pods'
  };
  if(context.method === 'remove') await removeOto(context, config);
  else await relateOto(context, config);
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate('jwt')],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt'), preventRemove]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [relateHost],
    update: [relateHost],
    patch: [relateHost],
    remove: [relateHost]
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
