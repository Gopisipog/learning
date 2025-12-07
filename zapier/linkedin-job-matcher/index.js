import authentication from './authentication.js';
import newJobTrigger from './triggers/new_job.js';
import matchResumeCreate from './creates/match_resume.js';

// Middleware to add authentication to all requests
const addAuthToHeader = (request, z, bundle) => {
  if (bundle.authData && bundle.authData.apiKey) {
    request.headers['Authorization'] = `Bearer ${bundle.authData.apiKey}`;
  }
  return request;
};

export default {
  // This is just shorthand to reference the installed dependencies you have.
  // Zapier will need to know these before we can upload.
  version: '1.0.0',
  platformVersion: '18.0.4',

  // Authentication configuration
  authentication: authentication,

  // Middleware to add auth headers to all requests
  beforeRequest: [addAuthToHeader],

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [newJobTrigger.key]: newJobTrigger,
  },

  // If you want your searches to show up, you better include it here!
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: {
    [matchResumeCreate.key]: matchResumeCreate,
  },

  resources: {},
};
