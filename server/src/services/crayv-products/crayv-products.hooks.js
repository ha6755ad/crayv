const { authenticate } = require('@feathersjs/authentication');
const { populate } = require('feathers-graph-populate');
const lget = require('lodash.get');
const lset = require('lodash.set');
const { relateOtm, removeOtm } = require('../../hooks/relate');
const {fastJoin} = require('feathers-hooks-common');

const vendorResolvers = {
  joins: {
    // eslint-disable-next-line no-unused-vars
    products: $select => async (product, context) => {
      if(product.vendorId) {
        const vendor = await context.app.service('crayv-vendors').get(product.vendorId);
        if(vendor) {
          lset(product, '_fastjoin.vendor', vendor);
        } else lset(product, '_fastjoin.vendor', null);
      }
    }
  }
};

const promoResolvers = {
  joins: {
    // eslint-disable-next-line no-unused-vars
    products: $select => async (product, context) => {
      if(product.promotions) {
        const promos = await context.app.service('crayv-promotions').find({
          query: { _id: { $in: product.promotions }}
        });
        lset(product, '_fastjoin.promos', promos);
      }
    }
  }
};


const populates = {

};
const namedQueries = {

};

const findPrice = async (product, app) => {
  return await app.service('crayv-product-price').create(product, {
    query: {
      quantity: 1
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
  let product = context.result;
  await findPrice(product, context.app)
    .then(price => {
      // console.log('attaching price get', price);
      lset(context.result, 'priceObj', lget(price, ['list', 0], {total: 0}));
    });
};

const attachPriceFind = async context => {
  const products = lget(context, 'result.data', []);
  await products.reduce(async (promise, product) => {
    // This line will wait for the last async function to finish.
    // The first iteration uses an already resolved Promise
    // so, it will immediately continue.
    await promise;
    const priceObj = await findPrice(product, context.app);
    lset(product, 'priceObj', lget(priceObj, ['list', 0], { total: lget(product, 'price.basePrice', 0) }));
    // console.log('ot price', priceObj, product);
  }, Promise.resolve());
  return context;
};

const relateVendor = async context => {
  let config = {
    herePath: 'vendorId',
    therePath: 'products',
    thereService: 'crayv-vendors'
  };
  if(context.method === 'remove') await removeOtm(context, config);
  else await relateOtm(context, config);
};

// const noDuplicatePromos = context => {
//   let promos = lget(context, 'data.promotions', []);
//   let unique = Array.from(new Set(promos));
//   context.data.promotions = unique;
// }

module.exports = {
  before: {
    all: [
      // noDuplicatePromos
    ],
    find: [],
    get: [],
    create: [authenticate('jwt')],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [
      fastJoin(vendorResolvers),
      fastJoin(promoResolvers),
      populate({ populates, namedQueries }),
    ],
    find: [attachPriceFind],
    get: [attachPriceGet],
    create: [attachPriceGet, relateVendor],
    update: [attachPriceGet, relateVendor],
    patch: [attachPriceGet, relateVendor],
    remove: [relateVendor]
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
