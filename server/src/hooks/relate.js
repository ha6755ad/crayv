const lget = require('lodash.get');
const lset = require('lodash.set');

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
    if (context.type === 'before') dataPath = 'data';

    let id = lget(context, [dataPath, idPath]);
    let hereData = lget(context, dataPath);
    let hereItemId = lget(hereData, herePath);
    if (hereItemId) {
      let patchObj = {};
      if (thereObj) lset(patchObj, therePath, thereObj);
      else lset(patchObj, therePath, id);
      context.params.relateOto_res = await context.app.service(thereService).patch(hereItemId, patchObj);
      return context;
    } else {
      //removes the relationship if there is one on the thereItem - becuase there isn't one on the hereItem
      if (therePath && thereService) {
        let query = {};
        lset(query, therePath, id);
        let updateObj = {$set: {}};
        lset(updateObj, ['$set', therePath], null);
        context.app.service(thereService).update(
          {query: query},
          updateObj
        );
      }
      return context;
    }
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
    if (context.type === 'before') dataPath = 'data';

    //becuase $pull only wants the id of the Object ideally
    let id = lget(context, [dataPath, idPath]);
    //To manage nested lists on here side
    let hereData = lget(context, dataPath);
    let hereItemIds = hereMapId ? lget(hereData, herePath, []).map(a => a[hereMapId]) : lget(hereData, herePath);
    console.log('hereitem ids', hereItemIds);
    if (hereItemIds && hereItemIds.length) {
      let pullFromSet = {};
      let obj = {};
      if (thereObjId) lset(obj, thereObjId, lget(thereObj, thereObjId));
      else obj = thereObj;
      if (thereObj) lset(pullFromSet, therePath, obj);
      else lset(pullFromSet, therePath, id);
      context.app.service(thereService).Model.updateMany(
        {_id: {$in: hereItemIds}},
        {$pull: pullFromSet}
      );
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
    hereMapId
  } = {}) => {
  return async context => {
    if (context.type === 'before') dataPath = 'data';

    let id = lget(context, [dataPath, idPath]);
    let hereData = lget(context, dataPath);
    let hereItemIds = hereMapId ? lget(hereData, herePath, []).map(a => a[hereMapId]) : lget(hereData, herePath);
    console.log('hereitem ids', hereItemIds);
    if (hereItemIds && hereItemIds.length) {
      let addToSet = {};
      if (thereObj) lset(addToSet, therePath, thereObj);
      else lset(addToSet, therePath, id);
      if (context.method !== 'create' && context.type === 'before') {
        let old = await context.app.service(context.path).get(context.id, {query: {select: [herePath]}});
        let oldIds = lget(old, herePath, []);
        //you only need to look at the ids that were in the old array and are not in the new one - because new ones being added are handled by the above functiton;
        let missingIds = [];
        let hereStrings = Array.isArray(hereItemIds) ? hereItemIds.map(a => JSON.stringify(a)) : [];
        oldIds.forEach(oid => {
          if (!hereStrings.includes(JSON.stringify(oid))) {
            missingIds ? missingIds.push(oid) : missingIds = [oid];
          }
        });
        context.app.service(thereService).Model.updateMany(
          {_id: {$in: missingIds}},
          {$pull: addToSet}
        );
      } else {
        context.app.service(thereService).Model.updateMany(
          {_id: {$in: hereItemIds}},
          {$addToSet: addToSet}
        );
      }
      return context;
    } else {
      //removes the relationship if there are any on the thereItems - becuase there isn't one on the hereItem
      if (therePath && thereService) {
        let query = {};
        lset(query, therePath, {$in: [id]});
        let updateObj = {$pull: {}};
        lset(updateObj, ['$pull', therePath], id);
        context.app.service(thereService).update(
          {query: query},
          updateObj
        );
      }
      return context;
    }
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
    if (context.type === 'before') dataPath = 'data';

    console.log('herepath', herePath, 'therePath', therePath, 'thereService', thereService);
    let id = lget(context, [dataPath, idPath]);
    let hereData = lget(context, dataPath);
    let hereItemId = lget(hereData, herePath);
    if (hereItemId) {
      let addToSet = {};
      if (thereObj) lset(addToSet, therePath, thereObj);
      else lset(addToSet, therePath, id);
      return await context.app.service(thereService).patch(hereItemId, {
        $addToSet: addToSet
      })
        .catch(err => {
          console.log('relateOtm error', context.path, herePath, ' to ', thereService, therePath, err);
        });
    } else {
      //removes the relationship if there are any on the thereItems - becuase there isn't one on the hereItem
      if (therePath && thereService) {
        let query = {};
        lset(query, therePath, {$in: [id]});
        let updateObj = {$pull: {}};
        lset(updateObj, ['$pull', therePath], id);
        context.app.service(thereService).update(
          {query: query},
          updateObj
        );
      }
      return context;
    }
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
      return await context.app.service(thereService).patch(hereItemId, patchObj)
        .catch(err => console.log('error removing relationship ', herePath, therePath, thereService, err));
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
    if (context.type === 'before') dataPath = 'data';

    let id = lget(context, [dataPath, idPath]);
    let hereData = lget(context, dataPath);
    let hereItemId = lget(hereData, herePath);
    if (hereItemId) {
      let pullFromSet = {};
      let obj = {};
      if (thereObjId) lset(obj, thereObjId, lget(thereObj, thereObjId));
      else obj = thereObj;
      if (thereObj) lset(pullFromSet, therePath, obj);
      else lset(pullFromSet, therePath, id);
      return await context.app.service(thereService).patch(hereItemId, {
        $pull: pullFromSet
      });
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

