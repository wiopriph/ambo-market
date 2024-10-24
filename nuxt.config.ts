import svgLoader from 'vite-svg-loader';
import StylelintPlugin from 'vite-plugin-stylelint';


export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  devtools: {
    enabled: true,
  },

  modules: [
    '@nuxtjs/i18n',
  ],

  // https://i18n.nuxtjs.org/docs/getting-started/usage
  i18n: {
    baseUrl: process.env.APP_BASE_URL,
    strategy: 'no_prefix',
    defaultLocale: 'pt',
    langDir: './locales/',

    locales: [
      {
        code: 'en',
        language: 'en-US',
        name: 'English',
        file: 'en.js',
      },
      {
        code: 'pt',
        language: 'pt-BR',
        name: 'Português',
        file: 'pt.js',
      },
    ],

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
    },

    vueI18n: './i18n.config.ts',
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
