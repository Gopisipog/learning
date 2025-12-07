const authentication = require('./authentication');
const searchJobsTrigger = require('./triggers/search_jobs');
const matchJobsAction = require('./creates/match_jobs');

module.exports = {
    version: require('./package.json').version,
    platformVersion: require('zapier-platform-core').version,

    authentication: authentication,

    // Middleware to add auth headers
    beforeRequest: [
        (request, z, bundle) => {
            if (bundle.authData && bundle.authData.brightdataApiKey) {
                request.headers['Authorization'] = `Bearer ${bundle.authData.brightdataApiKey}`;
            }
            return request;
        }
    ],

    // Triggers - watch for new jobs
    triggers: {
        [searchJobsTrigger.key]: searchJobsTrigger,
    },

    // Searches - find specific jobs
    searches: {},

    // Creates/Actions - match jobs to resume
    creates: {
        [matchJobsAction.key]: matchJobsAction,
    },

    resources: {},
};
