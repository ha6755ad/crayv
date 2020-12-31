import feathersClient, { makeServicePlugin, BaseModel } from '../../api/feathers-client';
// const common = require('../schemas/common')

class CrayvPromotions extends BaseModel {
  // eslint-disable-next-line no-useless-constructor
  constructor (data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'CrayvPromotions';

  // Define default properties here
  static instanceDefaults () {
    return {
      active: true,
      deleted: false,
      channels: [],
      appName: null,
      appId: null,
      groups: [],
      vendor: null,
      type: null,
      products: [],
      excludeProducts: [],
      allProducts: false,
      usage: {
        checkIns: [],
      },
      settings: {
        promoCode: null,
        available: new Date(),
        limitations: '',
        expires: null,
        limit: 0
      },
      images: [],
      name: '',
      description: '',
      value: {}
    };
  }
}

const servicePath = 'crayv-promotions';
const servicePlugin = makeServicePlugin({
  Model: CrayvPromotions,
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
