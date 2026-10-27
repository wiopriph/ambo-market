import { defineCollection, defineContentConfig, z } from '@nuxt/content';


export default defineContentConfig({
  collections: {
    blog: defineCollection({
      // blog/drafts не попадает под маску: там лежат скрытые статьи
      source: {
        include: 'blog/*.md',
        prefix: '/blog',
      },
      type: 'page',
      schema: z.object({
        image: z.string(),
        date: z.date(),
        dateModified: z.date().optional(),
        tags: z.array(z.string()).optional(),
      }),
    }),
  },
});
