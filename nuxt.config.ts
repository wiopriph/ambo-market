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
    '@nuxtjs/i18n',
    '@nuxtjs/device',
    '@nuxt/ui',
    'nuxt-swiper',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    '@nuxt/content',
    '@nuxtjs/supabase',
  ],

  // https://i18n.nuxtjs.org/docs/getting-started/usage
  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_APP_BASE_URL,
    strategy: 'no_prefix',
    defaultLocale: 'pt',

    locales: [
      {
        code: 'en',
        language: 'en-US',
        name: 'English',
        shortName: 'Eng',
      },
      {
        code: 'pt',
        language: 'pt-AO',
        name: 'Português',
        shortName: 'Pt',
      },
    ],

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'locale',
    },

    vueI18n: '~/i18n/index.ts',

    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  swiper: {
    bundled: false,
  },

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
    '~/assets/scss/global.scss',
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

    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
          additionalData: '@use \'~/assets/scss/index.scss\' as *;',
        },
      },
    },

    optimizeDeps: {
      exclude: ['@sqlite.org/sqlite-wasm'],
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'cookie-es',
        'swiper/element',
      ],
    },

    ssr: {
      noExternal: ['@sqlite.org/sqlite-wasm'],
    },
  },

  // Cache-Control для NuxtImg
  // nitro: {
  //   routeRules: {
  //     '/_ipx/**': {
  //       headers: {
  //         'Cache-Control': 'public, max-age=31536000, immutable',
  //       },
  //     },
  //   },
  // },

  routeRules: {
    '/auth': { ssr: false },
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
});
