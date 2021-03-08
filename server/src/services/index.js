const crayvProducts = require('./crayv-products/crayv-products.service');
const crayvOrders = require('./crayv-orders/crayv-orders.service');
const crayvProductGroups = require('./crayv-product-groups/crayv-product-groups.service');
const crayvProductPrice = require('./crayv-product-price/crayv-product-price.service');
const crayvProductLineups = require('./crayv-product-lineups/crayv-product-lineups.service');
const crayvVendors = require('./crayv-vendors/crayv-vendors.service');
const crayvCarts = require('./crayv-carts/crayv-carts.service');
const crayvCartLines = require('./crayv-cart-lines/crayv-cart-lines.service');
const crayvPromotions = require('./crayv-promotions/crayv-promotions.service');
const crayvMarketplaces = require('./crayv-marketplaces/crayv-marketplaces.service.js');
const crayvVendorSettings = require('./crayv-vendor-settings/crayv-vendor-settings.service.js');
const currencyExchange = require('./currency-exchange/currency-exchange.service');
const fileUploader = require('./file-uploader/file-uploader.service');
const uploads = require('./uploads/uploads.service');
const crayvSalesTax = require('./crayv-sales-tax/crayv-sales-tax.service');
const tomtomGeocode = require('./tomtom-geocode/tomtom-geocode.service');
const tomtomReverseGeocode = require('./tomtom-reverse-geocode/tomtom-reverse-geocode.service.js');

const users = require('./users/users.service.js');
const mapboxBoundaries = require('./mapbox-boundaries/mapbox-boundaries.service.js');

const iyQueue = require('./iy-queue/iy-queue.service.js');

const iyCronTasks = require('./iy-cron-tasks/iy-cron-tasks.service.js');
const iyQueueLogs = require('./iy-queue-logs/iy-queue-logs.service.js');

const crayvClassifieds = require('./crayv-classifieds/crayv-classifieds.service.js');

const crayvOffers = require('./crayv-offers/crayv-offers.service.js');
const irComments = require('./ir-comments/ir-comments.service');
const fvVideoUploads = require('./fv-video-uploads/fv-video-uploads.service');
const fvYoutube = require('./fv-youtube/fv-youtube.service');

const boundaryFilter = require('./boundary-filter/boundary-filter.service.js');

const iyEvents = require('./iy-events/iy-events.service.js');

const crayvCrowdBuys = require('./crayv-crowd-buys/crayv-crowd-buys.service.js');

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(crayvProducts);
  app.configure(crayvOrders);
  app.configure(crayvProductLineups);
  app.configure(crayvProductGroups);
  app.configure(crayvProductPrice);
  app.configure(crayvVendors);
  app.configure(crayvCarts);
  app.configure(crayvCartLines);
  app.configure(crayvPromotions);
  app.configure(crayvMarketplaces);
  app.configure(crayvVendorSettings);
  app.configure(currencyExchange);
  app.configure(fileUploader);
  app.configure(uploads);
  app.configure(crayvSalesTax);
  app.configure(tomtomGeocode);
  app.configure(tomtomReverseGeocode);
  app.configure(users);
  app.configure(mapboxBoundaries);
  app.configure(iyQueue);
  app.configure(iyCronTasks);
  app.configure(iyQueueLogs);
  app.configure(crayvClassifieds);
  app.configure(crayvOffers);
  app.configure(fvVideoUploads);
  app.configure(fvYoutube);
  app.configure(irComments);
  app.configure(boundaryFilter);
  app.configure(iyEvents);
  app.configure(crayvCrowdBuys);
};
