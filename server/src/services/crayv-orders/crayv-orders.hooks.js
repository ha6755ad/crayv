const { authenticate } = require('@feathersjs/authentication').hooks;

const lget = require('lodash.get');

const { populate } = require('feathers-graph-populate');

const { relateOtm, removeOtm } = require('../../hooks/relate');
// const lget = require('lodash.get');

const populates = {
  soldBy: {
    service: 'lc-scorecard',
    nameAs: 'fullSoldBy',
    keyHere: 'soldBy',
    keyThere: '_id',
    asArray: false,
    params: {}
  },
  person: {
    service: 'users',
    nameAs: 'fullPerson',
    keyHere: 'person',
    keyThere: '_id',
    asArray: false,
    params: {}
  }
};

const namedQueries = {
  withSoldBy: {
    soldBy: {
      user: {}
    }
  },
  withPerson: {
    person: {}
  }
};

const relateGroupOrder = async context => {
  let orders = 0;

  lget(context, 'result.products', []).forEach(product => {
    if(product.quantity) orders += product.quantity;
  })

  let thereObj = {
    id: context.result._id,
    price: context.result.subtotal,
    quantity: orders
  };
  let config = {
    herePath: 'group_order',
    therePath: 'orders',
    thereService: 'crayv-crowd-buys',
    thereObj: thereObj,
    thereObjId: 'id'
  };
  if(context.method === 'remove') return await removeOtm(config)(context);
  return await relateOtm(config)(context);
};


const inactivateCart = async context => {
  let cart = lget(context, 'result.cart', null);
  if (cart) {
    await context.app.service('crayv-carts').get(cart._id)
      .then(res => {
        if (res.active) {
          context.app.service('crayv-carts').patch(cart._id, { active: false });
        }
      });
  }
};

const { incInventory } = require('./hooks/product-inventory');



module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [incInventory()],
    update: [incInventory()],
    patch: [incInventory()],
    remove: []
  },

  after: {
    all: [populate({ populates, namedQueries })],
    find: [],
    get: [],
    create: [inactivateCart, relateGroupOrder],
    update: [relateGroupOrder],
    patch: [relateGroupOrder],
    remove: [relateGroupOrder]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [incInventory({undo: true})],
    update: [incInventory({undo: true})],
    patch: [incInventory({undo: true})],
    remove: []
  }
};
