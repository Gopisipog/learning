// Triggers when new text is received for blog conversion
// In a real implementation, this would poll an API or use webhooks
const perform = async (z, bundle) => {
  // For demo purposes, we'll use JSONPlaceholder to simulate text sources
  // In production, this would connect to your text source (e.g., Google Docs, Notion, etc.)
  const response = await z.request({
    url: 'https://jsonplaceholder.typicode.com/posts',
    params: {
      _limit: 10 // Get the latest 10 posts
    }
  });

  // Transform the data to match our text input format
  return response.data.map(post => ({
    id: post.id,
    text: post.body,
    title: post.title,
    source: 'API',
    receivedAt: new Date().toISOString(),
    wordCount: post.body.split(/\s+/).length
  }));
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md#triggerschema
  key: 'new_text',
  noun: 'Text Input',

  display: {
    label: 'New Text for Blog',
    description: 'Triggers when new text is received that needs to be converted into a blog post.'
  },

  operation: {
    perform,
    type: 'polling', // This trigger will poll for new data

    // `inputFields` defines the fields a user could provide
    inputFields: [
      {
        key: 'source',
        label: 'Text Source',
        type: 'string',
        required: false,
        helpText: 'Optional: Filter by text source (e.g., "email", "document", "API")'
      }
    ],

    // Sample output that shows what data this trigger provides
    sample: {
      id: 1,
      text: 'This is a sample text that will be converted into a blog post. It contains multiple sentences and paragraphs.\n\nThis is the second paragraph of the sample text.',
      title: 'Sample Blog Post Title',
      source: 'API',
      receivedAt: '2025-11-24T08:00:00.000Z',
      wordCount: 25
    },

    // Output fields available to subsequent Zap steps
    outputFields: [
      {key: 'id', label: 'Text ID', type: 'integer'},
      {key: 'text', label: 'Text Content', type: 'string'},
      {key: 'title', label: 'Suggested Title', type: 'string'},
      {key: 'source', label: 'Source', type: 'string'},
      {key: 'receivedAt', label: 'Received At', type: 'datetime'},
      {key: 'wordCount', label: 'Word Count', type: 'integer'}
    ]
  }
};
