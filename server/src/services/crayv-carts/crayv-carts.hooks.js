const { authenticate } = require('@feathersjs/authentication').hooks;

const { populate } = require('feathers-graph-populate');
const lget = require('lodash.get');
const lset = require('lodash.set');

const populates = {
  cartlines: {
    service: 'crayv-cart-lines',
    nameAs: 'cartlines',
    keyHere: '_id',
    keyThere: 'cart',
    asArray: true,
    params: {}
  }
};
const namedQueries = {
  withLines: {
    cartlines: {
      fullProduct: {
      }
    }
  }
};

const getTaxTotal = (subTotal, tax) => {
  let total = 0;
  const getTypeAmt = (prop) => {
    if(prop) {
      let percentage = lget(prop, 'percentage', 0);
      if (percentage) return subTotal * percentage;
      else return lget(prop, 'flat', 0);
    } else return 0;
  };
  Object.keys(tax).forEach(key => {
    total += getTypeAmt(tax[key]);
  });
  return total;
};

const cartTotal = cart => {
  if(cart.active) {
    let subTotal = 0;
    let taxTotal = 0;
    let lines = lget(cart, 'cartlines', []);
    for (let i = 0; i < lines.length; i++) {
      let sub = lget(lines, [i, 'price', 'total'], 0);
      let tax = lget(lines, [i, 'price', 'tax'], {});
      // console.log(`adding ${sub} to total ${subTotal}`);
      subTotal += sub;
      taxTotal += getTaxTotal(sub, tax);
    }
    lset(cart, 'subTotal', subTotal);
    lset(cart, 'taxtotal', taxTotal);
  }
  return cart;
};

const totalCart = async context => {
  context.result = cartTotal(context.result);
};

const limitOneCart = async context => {
  let query;
  let currency = lget(context, 'data.currency', 'usd');
  console.log('currency limit', currency);
  if (context.data.person) {
    query = {
      person: context.data.person,
      active: true,
      currency: currency
    };
  } else if (context.data.group) {
    query = {
      group: context.data.group,
      active: true,
      currency: currency
    };
  }
  console.log('got query', query);
  await context.app.service('crayv-carts').find({
    query: query
  }).then(carts => {
    // console.log('found carts', carts);
    if (carts.length > 0) {
      let linesCombined = [];
      carts.forEach((cart, i) => {
        i > 0 ? linesCombined.concat(cart.lines) : linesCombined = cart.lines;
        context.app.service('crayv-carts').patch(cart._id, { active: false }, {})
          .catch(err => console.error('error updating cart to inactive', err));
      });
      lset(context, 'data.lines', linesCombined);
    }
  });
};



module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [limitOneCart],
    update: [limitOneCart],
    patch: [limitOneCart],
    remove: []
  },

  after: {
    all: [populate({ populates, namedQueries }),],
    find: [
      async context => {
        context.result.data.forEach((cart, i) => {
          context.result.data[i] = cartTotal(cart);
        });
      }
    ],
    get: [totalCart],
    create: [totalCart],
    update: [totalCart],
    patch: [totalCart],
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
