import clickOutsideDirective from '~/directives/clickOutside';


export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('click-outside', clickOutsideDirective);
});
