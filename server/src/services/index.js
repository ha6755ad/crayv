const CrayvProducts = require('./crayv-products/crayv-products.service');
const CrayvOrders = require('./crayv-orders/crayv-orders.service');
const CrayvProductGroups = require('./crayv-product-groups/crayv-product-groups.service');
const CrayvProductPrice = require('./crayv-product-price/crayv-product-price.service');
const CrayvProductLineups = require('./crayv-product-lineups/crayv-product-lineups.service');
const CrayvVendors = require('./crayv-vendors/crayv-vendors.service');
const CrayvCarts = require('./crayv-carts/crayv-carts.service');
const CrayvCartLines = require('./crayv-cart-lines/crayv-cart-lines.service');
const CrayvPromotions = require('./crayv-promotions/crayv-promotions.service');
const CrayvMarketplaces = require('./crayv-marketplaces/crayv-marketplaces.service.js');
const CrayvVendorSettings = require('./crayv-vendor-settings/crayv-vendor-settings.service.js');
const fileUploader = require('./file-uploader/file-uploader.service');
const uploads = require('./uploads/uploads.service');

const users = require('./users/users.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(CrayvProducts);
  app.configure(CrayvOrders);
  app.configure(CrayvProductLineups);
  app.configure(CrayvProductGroups);
  app.configure(CrayvProductPrice);
  app.configure(CrayvVendors);
  app.configure(CrayvCarts);
  app.configure(CrayvCartLines);
  app.configure(CrayvPromotions);
  app.configure(CrayvMarketplaces);
  app.configure(CrayvVendorSettings);
  app.configure(fileUploader);
  app.configure(uploads);
  app.configure(users);
};
