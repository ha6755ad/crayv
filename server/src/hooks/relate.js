const lget = require('lodash.get');

const relateOto = async (context, config) => {
  let idPath = lget(config, 'idPath', '_id');
  let dataPath = lget(config, 'dataPath', context.type === 'before' ? 'data' : 'result');
  let therePath = lget(config, 'therePath');
  let herePath = lget(config, 'herePath');
  let thereService = lget(config, 'thereService');
  let thereObj = lget(config, 'thereObj');

  let id = lget(context, [dataPath, idPath]);
  let hereItemId = lget(context, [dataPath, herePath]);
  if (hereItemId) {
    let patchObj = {};
    if (thereObj) patchObj[therePath] = thereObj;
    else patchObj[therePath] = id;
    return await context.app.service(thereService).patch(hereItemId, patchObj);
  } else {
    //removes the relationship if there is one on the thereItem - becuase there isn't one on the hereItem
    if(therePath && thereService){
      let query = {};
      query[therePath] = id;
      let updateObj = { $set: {} };
      updateObj['$set'][therePath] = null;
      context.app.service(thereService).update(
        { query: query },
        updateObj
      ).catch(err => {
        console.log('relateOto error - found no hereItemId', context.path, herePath, ' to ', thereService, therePath, err);
      });
    }
    return context;
  }
};

const removeMtm = async (context, config) => {
  let herePath = lget(config, 'herePath');
  let therePath = lget(config, 'therePath');
  let thereService = lget(config, 'thereService');
  let idPath = lget(config, 'idPath', '_id');
  let dataPath = lget(config, 'dataPath', context.type === 'before' ? 'data' : 'result');
  let thereObj = lget(config, 'thereObj');
  //becuase $pull only wants the id of the Object ideally
  let thereObjId = lget(config, 'thereObjId');
  let id = lget(context, [dataPath, idPath]);

  //To manage nested lists on here side
  let hereMapId = lget(config, 'hereMapId');

  let hereItemIds = hereMapId ? lget(context, [dataPath, herePath], []).map(a => a[hereMapId]) : lget(context, [dataPath, herePath]);


  if (hereItemIds && hereItemIds.length) {
    let pullFromSet = {};

    let obj = {};
    if(thereObjId) obj[thereObjId] = thereObj[thereObjId];
    else obj = thereObj;
    if (thereObj) pullFromSet[therePath] = obj;
    else pullFromSet[therePath] = id;

    context.app.service(thereService).Model.updateMany(
      { _id: { $in: hereItemIds } },
      { $pull: pullFromSet }
    ).catch(err => {
      console.log('removeMtm error', context.path, herePath, ' to ', thereService, therePath, err);
    });

  } else return context;
};

const relateMtm = async (context, config) => {
  let herePath = lget(config, 'herePath');
  let therePath = lget(config, 'therePath');
  let thereService = lget(config, 'thereService');
  let idPath = lget(config, 'idPath', '_id');
  let dataPath = lget(config, 'dataPath', context.type === 'before' ? 'data' : 'result');
  //to manage nested lists on there side
  let thereObj = lget(config, 'thereObj');
  let id = lget(context, [dataPath, idPath]);

  //To manage nested lists on here side
  let hereMapId = lget(config, 'hereMapId');

  let hereItemIds = hereMapId ? lget(context, [dataPath, herePath], []).map(a => a[hereMapId]) : lget(context, [dataPath, herePath]);

  if (hereItemIds && hereItemIds.length) {
    let addToSet = {};

    if (thereObj) addToSet[therePath] = thereObj;
    else addToSet[therePath] = id;

    if (context.method !== 'create' && context.type === 'before') {
      let old = await context.app.service(context.path).get(context.id, { query: { select: [herePath] } });
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
        { _id: { $in: missingIds } },
        { $pull: addToSet }
      ).catch(err => {
        console.log('relateMtm error - updating missing ids', context.path, herePath, ' to ', thereService, therePath, err);
      });
    } else {
      context.app.service(thereService).Model.updateMany(
        { _id: { $in: hereItemIds } },
        { $addToSet: addToSet }
      ).catch(err => {
        console.log('relateMtm error', context.path, herePath, ' to ', thereService, therePath, err);
      });
    }
    return context;

  } else {
    //removes the relationship if there are any on the thereItems - becuase there isn't one on the hereItem
    if(therePath && thereService){
      let query = {};
      query[therePath] = { $in: [id] };
      let updateObj = { $pull: {} };
      updateObj['$pull'][therePath] = id;
      context.app.service(thereService).update(
        { query: query },
        updateObj
      ).catch(err => {
        console.log('relateMtm - found no hereItemIds', context.path, herePath, ' to ', thereService, therePath, err);
      });
    }
    return context;
  }
};

