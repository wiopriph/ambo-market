import en from './locales/en.json';
import pt from './locales/pt.json';


// TODO: Typesafe nuxt I18n will be available as experimetnal feature in v9
// https://github.com/nuxt-modules/i18n/releases/tag/v9.0.0-rc.2
type StringKey<T> = Extract<keyof T, string>;

type GenerateKeyPaths<T, Prefix extends string = ''> = T extends object
  ? {
    [K in StringKey<T>]: T[K] extends object
      ? GenerateKeyPaths<T[K], `${Prefix}${K}.`>
      : `${Prefix}${K}`;
  }[StringKey<T>]
  : Prefix;

type Locale = typeof en;

declare global {
    type I18nKeys = GenerateKeyPaths<Locale>;
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $t(key: I18nKeys): string;
  }
}

// https://youtrack.jetbrains.com/issue/WEB-59818/Vue-custom-global-properties-added-by-augmenting-vue-are-not-resolved
// We have to provide the second typing for the global properties to make it work in the JetBrains IDEs
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t(key: I18nKeys): string;
  }
}

// For useI18n composable
declare module 'vue-i18n' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefineLocaleMessage extends Locale {
  }
}

export default defineI18nConfig(() => ({
  legacy: false,
  fallbackLocale: 'pt',
  locale: 'pt',
  warnHtmlMessage: 'warn',
  messages: {
    en,
    pt,
  },
}));
