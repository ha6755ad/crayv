const { parentPort } = require('worker_threads');
const os = require('os');
const pMap = require('p-map');

const logger = require('../src/logger');
const concurrency = os.cpus().length;

let isCancelled = false;

let feathersApp;

const findQueuedActions = async ({ app } = {}) => {
  return await app.service('iy-queue').find({
    query: {
      deleted: { $ne: true },
      status: 'queue'
    }
  });
};

const runAction = async (queuedAction) => {
  return await feathersApp.service('iy-queue').patch(queuedAction._id, { tries: { $inc: 1 }});
};

async function mapper(result) {
  // return early if the job was already cancelled
  if (isCancelled) return;
  try {
    const response = await runAction(result);
    logger.info('ran queued action', { response });
    // here is where you would write to the database that it was sent
    return response;
  } catch (err) {
    // catch the error so if one action fails they all don't fail
    logger.error(err);
  }
}

// handle cancellation (this is a very simple example)
if (parentPort)
  parentPort.once('message', message => {
    //
    // TODO: once we can manipulate concurrency option to p-map
    // we could make it `Number.MAX_VALUE` here to speed cancellation up
    // <https://github.com/sindresorhus/p-map/issues/28>
    //
    if (message === 'cancel') isCancelled = true;
  });

(async (app) => {
  // query database results for queued actions
  // and iterate over them with concurrency
  feathersApp = app;
  await pMap(await findQueuedActions(app).data, mapper, { concurrency });

  // signal to parent that the job is done
  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
