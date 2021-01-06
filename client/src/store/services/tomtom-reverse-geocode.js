import feathersClient, {makeServicePlugin, BaseModel} from '../../api/feathers-client';

class TomtomReverseGeocode extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'TomtomReverseGeocode';

  // Define default properties here
  static instanceDefaults() {
    return {
      position: ''
    };
  }
}

const servicePath = 'tomtom-reverse-geocode';
const servicePlugin = makeServicePlugin({
  Model: TomtomReverseGeocode,
  service: feathersClient.service(servicePath),
  servicePath,
  idField: 'id',
});


// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [
    ],
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
    all: [
      context => {
        console.log('tomtom-error', context);
      }
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
});

export default servicePlugin;
