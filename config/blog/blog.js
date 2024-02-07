/**
 * @type {import('@docusaurus/plugin-content-blog').PluginOptions}
 */
const blog = {
  blogTitle: 'Blog',
  showReadingTime: true,
  readingTime: ({ content, defaultReadingTime }) => defaultReadingTime({ content, options: { wordsPerMinute: 300 } }),
  feedOptions: {
    type: 'all',
    copyright: '@ hexdrinker, All rights reserved',
  },
  blogSidebarCount: 'ALL',
};

module.exports = blog;