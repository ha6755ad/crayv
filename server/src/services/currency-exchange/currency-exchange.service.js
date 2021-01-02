// Initializes the `currency-exchange` service on path `/currency-exchange`
const { CurrencyExchange } = require('./currency-exchange.class');
const hooks = require('./currency-exchange.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/currency-exchange', new CurrencyExchange(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('currency-exchange');

  service.hooks(hooks);
};
