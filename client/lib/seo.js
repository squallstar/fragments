// Default settings for SEO
// Docs: https://atmospherejs.com/lookback/seo
Router.plugin('seo', {
  defaults: {
    title: 'Your fragments',
    suffix: 'Fragments',
    separator: '-',
    description: 'Collect and organise your articles',
    meta: {
      keywords: ['fragments', 'collect']
    }
  }
});