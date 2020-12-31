const { authenticate } = require('@feathersjs/authentication');
// const lget = require('lodash.get');
const { relateOtm, removeOtm } = require('../../hooks/relate');

const relateMarketplace = async context => {
  let config = {
    herePath: 'marketplace',
    therePath: 'vendorSettings',
    thereService: 'crayv-marketplaces'
  };
  if(context.method === 'remove') await removeOtm(context, config);
  else await relateOtm(context, config);
};

// const checkRoles = async context => {
//   const marketplaceFields = ['disallowedProducts', 'pendingProducts'];
// };

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate('jwt')],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [relateMarketplace],
    update: [relateMarketplace],
    patch: [relateMarketplace],
    remove: [relateMarketplace]
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
