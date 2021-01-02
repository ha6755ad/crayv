import feathersClient, { makeServicePlugin, BaseModel } from '../../api/feathers-client';
const common = require('../schemas/common');

class CrayvProducts extends BaseModel {
  // eslint-disable-next-line no-useless-constructor
  constructor (data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'CrayvProducts';

  // Define default properties here
  static instanceDefaults () {
    return {
      name: '',
      description: '',
      deleted: false,
      active: true,
      type: null,
      images: [],
      variants: [],
      promotions: [],
      options: [],
      settings: common.ProductSettings,
      shipping: {},
      events: [],
      vendorId: null,
      tags: [],
      subscriptions: [],
      price: {
        basePrice: null,
        currency: 'usd'
      },
      bom: {},
    };
  }
}

const servicePath = 'crayv-products';
const servicePlugin = makeServicePlugin({
  Model: CrayvProducts,
  service: feathersClient.service(servicePath),
  servicePath
});

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
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
});

export default servicePlugin;
