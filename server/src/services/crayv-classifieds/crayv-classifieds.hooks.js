module.exports = {
  before: {
    all: [],
    find: [
      context => {
        console.log('classifieds before', context.params.query);
      }
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
      context => {
        console.log('classifieds after', context.result);
      }
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [
      context => {
        console.log('classifieds error', context);
      }
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
