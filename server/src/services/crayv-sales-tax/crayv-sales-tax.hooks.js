let key = '7knBHt0V2Y5aOQm9';
const axios = require('axios');

const getTax = axios.create({
  baseURL: 'https://api.zip-tax.com/request/v40',
  withCredentials: false,
  timeout: 5000,
});


const getOutdatedOrEmpty = async context => {

  //query data is in context.params.query ^^ex: postal_code = context.params.query.postal_code
  // eslint-disable-next-line no-console
  console.log('checking if any results?', context, context.params.query, context.result);
  let today = new Date();
  if(context.result.length){
    // eslint-disable-next-line no-console
    console.log('it exists');
    if(today < context.result.data[0].expires){
      return context;
    }else {
      // eslint-disable-next-line no-console
      console.log('expired');
      let res = await getTax({
        'method': 'GET',
        'url': '/',
        'params': {
          'key': key,
          'postalcode': context.params.query.postal_code,
          'city': context.params.query.city
        }
      }).catch(err => {
        // eslint-disable-next-line no-console
        console.log(err);
        return err;
      });

      await context.app.service('crayv-sales-tax').patch(context.result.data[0]._id,
        {
          total_tax: res.data.results[0].taxSales,
          rates: [
            {
              name: 'State Sales Tax',
              rate: res.data.results[0].stateSalesTax
            },
            {
              name: 'City Sales Tax',
              rate: res.data.results[0].citySalesTax
            },
            {
              name: 'County Sales Tax',
              rate: res.data.results[0].countySalesTax
            },
            {
              name: 'District Sales Tax',
              rate: res.data.results[0].districtSalesTax
            },
          ],
          expires: today.setMonth(today.getMonth() + 3)
        }
      ).then(response => {
        context.result.data = [response];
        return context;
      }).catch(err => {
        // eslint-disable-next-line no-console
        console.log(err);
        return err;
      });
    }
  }else {
    // eslint-disable-next-line no-console
    console.log('creating new one');

    let res = await getTax({
      'method': 'GET',
      'url': '/',
      'params': {
        'key': key,
        'postalcode': context.params.query.postal_code,
        'city': context.params.query.city
      }
    }).catch(err => {
      // eslint-disable-next-line no-console
      console.log(err);
      return err;
    });
    // eslint-disable-next-line no-console
    console.log('this is the res', res.data);
    await context.app.service('crayv-sales-tax').create({
      country: 'US',
      city: context.params.query.city,
      postal_code: context.params.query.postal_code,
      total_tax: res.data.results[0].taxSales,
      rates: [
        {
          name: 'State Sales Tax',
          rate: res.data.results[0].stateSalesTax
        },
        {
          name: 'City Sales Tax',
          rate: res.data.results[0].citySalesTax
        },
        {
          name: 'County Sales Tax',
          rate: res.data.results[0].countySalesTax
        },
        {
          name: 'District Sales Tax',
          rate: res.data.results[0].districtSalesTax
        },
      ],
      expires: today.setMonth(today.getMonth() + 3)
    }).then(response => {
      // eslint-disable-next-line no-console
      console.log('response to create', response);
      context.result.data = [response];
      return context;
    }).catch(err => {
      // eslint-disable-next-line no-console
      console.log(err);
      return err;
    });
  }
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [getOutdatedOrEmpty],
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
