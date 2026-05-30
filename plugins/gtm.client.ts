import { onNuxtReady, useHead, useRuntimeConfig } from '#imports';


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

  const gtmScript = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  `;

  const gtmNoscript = `
    <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>
  `;

  onNuxtReady(() => {
    useHead({
      script: [
        {
          id: 'gtm-script',
          innerHTML: gtmScript,
          async: true,
          tagPosition: 'head',
        },
      ],
      noscript: [
        {
          id: 'gtm-noscript',
          innerHTML: gtmNoscript,
          tagPosition: 'bodyOpen',
        },
      ],
    });
  });
});
