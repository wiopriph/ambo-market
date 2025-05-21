import type { DirectiveBinding } from 'vue';

/**
 * Директива отложенного вызова функции, вызываемой вводом в <input> или <textarea>
 *
 * @param {function} value - аргумент для функции
 * @param {string | undefined} arg - аргумент для setTimeout
 *
 * Допустимые варианты:
 * v-debounce="() => void"
 * v-debounce:1000="() => void"
 */

const DEFAULT_DELAY = 300;
const ALLOWED_HTML_TAGS = [
  'input',
  'textarea',
];

export default {
  created(el: HTMLElement, { value, arg = `${DEFAULT_DELAY}` }: DirectiveBinding) {
    if (ALLOWED_HTML_TAGS.includes(el.tagName.toLowerCase()) && typeof value === 'function') {
      const parsedArg = parseInt(arg);
      const delay = isNaN(parsedArg) ? DEFAULT_DELAY : parsedArg;

      let timeout: ReturnType<typeof setTimeout>;

      const handler = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => value(), delay);
      };

      el.addEventListener('input', handler);
    }
  },
};
