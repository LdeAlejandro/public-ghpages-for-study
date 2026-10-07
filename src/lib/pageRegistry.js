const modules = import.meta.glob('../pages/**/page.jsx', {
  eager: true,
})

function pathFromFilename(filename) {
  return filename
    .replace('../pages/', '')
    .replace('/page.jsx', '')
    .split('/')
    .map((part) =>
      part
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\s+/g, '-')
        .toLowerCase(),
    )
    .join('/')
}

export const pages = Object.entries(modules)
  .map(([filename, module]) => ({
    path: `/${pathFromFilename(filename)}`,
    component: module.default,

    title: module.metadata?.title ?? 'Untitled',
    category: module.metadata?.category ?? 'Other',
    description: module.metadata?.description ?? '',
    keywords: module.metadata?.keywords ?? [],

    // Used to order pages from newest → oldest
    created: module.metadata?.created ?? '1970-01-01T00:00:00Z',
  }))
  .sort((a, b) => new Date(b.created) - new Date(a.created))