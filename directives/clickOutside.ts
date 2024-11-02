const HAS_NAVIGATOR = typeof navigator !== 'undefined';
const IS_TOUCH = typeof window !== 'undefined' && ('ontouchstart' in window || (HAS_NAVIGATOR && navigator.maxTouchPoints > 0));
const EVENT = IS_TOUCH ? 'touchstart' : 'click';

interface DirectiveOptions {
  el: HTMLElement;
  event: Event;
  handler: (event: Event, el: HTMLElement) => void;
}

type Instance = {
  handler: (event: Event) => void;
  event: string;
};

const instances = new Map<HTMLElement, Instance>();

function onClickOutside({ el, event, handler }: DirectiveOptions): void {
  const isClickOutside = event.target !== el && !el.contains(event.target as Node);

  if (isClickOutside) {
    handler(event, el);
  }
}

function toggleEventListeners(action: 'add' | 'remove', event: string, eventHandler: EventListenerOrEventListenerObject): void {
  if (typeof document !== 'undefined') {
    document[`${action}EventListener`](event, eventHandler, true);
  }
}

const clickOutsideDirective = {
  mounted(el: HTMLElement, { value: handler }: { value: (event: Event, el: HTMLElement) => void }) {
    if (typeof window === 'undefined') { return; } // Только на клиенте

    const eventHandler = (event: Event) => onClickOutside({ el, event, handler });

    toggleEventListeners('add', EVENT, eventHandler);
    instances.set(el, { handler: eventHandler, event: EVENT });
  },
  unmounted(el: HTMLElement) {
    const instance = instances.get(el);

    if (instance) {
      toggleEventListeners('remove', instance.event, instance.handler);
      instances.delete(el);
    }
  },
};

export default clickOutsideDirective;
