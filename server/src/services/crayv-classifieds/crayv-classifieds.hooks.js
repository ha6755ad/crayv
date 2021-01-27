module.exports = {
  before: {
    all: [],
    find: [
      context => {
        console.log('before limit', context.params.query);
        if (context.params.query.$limit === 9) {
          console.log('fiind context before', context.params, context.result);
        }
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
        console.log('after limit', context.params.query, context.result);
        if (context.params.query.$limit === 9) {
          console.log('fiind context after', context.params, context.result);
        }
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
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
