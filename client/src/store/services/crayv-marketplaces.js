import feathersClient, { makeServicePlugin, BaseModel } from '../../api/feathers-client';

// const common = require('../schemas/common');

class CrayvMarketplaces extends BaseModel {
  // eslint-disable-next-line no-useless-constructor
  constructor (data, options) {
    super(data, options);
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'CrayvMarketplaces';
  // Define default properties here
  static instanceDefaults () {
    return {
      name: '',
      description: '',
      avatar: null,
      image: null,
      vendorSettings: [],
      recommendProducts: [],
      settings: {
        stripe_account: null,
        approvals: 'admin'
      },
      pricing: {
        flatFee: 0,
        flatFeeRecurrence: null,
        percentageFee: 0,
        feeType: 'option'
      }
    };
  }
}

const servicePath = 'crayv-marketplaces';
const servicePlugin = makeServicePlugin({
  Model: CrayvMarketplaces,
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