// TO put on the service 'here' with the one and be related to the service 'there' with the many array
const relateOtm = async (context, config) => {
  let herePath = lget(config, 'herePath');
  let therePath = lget(config, 'therePath');
  let thereService = lget(config, 'thereService');
  let idPath = lget(config, 'idPath', '_id');
  let dataPath = lget(config, 'dataPath', context.type === 'before' ? 'data' : 'result');
  let thereObj = lget(config, 'thereObj');

  // console.log('herepath', herePath, 'therePath', therePath, 'thereService', thereService);

  let id = lget(context, [dataPath, idPath]);
  let hereItemId = lget(context, [dataPath, herePath]);
  if (hereItemId) {

    let addToSet = {};
    if (thereObj) addToSet[therePath] = thereObj;
    else addToSet[therePath] = id;

    return await context.app.service(thereService).patch(hereItemId, {
      $addToSet: addToSet
    })
      .catch(err => {
        console.log('relateOtm error', context.path, herePath, ' to ', thereService, therePath, err);
      });

  } else {
    //removes the relationship if there are any on the thereItems - becuase there isn't one on the hereItem
    if(therePath && thereService){
      let query = {};
      query[therePath] = { $in: [id] };
      let updateObj = { $pull: {} };
      updateObj['$pull'][therePath] = id;
      context.app.service(thereService).update(
        { query: query },
        updateObj
      )
        .catch(err => {
          console.log('relateOtm error - found no hereItemId', context.path, herePath, ' to ', thereService, therePath, err);
        });
    }
    return context;
  }
};

const removeOto = async (context, config) => {
  let herePath = lget(config, 'herePath');
  let therePath = lget(config, 'therePath');
  let thereService = lget(config, 'thereService');
  // let idPath = lget(config, 'idPath', '_id');
  let dataPath = lget(config, 'dataPath', context.type === 'before' ? 'data' : 'result');
  let thereObj = lget(config, 'thereObj');
  let thereObjId = lget(config, 'thereObjId');

  let hereItemId = lget(context, [dataPath, herePath]);
  if (hereItemId) {
    let patchObj = {};
    let obj = {};
    if(thereObjId) obj[thereObjId] = thereObj[thereObjId];
    else obj = thereObj;
    if (thereObj) patchObj[therePath] = obj;
    else patchObj[therePath] = null;
    return await context.app.service(thereService).patch(hereItemId, patchObj)
      .catch(err => {
        console.log('remove Oto error', context.path, herePath, ' to ', thereService, therePath, err);
      });
  } else return context;
};

const removeOtm = async (context, config) => {
  let herePath = lget(config, 'herePath');
  let therePath = lget(config, 'therePath');
  let thereService = lget(config, 'thereService');
  let idPath = lget(config, 'idPath', '_id');
  let dataPath = lget(config, 'dataPath', context.type === 'before' ? 'data' : 'result');
  let thereObj = lget(config, 'thereObj');
  let thereObjId = lget(config, 'thereObjId');

  let id = lget(context, [dataPath, idPath]);
  let hereItemId = lget(context, [dataPath, herePath]);
  if (hereItemId) {
    let pullFromSet = {};
    let obj = {};
    if(thereObjId) obj[thereObjId] = thereObj[thereObjId];
    else obj = thereObj;
    if (thereObj) pullFromSet[therePath] = obj;
    else pullFromSet[therePath] = id;

    return await context.app.service(thereService).patch(hereItemId, {
      $pull: pullFromSet
    }).catch(err => {
      console.log('remove Otm error', context.path, herePath, ' to ', thereService, therePath, err);
    });
  } else return context;
};

module.exports = {
  relateOtm,
  relateOto,
  removeOtm,
  removeOto,
  relateMtm,
  removeMtm
};
