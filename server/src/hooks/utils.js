const lget = require('lodash.get');
const lset = require('lodash.set');

const getVoteScore = (context, voteScorePath) => {
  let path = voteScorePath ? voteScorePath : 'voteScore';
  let upVotes = lget(context, 'data.upVotes', []).length;
  let downVotes = lget(context, 'data.downVotes', []).length;

  context.data[path] = upVotes - downVotes;
  return context;
};

const arrayFilterZero = (filteredArray, def, prop) => {
  if (Array.isArray(filteredArray) && filteredArray.length) {
    return !prop ? filteredArray[0] : filteredArray[0][prop];
  } else return def ? def : null;
};

const dedupArray = (arr) => {
  if(Array.isArray(arr)){
    return Array.from(new Set(arr));
  } else return arr;
};

const dedupData = (context, config) => {
  let dataPath = lget(config, 'dataPath', 'data.tags');
  let arr = lget(context, dataPath, []);
  lset(context, dataPath, dedupArray(arr));
  return context;
};

const flattenArray = (arr) => {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten);
  }, []);
};

module.exports = {
  getVoteScore,
  arrayFilterZero,
  dedupArray,
  dedupData,
  flattenArray
};
