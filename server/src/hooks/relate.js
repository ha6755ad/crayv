const lget = require('lodash.get');
const lset = require('lodash.set');
const lisEmpty = require('lodash.isempty');

const flattenArray = (arr) => {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten);
  }, []);
};

const flatObjKeyList = (obj, path) => {
  let list = [];
  if (!lisEmpty(obj)) {
    Object.keys(obj).forEach(key => {
      let newPath = path ? `${path}.${key}` : key;
      let getVal = lget(obj, key, '');
      // console.log('see change');
      let pathToAdd = typeof getVal === 'object' && !Array.isArray(getVal) ? flatObjKeyList(getVal, newPath) : newPath;
      list.push(pathToAdd);
    });
  }
  return flattenArray(list);
};


const relateOto = (
  {
    idPath = '_id',
    dataPath = 'result',
    therePath,
    herePath,
    thereService,
    thereObj
  } = {}) => {
  return async context => {
    if(['create', 'patch', 'update'].includes(context.method) && !lget(context, 'params.relate_hook')) {
      if (context.type === 'before') dataPath = 'data';

      let hereData = lget(context, dataPath);
      let id = lget(hereData, idPath);
      let hereItemId = lget(hereData, herePath);
      if (hereItemId) {
        let patchObj = {};
        if (thereObj) lset(patchObj, therePath, thereObj);
        else lset(patchObj, therePath, id);
        context.params.relateOto_res = await context.app.service(thereService).patch(hereItemId, patchObj, { relate_hook: 'relateOto' });
        return context;
      } else {
        //removes the relationship if there is one on the thereItem - becuase there isn't one on the hereItem
        if (therePath && thereService) {
          let keyList = flatObjKeyList(hereData);
          if (keyList.includes(herePath)) {
            let query = {};
            lset(query, therePath, id);
            let updateObj = { $set: {} };
            lset(updateObj, ['$set', therePath], null);
            context.app.service(thereService).update(
              { query: query },
              updateObj
            );
          }
        }
        return context;
      }
    } else return context;
  };
};

const removeMtm = (
  {
    idPath = '_id',
    dataPath = 'result',
    therePath,
    herePath,
    thereService,
    thereObj,
    thereObjId,
    hereMapId
  } = {}) => {
  return async context => {
    if(context.method === 'remove' && !lget(context, 'params.relate_hook')) {
      if (context.type === 'before') dataPath = 'data';

      //becuase $pull only wants the id of the Object ideally
      //To manage nested lists on here side
      let hereData = lget(context, dataPath);
      let id = lget(hereData, idPath);
      let hereItemIds = hereMapId ? lget(hereData, herePath, []).map(a => a[hereMapId]) : lget(hereData, herePath);
      // eslint-disable-next-line no-console
      // console.log('hereitem ids', hereItemIds);
      if (hereItemIds && hereItemIds.length) {
        let pullFromSet = {};
        let obj = {};
        if (thereObjId) lset(obj, thereObjId, lget(thereObj, thereObjId));
        else obj = thereObj;
        if (thereObj) lset(pullFromSet, therePath, obj);
        else lset(pullFromSet, therePath, id);
        context.params.removeMtm_res = await context.app.service(thereService).Model.updateMany(
          { _id: { $in: hereItemIds } },
          { $pull: pullFromSet }
        );
        return context;
      } else return context;
    } else return context;
  };
};

const relateMtm = (
  {
    idPath = '_id',
    dataPath = 'result',
    therePath,
    herePath,
    thereService,
    thereObj,
    thereObjId,
    hereMapId
  } = {}) => {
  return async context => {
    if(['create', 'patch', 'update'].includes(context.method) && !lget(context, 'params.relate_hook')) {
      if (context.type === 'before') dataPath = 'data';

      let hereData = lget(context, dataPath);
      let id = lget(hereData, idPath);
      let hereItemIds = hereMapId ? lget(hereData, herePath, []).map(a => a[hereMapId]) : lget(hereData, herePath);
      // eslint-disable-next-line no-console
      // console.log('hereitem ids', hereItemIds);
      if (hereItemIds && hereItemIds.length) {
        let addToSet = {};
        if (thereObj) lset(addToSet, therePath, thereObj);
        else lset(addToSet, therePath, id);
        if (context.method !== 'create' && context.type === 'before') {
          let old = await context.app.service(context.path).get(context.id, { query: { $select: [herePath] } });
          let oldIds = lget(old, herePath, []);
          //you only need to look at the ids that were in the old array and are not in the new one - because new ones being added are handled by the above functiton;
          let missingIds = [];
          let hereStrings = Array.isArray(hereItemIds) ? hereItemIds.map(a => JSON.stringify(a)) : [];
          oldIds.forEach(oid => {
            if (!hereStrings.includes(JSON.stringify(oid))) {
              missingIds ? missingIds.push(oid) : missingIds = [oid];
            }
          });
          let query = { _id: { $in: missingIds } };
          context.params.relateMtm_res = await context.app.service(thereService).Model.updateMany(
            query,
            { $pull: addToSet }
          );
        } else {
          let query = { _id: { $in: hereItemIds } };
          //such as where therePath is an array of objects we need to check that we aren't adding a duplicate by filtering out any where thereObjId is already present
          if(thereObjId) lset(query, therePath, {$ne: thereObjId});
          else lset(query, therePath, { $nin: [id] });

          context.params.relateMtm_res = await context.app.service(thereService).Model.updateMany(
            query,
            { $addToSet: addToSet }
          );
        }
        return context;
      } else {
        //removes the relationship if there are any on the thereItems - becuase there isn't one on the hereItem
        if (therePath && thereService) {
          let keyList = flatObjKeyList(hereData);
          if (keyList.includes(herePath)) {
            let query = {};
            lset(query, therePath, { $in: [id] });
            let updateObj = { $pull: {} };
            lset(updateObj, ['$pull', therePath], id);
            context.params.relateMtm_res = context.params.relateMtm_res = await context.app.service(thereService).Model.update(
              { query: query },
              updateObj
            );
          }
        }
        return context;
      }
    } else return context;
  };
};

