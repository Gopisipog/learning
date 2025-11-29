import zapier from 'zapier-platform-core';

// Use this to make test calls into your app:
import App from '../../index.js';
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe('triggers.new_contact', () => {
  it('should run', async () => {
    const bundle = { inputData: {} };

    const results = await appTester(App.triggers['new_contact'].operation.perform, bundle);
    expect(results).toBeDefined();
    // TODO: add more assertions
  });
});
