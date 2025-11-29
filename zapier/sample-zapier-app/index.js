

import packageJson from './package.json' with { type: 'json' };
import zapier from 'zapier-platform-core';

import getNewContact from './triggers/new_contact.js';

export default {
    // This is just shorthand to reference the installed dependencies you have.
    // Zapier will need to know these before we can upload.
    version: packageJson.version,
    platformVersion: zapier.version,

    

    // If you want your trigger to show up, you better include it here!
    triggers: {
        [getNewContact.key]: getNewContact
    },

    // If you want your searches to show up, you better include it here!
    searches: {},

    // If you want your creates to show up, you better include it here!
    creates: {},

    resources: {},
};
