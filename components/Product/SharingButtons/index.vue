<script setup lang="ts">
import type { ProductSharingButtonsProps } from './types';
import IconFacebook from '~/assets/images/share/icon-facebook.svg?component';
import IconMail from '~/assets/images/share/icon-mail.svg?component';
import IconTwitter from '~/assets/images/share/icon-twitter.svg?component';
import IconWhatsapp from '~/assets/images/share/icon-whatsapp.svg?component';
import { CLICK_SHARE_SOCIAL } from '~/constants/analytics-events';


const props = defineProps<ProductSharingButtonsProps>();

const config = useRuntimeConfig();

const { t } = useI18n();

const fullPath = computed(() => `${config?.public?.appBaseUrl}${props.link}`);

const socialMediaLinks = computed(() => {
  const encodeLink = encodeURIComponent(fullPath.value);
  const encodeTitle = encodeURIComponent(props.title);

  return [
    {
      type: 'facebook',
      icon: IconFacebook,
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeLink}&quote=${encodeTitle}`,
      target: '_blank',
      text: t('share_facebook'),
    },
    {
      type: 'whatsapp',
      icon: IconWhatsapp,
      link: `https://api.whatsapp.com/send?text=${encodeTitle}%20${encodeLink}`,
      target: '_blank',
      text: t('share_whatsapp'),
    },
    {
      type: 'twitter',
      icon: IconTwitter,
      link: `https://twitter.com/intent/tweet?url=${encodeLink}&text=${encodeTitle}`,
      target: '_blank',
      text: t('share_twitter'),
    },
    {
      type: 'email',
      icon: IconMail,
      link: `mailto:?subject=${encodeTitle}&body=${encodeLink}`,
      text: t('send_email'),
    },
  ];
});

const { pushEvent } = useAnalyticsEvent();

const share = (platform: string) => {
  pushEvent(CLICK_SHARE_SOCIAL, { platform, link: fullPath.value });
};
</script>

<i18n lang="json">
{
  "en": {
    "share_facebook": "Share on Facebook",
    "share_whatsapp": "Share on WhatsApp",
    "share_twitter": "Share on X",
    "send_email": "Send via email"
  },
  "pt": {
    "share_facebook": "Compartilhar no Facebook",
    "share_whatsapp": "Compartilhar no WhatsApp",
    "share_twitter": "Compartilhar no X",
    "send_email": "Enviar por e-mail"
  }
}
</i18n>

<template>
  <ul :class="$style.root">
    <li
      v-for="(social, index) in socialMediaLinks"
      :key="index"
      :class="$style.item"
    >
      <a
        :href="social.link"
        :target="social.target"
        :aria-label="social.text"
        @click="share(social.type)"
      >
        <component
          :is="social.icon"
          :class="$style.icon"
        />
      </a>
    </li>
  </ul>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.item {

  & + & {
    margin-left: 20px;
  }
}

.icon {
  width: 44px;
  height: 44px;
}
</style>
