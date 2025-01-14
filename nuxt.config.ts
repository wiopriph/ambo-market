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
    enabled: true,
  },

  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/device',
    '@nuxtjs/leaflet',
    'nuxt-swiper',
    '@nuxt/image',
    'nuxt-gtag',
    '@nuxtjs/sitemap',
    'dayjs-nuxt',
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
        language: 'pt-BR',
        name: 'Português',
        shortName: 'Pt',
      },
    ],

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'locale',
    },

    vueI18n: './i18n/index.ts',
  },

  swiper: {
    bundled: false,
  },

  gtag: {
    // NUXT_PUBLIC_GTAG_ID overwrites the `gtag.id` module option
    enabled: process.env.NODE_ENV === 'production',
  },

  dayjs: {
    locales: ['en', 'pt'],
    plugins: ['relativeTime'],
    defaultLocale: 'pt',
  },

  sitemap: {
    xsl: false,
    excludeAppSources: true,
    cacheMaxAgeSeconds: 3600,
    sources: [
      '/api/sitemap',
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
  },

  routeRules: {
    '/auth': { ssr: false },
    '/im': { ssr: false },
    '/product/create': { ssr: false },
  },

  plugins: [
    '~/plugins/location.server.ts',
    '~/plugins/firebase.ts',
  ],
});
