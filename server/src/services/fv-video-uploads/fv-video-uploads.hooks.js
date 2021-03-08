const {authenticate} = require('@feathersjs/authentication').hooks;
const { populate } = require('feathers-graph-populate');

const {fastJoin} = require('feathers-hooks-common');
const lset = require('lodash.set');
const lget = require('lodash.get');

const creatorResolvers = {
  joins: {
    // eslint-disable-next-line no-unused-vars
    video: $select => async (video, context) => {
      let userObject =
        await context.app.service('users').find({
          query: {
            _id: {$in: video.creator},
          },
        }).data;
      lset(video,'_fastjoin.creator', { _id: lget(userObject, [0, '_id']), name: lget(userObject, [0, 'name'], lget(userObject, [0, 'username'], lget(video, [0, 'author']))), avatar: lget(userObject, [0, 'avatar']) });
    }
  }
};

const populates = {

};
const namedQueries = {

};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate('jwt')],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [populate({populates, namedQueries}), fastJoin(creatorResolvers)],
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
};
