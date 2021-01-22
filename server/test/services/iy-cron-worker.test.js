const assert = require('assert');
const app = require('../../src/app');

describe('\'iy-cron-worker\' service', () => {
  it('registered the service', () => {
    const service = app.service('iy-cron-worker');

    assert.ok(service, 'Registered the service');
  });
});
