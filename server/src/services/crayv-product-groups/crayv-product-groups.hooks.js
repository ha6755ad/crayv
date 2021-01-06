const { authenticate } = require('@feathersjs/authentication');
const lget = require('lodash.get');
const lset = require('lodash.set');
const { relateOtm, removeOtm, relateMtm, removeMtm } = require('../../hooks/relate');
const { populate } = require('feathers-graph-populate');


const populates = {

};

const namedQueries = {

};

const {fastJoin} = require('feathers-hooks-common');

const vendorResolvers = {
  joins: {
    // eslint-disable-next-line no-unused-vars
    productGroups: $select => async (pg, context) => {
      if(pg.vendorId) {
        const vendor = await context.app.service('crayv-vendors').get(pg.vendorId, { query: { $select: ['_id', 'name', 'description', 'avatar', 'img', 'productLineups', 'roles', 'owner', 'ownerModel']}});
        if(vendor) {
          lset(pg, '_fastjoin.vendor', vendor);
        } else lset(pg, '_fastjoin.vendor', null);
      }
    }
  }
};

const promoResolvers = {
  joins: {
    // eslint-disable-next-line no-unused-vars
    productGroups: $select => async (pg, context) => {
      if(pg.promotions) {
        const promos = await context.app.service('crayv-promotions').find({
          query: { _id: { $in: pg.promotions }}
        });
        lset(pg, '_fastjoin.promos', promos);
      }
    }
  }
};

const productResolvers = {
  joins: {
    // eslint-disable-next-line no-unused-vars
    productGroups: $select => async (pg, context) => {
      if(pg.products) {
        const products = await context.app.service('crayv-products').find({
          query: { _id: { $in: pg.products.map(a => a.id) }, $select: ['_id', 'images', 'price', 'name', 'description', 'promotions']}
        });
        lset(pg, '_fastjoin.products', lget(products, 'data', []).map((a, i) => Object.assign({}, a, pg.products[i])));
      }
    }
  }
};

const findPrice = async (product = {}) => {
  return async context => {
    return await context.app.service('crayv-product-price').create(product, {
      query: {
        quantity: 1
      }
    }).then(res => {
      console.log('got line price', res);
      return res;
    }).catch(err => {
      console.log('error getting line price', err);
      return null;
    });
  };
};

const attachPriceGet = async context => {
  let product = context.result;
  if(product.type !== 'a-la-carte') {
    await findPrice(product)
      .then(price => {
        // console.log('attaching price get', price);
        lset(context.result, 'priceObj', lget(price, ['list', 0], { total: 0 }));
      });
  } else context.result.priceObj = { total: 0 };
};

const attachPriceFind = async context => {
  const products = lget(context, 'result.data', []);
  await products.reduce(async (promise, product) => {
    // This line will wait for the last async function to finish.
    // The first iteration uses an already resolved Promise
    // so, it will immediately continue.
    await promise;
    const priceObj = product.type !== 'a-la-carte' ? await findPrice(product) : { total: 0 };
    lset(product, 'priceObj', lget(priceObj, ['list', 0], { total: lget(product, 'price.basePrice', 0) }));
    // console.log('ot price', priceObj, product);
  }, Promise.resolve());
  return context;
};


const relateVendor = async context => {
  let config = {
    herePath: 'vendorId',
    therePath: 'productGroups',
    thereService: 'crayv-vendors'
  };
  if(context.method === 'remove') await removeOtm()(config);
  else await relateOtm()(config);
};

const relateProducts = async context => {
  let config = {
    herePath: 'products',
    therePath: 'productGroups',
    thereService: 'crayv-products',
    hereMapId: 'id',
  };
  if(context.method === 'remove') await removeMtm()(config);
  else await relateMtm()(config);
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
    all: [
      fastJoin(vendorResolvers),
      fastJoin(promoResolvers),
      fastJoin(productResolvers),
      populate({populates, namedQueries})
    ],
    find: [attachPriceFind],
    get: [attachPriceGet],
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
