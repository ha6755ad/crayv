const lget = require('lodash.get');
const dollarString = (val, test, dec) =>  {
  // console.log('dollar string', val, test)
  let decimal = dec || dec === 0 ? dec : 2;
  let valDec = val.toFixed(decimal);
  return (test ? '$' : '') + valDec.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
};

/* eslint-disable no-unused-vars */
exports.CrayvProductPrice = class CrayvProductPrice {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    return {};
  }

  // pass in quantity through query
  // returns { value: discount: total: message: promo: exp: tax: }
  async create(data, params) {
    // TODO: handle promos populate issue
    // TODO: handle sales tax addition
    let tax = {
      sales: { flat: 0 },
      local: { flat: 0 },
      other: { flat: 0 }
    };

    const getTaxTotal = (subTotal, tax) => {
      let total = 0;
      const getTypeAmt = (prop) => {
        if(prop) {
          let percentage = lget(prop, 'percentage', 0);
          if (percentage) return subTotal * percentage;
          else return lget(prop, 'flat', 0);
        } else return 0;
      };
      Object.keys(tax).forEach(key => {
        total += getTypeAmt(tax[key]);
      });
      return total;
    };

    let promos = lget(data, 'promos', lget(data, '_fastjoin.promos'));
    let price = lget(data, 'price.basePrice', 0) * lget(params, 'query.quantity', 1);
    // console.log('get pricing', data);
    // TODO: handle more robust cart features - multiple products for one vendor, global discounts etc
    const getDiscount = (promo) => {
      let amt = parseInt(lget(promo, 'value.value', 0));
      let maxAmt = lget(promo, 'value.maxDiscountAmount',0);
      let maxPct = maxAmt / price;
      let exp = lget(promo, 'settings.expires', null);

      let value = lget(promo, 'value.type', null);
      if (value === 'percentage') {
        // PERCENTAGE
        let discount = maxAmt ? Math.min(price * amt/100, maxAmt) : price * amt/100;
        let pct = maxPct ? Math.min(maxPct, amt) : amt;
        let message = `${pct}% Off`;

        return {
          percentage: pct,
          discount: discount,
          total: price - discount,
          taxTotal: getTaxTotal((price - discount), tax),
          message: message,
          promo: promo,
          exp: exp,
          tax: tax
        };

      } else if(value === 'flat') {
        // FLAT
        let percentage = maxPct ? Math.min(maxPct, (amt / price)) : amt / price;
        let discount = maxAmt ? Math.min(amt, maxAmt) : amt;
        let message = `${dollarString(discount, '$', 2)} off`;

        return {
          value: percentage,
          discount: discount,
          total: price - discount,
          taxTotal: getTaxTotal((price - discount), tax),
          message: message,
          promo: promo,
          exp: exp,
          tax: tax
        };

      } else if(value === 'bogo') {
        // BOGO
        return 0;
        // TODO: handle BOGO
      } else return 0;
    };

    let list = [];
    if(promos && promos.length) {
      promos.forEach(p => {
        let price = getDiscount(p);
        let last = lget(list, [0, 'value'], false);
        if ((last || last === 0) && last < price.value) list.unshift(price);
        else list.push(price);
      });
    } else list = [{total: price}];
    // console.log('returning price', list);
    return {list: list};
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
};
