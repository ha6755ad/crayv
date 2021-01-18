const { populate } = require('feathers-graph-populate');
// const lget = require('lodash.get');
const { relateMtm, removeMtm, relateOtm, removeOtm } = require('../../hooks/relate');

const populates = {
  // promos: {
  //   service: 'crayv-promotions',
  //   nameAs: 'crayv-products',
  //   keyHere: '_id',
  //   keyThere: 'crayv-promotions',
  //   asArray: true,
  //   params: {}
  // }
};
const namedQueries = {
  // withPromos: {
  //   promos: {}
  // }
};

const relateProducts = async context => {
  let config = {
    herePath: 'crayv-products',
    therePath: 'crayv-promotions',
    thereService: 'crayv-products'
  };
  if(context.method === 'remove') await removeMtm(context)(config);
  else await relateMtm(context)(config);
};

const relateVendor = async context => {
  let config = {
    herePath: 'vendor',
    therePath: 'crayv-promotions',
    thereService: 'crayv-vendors'
  };
  if(context.method === 'remove') await removeOtm(context)(config);
  else await relateOtm(context)(config);
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [relateProducts],
    patch: [relateProducts],
    remove: []
  },

  after: {
    all: [
      populate({ populates, namedQueries }),
    ],
    find: [],
    get: [],
    create: [relateProducts, relateVendor],
    update: [relateProducts, relateVendor],
    patch: [relateProducts, relateVendor],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [relateProducts],
    patch: [relateProducts],
    remove: []
  }
};
