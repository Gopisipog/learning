const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe('creates.blog_post', () => {
  it('should create a blog post from text', async () => {
    const bundle = {
      inputData: {
        text: 'This is a test blog post.\n\nIt has multiple paragraphs.\n\nAnd demonstrates the text-to-blog conversion.',
        title: 'Test Blog Post',
        author: 'Test Author',
        tags: 'testing, automation, zapier',
        category: 'Technology',
        status: 'draft'
      }
    };

    const results = await appTester(App.creates['blog_post'].operation.perform, bundle);

    expect(results).toBeDefined();
    expect(results.title).toBe('Test Blog Post');
    expect(results.author).toBe('Test Author');
    expect(results.content).toContain('<p>');
    expect(results.tags).toBe('testing, automation, zapier');
    expect(results.wordCount).toBeGreaterThan(0);
    expect(results.readingTime).toBeGreaterThan(0);
    expect(results.excerpt).toBeDefined();
  });

  it('should handle minimal input', async () => {
    const bundle = {
      inputData: {
        text: 'Simple blog post.',
        title: 'Simple Post'
      }
    };

    const results = await appTester(App.creates['blog_post'].operation.perform, bundle);

    expect(results).toBeDefined();
    expect(results.title).toBe('Simple Post');
    expect(results.status).toBe('draft'); // default value
    expect(results.category).toBe('General'); // default value
  });
});