// TO put on the service 'here' with the one and be related to the service 'there' with the many array
const relateOtm = (
  {
    idPath = '_id',
    dataPath = 'result',
    therePath,
    herePath,
    thereService,
    thereObj
  } = {}) => {
  return async context => {
    if(['create', 'patch', 'update'].includes(context.method) && !lget(context, 'params.relate_hook')) {
      if (context.type === 'before') dataPath = 'data';

      let hereData = lget(context, dataPath);
      let id = lget(hereData, idPath);
      let hereItemId = lget(hereData, herePath);
      // eslint-disable-next-line no-console
      // console.log('herepath', herePath, 'therePath', therePath, 'thereService', thereService, 'hereData', hereData, 'hereItemId', hereItemId);
      if (hereItemId) {
        let addToSet = {};
        if (thereObj) lset(addToSet, therePath, thereObj);
        else lset(addToSet, therePath, id);
        // eslint-disable-next-line no-console
        // console.log('before relate otm', addToSet);
        context.params.relateOtm_res = await context.app.service(thereService).patch(hereItemId, {
          $addToSet: addToSet
        }, { relate_hook: 'relateOtm' });
        // eslint-disable-next-line no-console
        // console.log('related otm', context.params.relateOtm_res);
        return context;
      } else {
        //removes the relationship if there are any on the thereItems - becuase there isn't one on the hereItem
        if (therePath && thereService) {
          let keyList = flatObjKeyList(hereData);
          if (keyList.includes(herePath)) {
            let query = {};
            lset(query, therePath, { $in: [id] });
            let updateObj = { $pull: {} };
            lset(updateObj, ['$pull', therePath], id);
            context.params.relateOtm_res = context.app.service(thereService).update(
              { query: query },
              updateObj
            );
          }
        }
        return context;
      }
    } else return context;
  };
};

const removeOto = (
  {
    // idPath = '_id',
    dataPath = 'result',
    therePath,
    herePath,
    thereService,
    thereObj,
    thereObjId
  } = {}) => {
  return async context => {
    if(context.method === 'remove' && !lget(context, 'params.relate_hook')) {
      if (context.type === 'before') dataPath = 'data';
      let hereData = lget(context, dataPath);
      let hereItemId = lget(hereData, herePath);
      if (hereItemId) {
        let patchObj = {};
        let obj = {};
        if (thereObjId) lset(obj, thereObjId, lget(thereObj, thereObjId));
        else obj = thereObj;
        if (thereObj) lset(patchObj, therePath, obj);
        else lset(patchObj, therePath, null);
        context.params.removeOto_res = await context.app.service(thereService).patch(hereItemId, patchObj, { relate_hook: 'removeOto' })
          // eslint-disable-next-line no-console
          .catch(err => console.log('error removing relationship ', herePath, therePath, thereService, err));
        return context;
      } else return context;
    } else return context;
  };
};
const removeOtm = (
  {
    idPath = '_id',
    dataPath = 'result',
    therePath,
    herePath,
    thereService,
    thereObj,
    thereObjId
  } = {}) => {
  return async context => {
    if(context.method === 'remove' && !lget(context, 'params.relate_hook')) {
      if (context.type === 'before') dataPath = 'data';

      let hereData = lget(context, dataPath);
      let id = lget(hereData, idPath);
      let hereItemId = lget(hereData, herePath);
      if (hereItemId) {
        let pullFromSet = {};
        let obj = {};
        if (thereObjId) lset(obj, thereObjId, lget(thereObj, thereObjId));
        else obj = thereObj;
        if (thereObj) lset(pullFromSet, therePath, obj);
        else lset(pullFromSet, therePath, id);
        context.params.removeOtm_res = await context.app.service(thereService).patch(hereItemId, {
          $pull: pullFromSet
        },  { relate_hook: 'removeOtm' });
        return context;
      } else return context;
    } else return context;
  };
};
module.exports = {
  relateOtm,
  relateOto,
  removeOtm,
  removeOto,
  relateMtm,
  removeMtm
};

