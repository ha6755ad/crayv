const { authenticate } = require('@feathersjs/authentication');
// const lget = require('lodash.get');
const { relateOtm, removeOtm } = require('../../hooks/relate');

const { populate } = require('feathers-graph-populate');

const populates = {};

const namedQueries = {};

const relateMarketplace = async context => {
  let config = {
    herePath: 'marketplace',
    therePath: 'vendorSettings',
    thereService: 'crayv-marketplaces'
  };
  if(context.method === 'remove') await removeOtm(context)(config);
  else await relateOtm(context)(config);
};

const relateVendor = async context => {
  let config = {
    herePath: 'vendor',
    therePath: 'vendorSettings',
    thereService: 'crayv-vendors'
  };
  if(context.method === 'remove') return await removeOtm(context)(config);
  else return await relateOtm(config)(context)
    .then(res => console.log('relate res', res));
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
    all: [populate({populates, namedQueries})],
    find: [],
    get: [],
    create: [relateMarketplace, relateVendor],
    update: [relateMarketplace, relateVendor],
    patch: [relateMarketplace, relateVendor],
    remove: [relateMarketplace, relateVendor]
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
