

module.exports = {
  before: {
    all: [],
    find: [
      // context => {
      //   console.log('before', context.params);
      // }
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      // context => {
      //   console.log('after', context.result);
      // }
    ],
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
};
