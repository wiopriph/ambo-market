<script setup lang="ts">
import type { SharePostProps } from './types';
import IconFacebook from '~/assets/images/share/icon-facebook.svg?component';
import IconMail from '~/assets/images/share/icon-mail.svg?component';
import IconTwitter from '~/assets/images/share/icon-twitter.svg?component';
import IconWhatsapp from '~/assets/images/share/icon-whatsapp.svg?component';
// @todo: переименовать в ProductSharing

const props = defineProps<SharePostProps>();

const config = useRuntimeConfig();

const socialMediaLinks = computed(() => {
  const fullPath = `${config?.public?.appBaseUrl}${props.link}`;

  const encodeLink = encodeURIComponent(fullPath);
  const encodeTitle = encodeURIComponent(props.title);

  return [
    {
      type: 'facebook',
      icon: IconFacebook,
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeLink}&quote=${encodeTitle}`,
      target: '_blank',
    },
    {
      type: 'whatsapp',
      icon: IconWhatsapp,
      link: `https://api.whatsapp.com/send?text=${encodeTitle}%20${encodeLink}`,
      target: '_blank',
    },
    {
      type: 'twitter',
      icon: IconTwitter,
      link: `https://twitter.com/intent/tweet?url=${encodeLink}&text=${encodeTitle}`,
      target: '_blank',
    },
    {
      type: 'email',
      icon: IconMail,
      link: `mailto:?subject=${encodeTitle}&body=${encodeLink}`,
    },
  ];
});
</script>

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
