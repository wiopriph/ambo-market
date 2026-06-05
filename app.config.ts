export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      // neutral: 'slate',
    },

    breadcrumb: {
      slots: {
        root: 'mb-4',
        list: 'flex items-center gap-1 min-w-0',
        item: 'shrink-0 last:flex-1 last:min-w-0',
        link: 'text-xs md:text-sm hover:text-primary aria-[current=page]:pointer-events-none',
        linkLabel: 'block whitespace-nowrap overflow-hidden text-ellipsis truncate aria-[current=page]:font-medium',
        separator: 'mx-1 text-gray-400',
      },
    },
  },
});
