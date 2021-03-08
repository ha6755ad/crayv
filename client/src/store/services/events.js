import feathersClient, { makeServicePlugin, BaseModel } from '../../api/feathers-client';
// const common = require('../schemas/common');

class Events extends BaseModel {
  // eslint-disable-next-line no-useless-constructor
  constructor (data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Events';

  // Define default properties here
  static instanceDefaults () {
    return {
      name: '',
      description: '',
      images: [],
      coverPhoto: null,
      online: {
        isOnline: false,
        location: '',
        instructions: ''
      },
      color: {
        hexa: '#14d0ff'
      },
      location: undefined,
      address: undefined,
      start: null,
      end: null,
      parent: undefined,
      children: [],
      recurrence: undefined,
      attendees: {},
      settings: {}
    };
  }
}

const servicePath = 'events';
const servicePlugin = makeServicePlugin({
  Model: Events,
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
    patch: [
      context => {
      console.log('saving event >> before', context.data);
    }],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [
      context => {
        console.log('saving event >> after', context.result);
      }
    ],
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
