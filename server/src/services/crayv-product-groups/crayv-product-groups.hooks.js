const { authenticate } = require('@feathersjs/authentication');
// const lget = require('lodash.get');
// const lset = require('lodash.set');
const { relateOtm, removeOtm, relateMtm, removeMtm } = require('../../hooks/relate');

const relateVendor = async context => {
  let config = {
    herePath: 'vendorId',
    therePath: 'crayv-products',
    thereService: 'crayv-vendors'
  };
  if(context.method === 'remove') await removeOtm(context, config);
  else await relateOtm(context, config);
};

const relateProducts = async context => {
  let config = {
    herePath: 'products',
    therePath: 'productGroups',
    thereService: 'crayv-products',
    hereMapId: 'id',
  };
  if(context.method === 'remove') await removeMtm(context, config);
  else await relateMtm(context, config);
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate('jwt')],
    update: [authenticate('jwt'), relateProducts],
    patch: [authenticate('jwt'), relateProducts],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [relateVendor, relateProducts],
    update: [relateVendor, relateProducts],
    patch: [relateVendor, relateProducts],
    remove: [relateVendor, relateProducts]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [relateProducts],
    update: [relateProducts],
    patch: [],
    remove: []
  }
};
