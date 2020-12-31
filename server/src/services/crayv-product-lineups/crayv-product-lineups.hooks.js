const { populate } = require('feathers-graph-populate');
const { relateOtm,  removeOtm, relateMtm, removeMtm } = require('../../hooks/relate');
// const lget = require('lodash.get');

const relateVendor = async context => {
  let config = {
    herePath: 'vendor',
    therePath: 'productLineups',
    thereService: 'crayv-vendors'
  };
  await relateOtm(context, config);
};

const unrelateVendor = async context => {
  let config = {
    herePath: 'vendor',
    therePath: 'productLineups',
    thereService: 'crayv-vendors'
  };
  await removeOtm(context, config);
};

const relateProducts = async context => {
  let config = {
    herePath: 'products',
    therePath: 'productLineups',
    thereService: 'crayv-products',
  };
  if(context.method === 'remove') await removeMtm(context, config);
  else await relateMtm(context, config);
};

const relateProductGroups = async context => {
  let config = {
    herePath: 'products',
    therePath: 'productLineups',
    thereService: 'crayv-products',
  };
  if(context.method === 'remove') await removeMtm(context, config);
  else await relateMtm(context, config);
};


const populates = {
  products: {
    service: 'crayv-products',
    nameAs: 'productList',
    keyHere: 'crayv-products',
    keyThere: '_id',
    asArray: true,
    params: {}
  }
};

const namedQueries = {
  withProducts: {
    products: {}
  }
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [relateProductGroups, relateProducts],
    patch: [relateProductGroups, relateProducts],
    remove: []
  },

  after: {
    all: [populate({populates, namedQueries})],
    find: [],
    get: [],
    create: [relateVendor, relateProductGroups, relateProducts],
    update: [relateVendor, relateProductGroups, relateProducts],
    patch: [relateVendor, relateProductGroups, relateProducts],
    remove: [unrelateVendor, relateProductGroups, relateProducts]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [relateProductGroups, relateProducts],
    patch: [relateProductGroups, relateProducts],
    remove: []
  }
};
