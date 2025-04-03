<script setup lang="ts">
const {
  t,
  locale,
  locales,
  setLocale,
} = useI18n();

const companyLinks = computed(() => ([
  {
    name: t('about_us'),
    route: { name: 'about' },
  },
  {
    name: t('terms_of_use'),
    route: { name: 'terms' },
  },
  {
    name: t('privacy_policy'),
    route: { name: 'privacy' },
  },
]));

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/ambo.market/',
  },
];


const availableLocales = computed(() => locales.value.filter(({ code }) => code !== locale.value));

const setNewLocale = (newLocale: string) => setLocale(newLocale);


const route = useRoute();

const hasAdButton = typeof route.name === 'string' && ['index', 'cityId', 'cityId-categoryId'].includes(route.name);


const goToCreatePage = () => {
  navigateTo({ name: 'product-create' });
};

const { isMobileOrTablet } = useDevice();
</script>

<i18n lang="json">
{
  "en": {
    "place_ad": "Place Your Ad",
    "company": "Company",
    "about_us": "About Us",
    "terms_of_use": "Terms of Use",
    "privacy_policy": "Privacy Policy",
    "follow_us": "Follow Us",
    "support": "Support",
    "contact_us": "Contact Us",
    "languages": "Languages"
  },
  "pt": {
    "place_ad": "Coloque anúncio",
    "company": "Empresa",
    "about_us": "Sobre nós",
    "terms_of_use": "Termos de Uso",
    "privacy_policy": "Política de Privacidade",
    "follow_us": "Siga-nos",
    "support": "Suporte",
    "contact_us": "Entre em contato conosco",
    "languages": "Idiomas"
  }
}
</i18n>

<template>
  <footer :class="$style.root">
    <UIButton
      v-if="hasAdButton && isMobileOrTablet"
      :text="t('place_ad')"
      :class="$style.adButton"
      type="tertiary"
      @click="goToCreatePage"
    />

    <div :class="[$style.container, $style.content]">
      <div
        v-if="isMobileOrTablet"
        :class="$style.mobileWrap"
      >
        <UIAccordionItem :title="t('languages')">
          <ul :class="$style.list">
            <li
              v-for="({ code, name }) in availableLocales"
              :key="code"
              :class="$style.link"
            >
              <button
                type="button"
                :class="$style.langButton"
                @click="setNewLocale(code)"
                v-text="name"
              />
            </li>
          </ul>
        </UIAccordionItem>

        <UIAccordionItem :title="t('company')">
          <ul :class="$style.list">
            <li
              v-for="link in companyLinks"
              :key="link.name"
              :class="$style.link"
            >
              <NuxtLink :to="link.route">
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </UIAccordionItem>

        <UIAccordionItem :title="t('follow_us')">
          <ul :class="$style.list">
            <li
              v-for="social in socialLinks"
              :key="social.name"
              :class="$style.link"
            >
              <a
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
              > {{ social.name }}</a>
            </li>
          </ul>
        </UIAccordionItem>

        <UIAccordionItem :title="t('support')">
          <ul :class="$style.list">
            <li :class="$style.link">
              <NuxtLink :to="{ name: 'contact' }">
                {{ t('contact_us') }}
              </NuxtLink>
            </li>
          </ul>
        </UIAccordionItem>
      </div>

      <div
        v-else
        :class="$style.wrap"
      >
        <div :class="$style.item">
          <h4
            :class="$style.title"
            v-text="t('company')"
          />

          <ul :class="$style.list">
            <li
              v-for="link in companyLinks"
              :key="link.name"
              :class="$style.link"
            >
              <NuxtLink :to="link.route">
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div :class="$style.item">
          <h4
            :class="$style.title"
            v-text="t('follow_us')"
          />

          <ul :class="$style.list">
            <li
              v-for="social in socialLinks"
              :key="social.name"
              :class="$style.link"
            >
              <a
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
              >{{ social.name }}</a>
            </li>
          </ul>
        </div>

        <div :class="$style.item">
          <h4
            :class="$style.title"
            v-text="t('support')"
          />

          <ul :class="$style.list">
            <li :class="$style.link">
              <NuxtLink :to="{ name: 'contact' }">
                {{ t('contact_us') }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div :class="$style.item">
          <h4
            :class="$style.title"
            v-text="t('languages')"
          />

          <ul :class="$style.list">
            <li
              v-for="({ code, name }) in availableLocales"
              :key="code"
              :class="$style.link"
            >
              <button
                :class="$style.langButton"
                type="button"
                @click="setNewLocale(code)"
                v-text="name"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div :class="[$style.container, $style.copyright]">
      © 2025 Ambo.Market
    </div>
  </footer>
</template>

<style lang="scss" module>
.root {
  width: 100%;
  margin-top: auto;
}

.content {
  @include exclude-sm {
    border-top: 1px solid $ui-color-transparent;
  }
}

.container {
  @include ui-simple-container;
}

.mobileWrap {
  padding: 30px 20px 0;
}

.wrap {
  @include ui-row;
  padding: 30px 20px 0;
}

.item {
  @include ui-col-ready;
  @include ui-col-vertical-gutter;
  @include ui-col(3);

  @include sm {
    @include ui-col(6);
  }
}

.title {
  @include ui-typo-16-bold;
}

.list {
  margin-top: 20px;
}

.link {
  margin-bottom: 10px;

  a:hover {
    text-decoration: underline;
  }
}

.langButton {
  padding: 0;
  color: $ui-color-blue;
  background-color: initial;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.copyright {
  padding: 10px 20px;
  color: $ui-color-text-main;
}

.adButton {

  @include md {
    position: fixed;
    bottom: 20px;
    left: 50%;
    z-index: $z-idx-dropdown + 1;
    box-shadow: rgba(0, 0, 0, .3) 0 4px 16px;
    transform: translateX(-50%);
    transition: .2s transform linear;
  }

  @include exclude-md {
    display: none;
  }
}
</style>
