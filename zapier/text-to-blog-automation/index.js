const newTextTrigger = require('./triggers/new_text');
const createBlogPost = require('./creates/blog_post');
const authentication = require('./authentication');

// Middleware to add authentication to all requests
const addAuthToHeader = (request, z, bundle) => {
  if (bundle.authData && bundle.authData.apiKey) {
    request.headers['Authorization'] = `Bearer ${bundle.authData.apiKey}`;
  }
  return request;
};

module.exports = {
  // This is just shorthand to reference the installed dependencies you have.
  // Zapier will need to know these before we can upload.
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  // Authentication configuration
  authentication: authentication,

  // Middleware to add auth headers to all requests
  beforeRequest: [addAuthToHeader],

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [newTextTrigger.key]: newTextTrigger,
  },

  // If you want your searches to show up, you better include it here!
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: {
    [createBlogPost.key]: createBlogPost,
  },

  resources: {},
};
