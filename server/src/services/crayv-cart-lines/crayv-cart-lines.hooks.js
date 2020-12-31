const { authenticate } = require('@feathersjs/authentication').hooks;


const { populate } = require('feathers-graph-populate');
const lget = require('lodash.get');
const lset = require('lodash.set');

const populates = {
  fullProduct: {
    service: 'crayv-products',
    nameAs: 'fullProduct',
    keyHere: 'product.product',
    keyThere: '_id',
    asArray: false,
    params: {}
  }
};

const namedQueries = {
  withProduct: {
    fullProduct: {

    }
  }
};

const findPrice = async (line, app) => {
  const full = lget(line, 'fullProduct', null);
  let product = full ? full : await app.service('crayv-products').get(line.product);
  return await app.service('crayv-product-price').create(product, {
    query: {
      quantity: lget(line, 'product.quantity', 1)
    }
  }).then(res => {
    // console.log('got line price', res);
    return res;
  }).catch(err => {
    console.log('error getting line price', err);
    return null;
  });
};

const attachPriceGet = async context => {
  let line = context.result;
  await findPrice(line, context.app)
    .then(price => {
      // console.log('attaching price get', price);
      lset(context.result, 'price', lget(price, ['list', 0], {total: 0}));
    });
};

const attachPriceFind = async context => {
  const attachLoop = async (list) => {
    for(let i = 0; i < list.length; i++){
      let line = list[i];
      let price = await findPrice(line, context.app);
      // console.log('attaching price find loop', price);
      lset(context.result, [i, 'price'], lget(price, ['list', 0], {total: 0}));
    }
  };
  await attachLoop(lget(context, 'result', []));
  // console.log('done setting', context.result);
};


// TODO: add a hook to overwrite the price every new session so they can be used to create orders

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
    all: [
      populate({ populates, namedQueries }),
    ],
    find: [attachPriceFind],
    get: [attachPriceGet],
    create: [attachPriceGet],
    update: [attachPriceGet],
    patch: [attachPriceGet],
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
