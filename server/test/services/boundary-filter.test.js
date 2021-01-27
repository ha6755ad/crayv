const assert = require('assert');
const app = require('../../src/app');

describe('\'boundary-filter\' service', () => {
  it('registered the service', () => {
    const service = app.service('boundary-filter');

    assert.ok(service, 'Registered the service');
  });
});
