// Helper function to format text into blog post structure
const formatTextToBlog = (text, title, author, tags) => {
  // Split text into paragraphs
  const paragraphs = text.split('\n\n').filter(p => p.trim());

  // Create formatted HTML content
  const formattedContent = paragraphs
    .map(p => `<p>${p.trim()}</p>`)
    .join('\n');

  // Generate excerpt (first 150 characters)
  const excerpt = text.substring(0, 150) + (text.length > 150 ? '...' : '');

  // Calculate reading time (average 200 words per minute)
  const wordCount = text.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return {
    title,
    content: formattedContent,
    excerpt,
    author,
    tags: tags || '',
    wordCount,
    readingTime,
    publishedAt: new Date().toISOString(),
  };
};

// create a blog post from text input
const perform = async (z, bundle) => {
  const { text, title, author, tags, category, status } = bundle.inputData;

  // Apply defaults
  const authorName = author || 'Anonymous';
  const categoryName = category || 'General';
  const statusValue = status || 'draft';

  // Format the text into a blog post structure
  const blogPost = formatTextToBlog(text, title, authorName, tags);

  // Add additional fields
  blogPost.category = categoryName;
  blogPost.status = statusValue;

  // In a real implementation, you would send this to your blog platform's API
  // For demo purposes, we'll use JSONPlaceholder
  const response = await z.request({
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts',
    body: {
      title: blogPost.title,
      body: blogPost.content,
      userId: 1,
      // Include all formatted data in the response
      ...blogPost
    }
  });

  // Return the created blog post with all metadata
  return {
    ...response.data,
    ...blogPost,
    id: response.data.id,
  };
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md#createschema
  key: 'blog_post',
  noun: 'Blog Post',

  display: {
    label: 'Create Blog Post from Text',
    description: 'Converts plain text into a formatted blog post with metadata, excerpts, and reading time.'
  },

  operation: {
    perform,

    // Input fields for creating a blog post
    inputFields: [
      {
        key: 'text',
        label: 'Blog Content',
        type: 'string',
        required: true,
        helpText: 'The main text content for your blog post. Separate paragraphs with double line breaks.'
      },
      {
        key: 'title',
        label: 'Blog Title',
        type: 'string',
        required: true,
        helpText: 'The title of your blog post'
      },
      {
        key: 'author',
        label: 'Author Name',
        type: 'string',
        required: false,
        helpText: 'The author of the blog post'
      },
      {
        key: 'tags',
        label: 'Tags',
        type: 'string',
        required: false,
        helpText: 'Comma-separated tags for the blog post (e.g., "technology, AI, automation")'
      },
      {
        key: 'category',
        label: 'Category',
        type: 'string',
        required: false,
        helpText: 'The category for this blog post'
      },
      {
        key: 'status',
        label: 'Status',
        type: 'string',
        required: false,
        choices: ['draft', 'published', 'scheduled'],
        helpText: 'Publication status of the blog post'
      }
    ],

    // Sample output
    sample: {
      id: 101,
      title: 'My First Blog Post',
      content: '<p>This is the first paragraph of my blog post.</p>\n<p>This is the second paragraph.</p>',
      excerpt: 'This is the first paragraph of my blog post. This is the second paragraph...',
      author: 'John Doe',
      tags: 'technology, blogging',
      category: 'Technology',
      status: 'published',
      wordCount: 150,
      readingTime: 1,
      publishedAt: '2025-11-24T08:00:00.000Z'
    },

    // Output fields that will be available in subsequent Zap steps
    outputFields: [
      {key: 'id', label: 'Post ID', type: 'integer'},
      {key: 'title', label: 'Title', type: 'string'},
      {key: 'content', label: 'Formatted Content', type: 'string'},
      {key: 'excerpt', label: 'Excerpt', type: 'string'},
      {key: 'author', label: 'Author', type: 'string'},
      {key: 'tags', label: 'Tags', type: 'string'},
      {key: 'category', label: 'Category', type: 'string'},
      {key: 'status', label: 'Status', type: 'string'},
      {key: 'wordCount', label: 'Word Count', type: 'integer'},
      {key: 'readingTime', label: 'Reading Time (minutes)', type: 'integer'},
      {key: 'publishedAt', label: 'Published At', type: 'datetime'}
    ]
  }
};
