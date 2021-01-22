import feathersClient, {makeServicePlugin, BaseModel} from '../../api/feathers-client';
// import moment from 'moment';
// const common = require('../schemas/common');


class CrayvProductGroups extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'CrayvProductGroups';

  // Define default properties here
  static instanceDefaults() {
    return {
      name: '',
      description: '',
      deleted: false,
      active: true,
      events: [],
      images: [],
      vendorId: null,
      inventory: {},
      groupOrders: false,
      products: [],
      parent: null,
      children: [],
      settings: {},
      subscriptions: [],
      type: 'a-la-carte',
      price: {
        basePrice: 0,
        currency: 'usd'
      }
    };
  }
}

const servicePath = 'crayv-product-groups';
const servicePlugin = makeServicePlugin({
  Model: CrayvProductGroups,
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
