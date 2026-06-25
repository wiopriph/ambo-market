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

    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('@sqlite.org/sqlite-wasm') || id.includes('sqlite3-bundler') || id.includes('sqlite3-worker1')) {
              return 'sqlite-wasm';
            }

            if (id.includes('supabase-js') || id.includes('gotrue-js') || id.includes('realtime-js') || id.includes('storage-js') || id.includes('postgrest-js') || id.includes('functions-js')) {
              return 'supabase';
            }

            if (id.includes('motion-v') || id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) {
              return 'motion';
            }
          },
        },
      },
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
