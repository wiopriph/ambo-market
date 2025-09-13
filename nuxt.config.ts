import svgLoader from 'vite-svg-loader';
import StylelintPlugin from 'vite-plugin-stylelint';


export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: true,

  runtimeConfig: {
    public: {
      appBaseUrl: '',
      firebase: {
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: undefined,
        appId: '',
      },
    },
  },

  devtools: {
    enabled: process.env.NODE_ENV !== 'production',
  },

  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/device',
    '@nuxtjs/leaflet',
    'nuxt-swiper',
    '@nuxt/image',
    '@zadigetvoltaire/nuxt-gtm',
    '@nuxtjs/sitemap',
    '@nuxt/content',
  ],

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://youlangol.firebaseapp.com', crossorigin: '' },
        { rel: 'dns-prefetch', href: 'https://youlangol.firebaseapp.com' },
      ],
    },
  },

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

  gtm: {
    id: process.env.NUXT_PUBLIC_GTAG_ID || 'GTM-PZLNCCVG',
    enabled: process.env.NODE_ENV === 'production',
  },

  sitemap: {
    xsl: false,
    excludeAppSources: true,
    cacheMaxAgeSeconds: 3600,
    sources: [
      '/api/sitemap',
      '/api/sitemap-blog',
    ],
  },

  css: [
    '~/assets/scss/global.scss',
  ],

  vite: {
    plugins: [
      StylelintPlugin(),
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
    },

    ssr: {
      noExternal: ['@sqlite.org/sqlite-wasm'],
    },

    build: {
      cssCodeSplit: false,
    },
  },

  // Cache-Control для NuxtImg
  nitro: {
    routeRules: {
      '/_ipx/**': {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      },
    },
  },

  routeRules: {
    '/auth': { ssr: false },
    '/im': { ssr: false },
    '/product/create': { ssr: false },
    '/orders': { ssr: false },
    '/orders/[orderId]': { ssr: false },
  },

  plugins: [
    '~/plugins/location.server.ts',
    '~/plugins/firebase.ts',
  ],

  experimental: {
    // asyncContext: true,
    defaults: {
      nuxtLink: {
        prefetch: false,
      },
    },
  },
});
