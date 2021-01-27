const { populate } = require('feathers-graph-populate');
const { relateOtm,  removeOtm, relateMtm, removeMtm } = require('../../hooks/relate');
// const lget = require('lodash.get');

const relateVendorSettings = async context => {
  let config = {
    herePath: 'vendorSettings',
    therePath: 'productLineups',
    thereService: 'crayv-vendor-settings'
  };
  if(context.method === 'remove') return await removeMtm(config)(context);
  else return await relateMtm(config)(context);
};


const relateProducts = async context => {
  let config = {
    herePath: 'products',
    therePath: 'productLineups',
    thereService: 'crayv-products',
  };
  if(context.method === 'remove') return await removeMtm(config)(context);
  else return await relateMtm(config)(context);
};

const relateProductGroups = async context => {
  let config = {
    herePath: 'products',
    therePath: 'productLineups',
    thereService: 'crayv-products',
  };
  if(context.method === 'remove') return await removeMtm(config)(context);
  else return await relateMtm(config)(context);
};

const relateVendor = async context => {
  let config = {
    herePath: 'vendorId',
    therePath: 'productLineups',
    thereService: 'crayv-vendors'
  };
  if(context.method === 'remove') return await removeOtm(config)(context);
  else return await relateOtm(config)(context);
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
    create: [relateVendor, relateVendorSettings, relateProductGroups, relateProducts],
    update: [relateVendor, relateVendorSettings, relateProductGroups, relateProducts],
    patch: [relateVendor, relateVendorSettings, relateProductGroups, relateProducts],
    remove: [relateVendor, relateVendorSettings, relateProductGroups, relateProducts]
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
