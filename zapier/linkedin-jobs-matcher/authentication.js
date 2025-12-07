// Authentication configuration for BrightData API
const testAuth = async (z, bundle) => {
  // Test the BrightData API key by making a simple request
  const response = await z.request({
    url: 'https://api.brightdata.com/datasets/v3/trigger',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${bundle.authData.brightdataApiKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.status === 200 || response.status === 401) {
    // 401 means the endpoint exists but auth failed (expected for test)
    // 200 means auth is valid
    if (response.status === 401) {
      throw new Error('Invalid BrightData API key. Please check your credentials.');
    }
    return response.data;
  }
  
  throw new Error('Unable to authenticate with BrightData API');
};

module.exports = {
  type: 'custom',
  
  fields: [
    {
      key: 'brightdataApiKey',
      label: 'BrightData API Key',
      type: 'string',
      required: true,
      helpText: 'Your BrightData API key. Get it from https://brightdata.com/cp/api_access'
    },
    {
      key: 'resumeText',
      label: 'Your Resume Text',
      type: 'text',
      required: false,
      helpText: 'Paste your resume text here for job matching. Include skills, experience, and preferences.'
    }
  ],
  
  test: testAuth,
  
  // Connection label
  connectionLabel: '{{brightdataApiKey}}'
};

