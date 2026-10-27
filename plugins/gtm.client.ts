import { useRuntimeConfig } from '#imports';
import { loadScriptOnce, runOnInteractionOrAfterLoad } from '~/utils/thirdPartyScripts';


interface PublicConfig {
  gtmId?: string;
  gtmEnabled?: boolean | string;
}

export default defineNuxtPlugin(() => {
  const { public: publicConfig } = useRuntimeConfig() as { public: PublicConfig };

  const isEnabled =
        publicConfig.gtmEnabled === true ||
        String(publicConfig.gtmEnabled).toLowerCase() === 'true';

  const gtmId = typeof publicConfig.gtmId === 'string' ? publicConfig.gtmId.trim() : '';

  if (!isEnabled || !gtmId) {
    return;
  }

  // очередь живёт с первого кадра: события, отправленные до загрузки
  // контейнера, копятся в ней, GTM разбирает их при старте
  window.dataLayer = window.dataLayer || [];

  // контейнер (gtm.js + gtag.js, ~300 KiB и ~250 мс главного потока)
  // грузим после первого действия пользователя или через 4 с после load,
  // чтобы он не попадал в окно измерения LCP/TBT
  runOnInteractionOrAfterLoad(() => {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    loadScriptOnce(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`);
  });
});
