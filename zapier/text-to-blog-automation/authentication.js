// Authentication configuration for the blog platform
// This uses API Key authentication

const testAuth = async (z, bundle) => {
  // Test the API key by making a simple request
  // In a real implementation, this would call your blog platform's auth endpoint
  const response = await z.request({
    url: 'https://jsonplaceholder.typicode.com/users/1',
    headers: {
      'Authorization': `Bearer ${bundle.authData.apiKey}`
    }
  });
  
  // If the request succeeds, the API key is valid
  if (response.status === 200) {
    return response.data;
  }
  
  throw new Error('Invalid API key');
};

module.exports = {
  type: 'custom',
  
  // Define the fields users will need to provide for authentication
  fields: [
    {
      key: 'apiKey',
      label: 'API Key',
      type: 'string',
      required: true,
      helpText: 'Enter your blog platform API key. You can find this in your account settings.'
    },
    {
      key: 'blogUrl',
      label: 'Blog URL',
      type: 'string',
      required: false,
      helpText: 'Optional: Your blog URL (e.g., https://myblog.com)'
    }
  ],
  
  // Test function to verify the authentication works
  test: testAuth,
  
  // Add authentication headers to all requests
  connectionLabel: '{{blogUrl}}', // Shows the blog URL in the connection label
};

