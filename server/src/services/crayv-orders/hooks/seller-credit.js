const {checkContext} = require('feathers-hooks-common');
const {GeneralError} = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    checkContext(context, 'after', ['create']);

    context.app.service('lc-scorecard')
      .Model.aggregate([
        {
          $graphLookup: {
            from: 'orders',
            startWith: '$person',
            connectFromField: 'person',
            connectToField: 'user',
            as: 'orders'
          }
        }
      ])
      .then(res => {
        if (context.method === 'create') {
          context.app.service('lc-scorecard')
            .patch(null,
              { $inc: { sold: 1 } },
              {
                query: {
                  _id: { $in: res[0].orders.map(a => a.referredBy) }
                }
              });
        }
      }).catch(e => {
        return new GeneralError(e.message);
      });
  };
};
