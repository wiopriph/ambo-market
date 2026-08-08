import { defineCollection, defineContentConfig, z } from '@nuxt/content';


export default defineContentConfig({
  collections: {
    blog: defineCollection({
      source: {
        include: 'blog/pt/*.md',
        prefix: '/blog',
      },
      type: 'page',
      schema: z.object({
        image: z.string(),
        date: z.date(),
        dateModified: z.date(),
        tags: z.array(z.string()).optional(),
      }),
    }),
  },
});
