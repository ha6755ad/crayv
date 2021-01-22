const lget = require('lodash.get');

const incInventory = async ({undo = false} = {}) => {

  return async context => {
    const incProducts = (products, path) => {
      products.forEach(product => {
        let id = product.product;
        let quantity = product.quantity;
        if (id && quantity) {
          let service = lget(product, 'productModel', 'crayv-products');
          let patchObj = {};
          let quantity = undo ? quantity : quantity * -1;
          patchObj[path] = { $inc: quantity * -1 };
          context.app.service(service).patch(id, patchObj)
            .catch(() => {
              let queue = {
                status: 'queue',
                id: id,
                contextParams: context.params,
                action: 'patch',
                path: path,
                operator: '$inc',
                value: quantity,
              };
              context.app.service('iy-queue').create(queue);
            });
        }
      });
    };

    let status = context.data.status;
    let products = lget(context, 'data.products', []);
    if (lget(products, [0])) {
      if (['patch', 'update'].includes(context.method)) {
        let lastStatus = await context.app.service('crayv-orders').get(context.id, { $select: ['status'] });
        if (status === 'complete' && lastStatus !== status) {
          incProducts(products, 'inventory.stock');
        }
      } else if (status === 'pending' && context.method === 'create') {
        incProducts(products, 'inventory.pending');
      }
    }
    return context;
  };
};

module.exports = {
  incInventory
};
