// Initializes the `crayv-product-price` service on path `/crayv-product-price`
const { CrayvProductPrice } = require('./crayv-product-price.class');
const hooks = require('./crayv-product-price.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/crayv-product-price', new CrayvProductPrice(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('crayv-product-price');

  service.hooks(hooks);
};
