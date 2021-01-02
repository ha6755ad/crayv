import Vue from 'vue';

const lget = require('lodash.get');
const { date } = require('quasar');
const { isBetweenDates } = date;

const flattenArray = (arr) => {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten);
  }, []);
};

const getProductList = (cart) => {
  return flattenArray(lget(cart, 'cartlines', [])).map(c => c.product);
};

export default async () => {
  // Need to calculate promo prices for base product and optionList before passing in - also need to send in optionList with product names -- also need a static copy of the vendor name in case of vendor accounts leaving the system

  Vue.prototype.$flattenArray = (arr) =>  {
    return flattenArray(arr);
  };

  Vue.prototype.$getCartSubTotal = (cart) => {
    let total = 0;
    getProductList(cart).forEach(product => {
      // console.log('subtotal loop', product);
      total += lget(product, 'price.pricePaid', 0) * parseInt(lget(product, 'quantity', 1));
    });
    return total;
  };

  Vue.prototype.$getCartTotal = (cart) => {
    //TODO: add tax calc
    let total = 0;
    getProductList(cart).forEach(product => {
      // console.log('subtotal loop', product);
      total += lget(product, 'price.pricePaid', 0) * parseInt(lget(product, 'quantity', 1));
    });
    return total;
  };

  // Options includes pricing, vendor, optionList
  Vue.prototype.$createProductOrder = (product, quantity, options) => {
    let variants = [];
    lget(product, 'variants', []).forEach(v => {
      variants.push({
        type: lget(v, 'type'),
        product: lget(v, 'product'),
        settings: lget(v, 'settings'),
        name: lget(v, 'name'),
        description: lget(v, 'description')
      });
    });
    return {
      product: lget(product, '_id'),
      productModel: product.products ? 'crayv-product-groups' : 'crayv-products',
      quantity: quantity,
      name: lget(product, 'name'),
      description: lget(product, 'description'),
      price: lget(options, 'pricing', {basePrice: lget(product, 'price.basePrice'), pricePaid: lget(product, 'price.basePrice'), currency: lget(product, 'price.currency')}),
      settings: lget(product, 'settings'),
      shipping: lget(product, 'shipping'),
      images: lget(product, 'images[0]'),
      variants: variants,
      options: lget(options, 'optionList', []),
      subscription: { id: lget(product, 'subscription') },
      vendor: lget(options, 'vendor', { id: product.vendor })
    };
  };

  Vue.prototype.$getProductCurrencyIcon = (currency) => {
    return `mdi-currency-${currency}`;
  };

  Vue.prototype.$getCurrencySymbol = (product, override) => {
    let symbol = '';
    let currency = override ? override : lget(product, 'price.currency');
    if(currency === 'usd') symbol =  '$';
    else if(currency === 'ngn') symbol = 'N';
    return symbol;
  };

  // Pass in full objects for promotion and producct
  Vue.prototype.$getPromotionValue = (promotion, product, quantity) => {
    let start = lget(promotion, 'settings.available');
    let end = lget(promotion, 'expires', new Date(2100, 1, 1));
    let dateValid;
    if (start && end && isBetweenDates(new Date(), start, end)) dateValid = true;
    let prodValid = (lget(promotion, 'products.ids', []).includes(product._id) || lget(promotion, 'products.all'));
    let minQuantity = lget(promotion, 'value.minPurchaseQuantity', 0);
    let minAmount = lget(promotion, 'value.minPurchaseAmount', 0);
    let price = lget(product, 'price.basePrice', 0);
    let quantTest = quantity >= minQuantity;
    let amtTest = (price * quantity >= minAmount);
    if (dateValid && prodValid && quantTest && amtTest) {
      let maxAmount = lget(promotion, 'value.maxDiscountAmount', price);
      let maxQuantity = lget(promotion, 'value.maxDiscountAmount', quantity);
      let promoType = lget(promotion, 'value.type', '');
      let bogoVal;
      let quant = Math.max(quantity, maxQuantity);
      if (promoType === 'bogo') {
        let bogoBuy = lget(promotion, 'value.bogoBuy', quant);
        let bogoGet = lget(promotion, 'value.bogoGet', 1);
        let num = bogoBuy + bogoGet;
        let get = (Math.floor(quant / num) * bogoGet) + Math.max((quant % num) - bogoBuy, 0);
        /* eslint-disable no-unused-vars */
        let buy = (Math.floor(quant / num) * bogoBuy) + Math.min(quant % num, bogoBuy);
        bogoVal = price * get;
      }
      let rawAmount = () => {
        switch (promoType) {
          case('percentage'):
            return Math.max(price * (parseFloat(lget(promotion, 'value.value', 0)) / 100) * quant, maxAmount);
          case('flat'):
            return Math.max(parseFloat(lget(promotion, 'value.value', 0)) * quant, maxAmount);
          case('bogo'):
            return Math.max(bogoVal, maxAmount);
        }
      };
      // TODO: add feedback messaging based on how close they are to more value etc
      return { value: rawAmount, name: promotion.name, limitations: lget(promotion, 'settings.limitations', '') };
    } else
      return { value: 0, name: promotion.name, limitations: lget(promotion, 'settings.limitations', '') };
  };

  Vue.prototype.$getProductTaxes = (product, vendor) => {

  };
};
