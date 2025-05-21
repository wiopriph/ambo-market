import clickOutsideDirective from '~/directives/clickOutside';
import debounceDirective from '~/directives/debounce';


export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('debounce', debounceDirective);
  nuxtApp.vueApp.directive('click-outside', clickOutsideDirective);
});
