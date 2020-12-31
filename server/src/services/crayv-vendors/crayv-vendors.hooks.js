const { authenticate } = require('@feathersjs/authentication');
const lget = require('lodash.get');
const lset = require('lodash.set');
const { relateOtm, removeOtm } = require('../../hooks/relate');

const assignOwner = context => {
  let owner = lget(context, 'owner');
  let ownerModel = lget(context, 'ownerModel');
  if(!(owner && ownerModel)){
    context.data.owner = context.params.user._id;
    context.data.ownerModel = 'users';
  }
};

const relateOwner = async context => {
  let thereService = lget(context, 'result.ownerModel')
  let config = {
    herePath: 'owner',
    therePath: 'vendors',
    thereService: thereService
  };
  if(context.method === 'remove') await removeOtm(context, config);
  else await relateOtm(context, config);
};

const setupAdmin = context => {
  let superadmin = lget(context, 'data.roles.superadmin[0]');
  if(!superadmin){
    lset(context, 'data.roles.superadmin', [context.id]);
  }
};


module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate('jwt'), assignOwner, setupAdmin],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [relateOwner],
    update: [relateOwner],
    patch: [relateOwner],
    remove: [relateOwner]
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
