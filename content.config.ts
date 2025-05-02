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
      }),
    }),
    // blogEn: defineCollection({
    //   source: {
    //     include: 'blog/en/*.md',
    //     prefix: '/blog/en',
    //   },
    //   type: 'page',
    //   schema: z.object({
    //     lang: z.string(),
    //     date: z.date(),
    //   }),
    // }),
  },
});
