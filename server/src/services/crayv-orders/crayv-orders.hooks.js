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

const relateGroupOrder = async () => {
  let config = {
    herePath: 'group_order',
    therePath: 'orders',
    thereService: 'crayv-group-orders'
  };
  await relateOtm()(config);
};

const removeGroupOrder = async () => {
  let config = {
    herePath: 'group_order',
    therePath: 'orders',
    thereService: 'crayv-group-orders'
  };
  await removeOtm()(config);
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

// const checkAndCreatePledge = async context => {
//   if (lget(context, 'result.status') === 'complete') {
//     let productIds = lget(context, 'result.products', []).map(a => a.product);
//     let pledges = await context.app.service('bw-requirements').find({
//       query: {
//         productId: { $in: productIds }
//       }
//     }).data;
//     for (let i = 0; i < pledges.length; i++) {
//       let pledge = pledges[i];
//       if (!pledge.active) {
//         await context.app.service('bw-pledges').patch(pledge._id, {
//           active: true,
//           order: lget(context, 'result._id')
//         });
//       }
//     }
//   }
// };


module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [populate({ populates, namedQueries })],
    find: [],
    get: [],
    create: [inactivateCart, relateGroupOrder],
    update: [relateGroupOrder],
    patch: [relateGroupOrder],
    remove: [removeGroupOrder]
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
