// const ms = require('ms');
// const dayjs = require('dayjs');
const lget = require('lodash.get');
const Graceful = require('@ladjs/graceful');
const logger = require('../logger');

const Bree = require('bree');

const genCron = ({second = null, minute = null, hour = null, daysOfMonth = null, month = null, daysOfWeek = null} = {}) => {

  const commaSeparated = arr => {
    let str = '';
    for(let i = 0; i < arr.length; i++){
      if(i < arr.length - 1) str += arr[i];
      else str += (arr[i] + ',');
    }
    return str;
  };

  const getCronVal = val => {
    return typeof val === 'number' ? val : Array.isArray(val) && lget(val, [0]) ? commaSeparated(val) : '*';
  };

  let sec = getCronVal(second);
  let min = getCronVal(minute);
  let hr = getCronVal(hour);
  let dm = getCronVal(daysOfMonth);
  let mo = getCronVal(month);
  let dw = getCronVal(daysOfWeek);

  return `${sec} ${min} ${hr} ${dm} ${mo} ${dw}`;
};

const cron = async (app) => {

  // TODO: should be configurable
  const jobs = await app.service('iy-cron-tasks').find({
    query: {
      deleted: { $ne: true },
      active: true
    }
  });


  let jobList = [];
  jobs.data.forEach(job => {
    let obj = {
      name: job.name,
      path: job.path,
      timeout: job.timeout,
      interval: job.interval,
      //TODO: dates need to be javascript dates
      date: job.date,
      cron: job.cron ? genCron(job) : null
    };
    jobList.push(obj);
  });

  const bree = new Bree({
    logger: logger,
    jobs: jobList
  });

  const graceful = new Graceful({ brees: [bree] });
  graceful.listen();
  logger.info('starting bree');
  try {
    bree.start();
  } catch(err) {
    logger.error(err);
  } finally {
    logger.info('Started Bree: ' + bree);
  }
};

module.exports = {
  cron
};
