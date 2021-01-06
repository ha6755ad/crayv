const { populate } = require('feathers-graph-populate');
const { relateOtm,  removeOtm, relateMtm, removeMtm } = require('../../hooks/relate');
// const lget = require('lodash.get');

const relateVendorSettings = async context => {
  let config = {
    herePath: 'vendorSettings',
    therePath: 'productLineups',
    thereService: 'crayv-vendor-settings'
  };
  if(context.method === 'remove') await removeMtm()(config);
  else await relateMtm()(config);
};


const relateProducts = async context => {
  let config = {
    herePath: 'products',
    therePath: 'productLineups',
    thereService: 'crayv-products',
  };
  if(context.method === 'remove') await removeMtm()(config);
  else await relateMtm()(config);
};

const relateProductGroups = async context => {
  let config = {
    herePath: 'products',
    therePath: 'productLineups',
    thereService: 'crayv-products',
  };
  if(context.method === 'remove') await removeMtm()(config);
  else await relateMtm()(config);
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
    update: [relateProductGroups, relateProducts, relateVendorSettings],
    patch: [relateProductGroups, relateProducts, relateVendorSettings],
    remove: []
  },

  after: {
    all: [populate({populates, namedQueries})],
    find: [],
    get: [],
    create: [relateVendorSettings, relateProductGroups, relateProducts],
    update: [relateVendorSettings, relateProductGroups, relateProducts],
    patch: [relateVendorSettings, relateProductGroups, relateProducts],
    remove: [relateVendorSettings, relateProductGroups, relateProducts]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [relateProductGroups, relateProducts, relateVendorSettings],
    patch: [relateProductGroups, relateProducts, relateVendorSettings],
    remove: []
  }
};
