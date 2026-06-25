import svgLoader from 'vite-svg-loader';


export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: true,

  alias: {
    cookie: 'cookie-es',
  },

  runtimeConfig: {
    supabase: {
      serviceKey: '',
    },

    public: {
      gtmId: '',
      gtmEnabled: false,

      appBaseUrl: '',

      supabase: {
        url: '',
        key: '',
      },
    },
  },

  devtools: {
    enabled: process.env.NODE_ENV !== 'production',
  },

  modules: [
    '@nuxt/ui',
    '@nuxtjs/sitemap',
    '@nuxt/content',
    '@nuxtjs/supabase',
  ],

  sitemap: {
    xsl: false,
    excludeAppSources: true,
    cacheMaxAgeSeconds: 3600,
    sources: [
      // '/api/sitemap',
      '/api/sitemap-blog',
    ],
  },

  css: [
    '~/assets/css/nuxt-ui.css',
  ],

  vite: {
    resolve: {
      alias: {
        cookie: 'cookie-es',
      },
    },

    plugins: [
      svgLoader({
        svgo: false,
      }),
    ],


    optimizeDeps: {
      exclude: ['@sqlite.org/sqlite-wasm'],
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'cookie-es',
      ],
    },

    ssr: {
      noExternal: ['@sqlite.org/sqlite-wasm'],
    },
  },

  routeRules: {
    '/auth': { ssr: false },
    '/auth/register': { ssr: false },
    '/auth/forgot-password': { ssr: false },
    '/product/create': { ssr: false },
  },

  plugins: [
    '~/plugins/location.server.ts',
  ],

  experimental: {
    defaults: {
      nuxtLink: {
        prefetch: false,
      },
    },
  },

  supabase: {
    redirect: false,
  },

  ui: {
    colorMode: false,
  },
});
