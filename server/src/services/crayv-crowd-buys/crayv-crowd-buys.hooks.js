const { authenticate } = require('@feathersjs/authentication');
const {fastJoin} = require('feathers-hooks-common');
const lset = require('lodash.set');
const lget = require('lodash.get');

const totalOrders = async context => {
  if(context.data.orders){
    let orders = await context.app.service('crayv-orders').find({
      query: {
        _id: { $in: lget(context, 'result.orders', [])},
        status: 'complete'
      }
    });
  }
};

const sellingResolvers = {
  joins: {
    // eslint-disable-next-line no-unused-vars
    buy: $select => async (buy, context) => {
      let model = buy.sellingModel;
      if(model) {
        let selling =
          await context.app.service(model).find({
            query: { _id: { $in: buy.selling } } });
        lset(buy, '_fastjoin.selling', lget(selling, 'data'));
      }
    }
  }
};

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
    all: [fastJoin(sellingResolvers)],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
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
