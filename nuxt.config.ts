import svgLoader from 'vite-svg-loader';
import StylelintPlugin from 'vite-plugin-stylelint';


export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  devtools: {
    enabled: true,
  },

  modules: ['@nuxtjs/i18n', '@nuxtjs/device'],

  // https://i18n.nuxtjs.org/docs/getting-started/usage
  i18n: {
    baseUrl: process.env.APP_BASE_URL,
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
});
