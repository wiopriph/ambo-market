const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll', 'mousemove'] as const;

/**
 * Вызывает callback один раз: при первом действии пользователя или через
 * timeout мс после события load - что наступит раньше. Так тяжёлые третьи
 * скрипты (GTM, пиксели, чаты) не конкурируют с отрисовкой страницы за сеть
 * и главный поток.
 */
export function runOnInteractionOrAfterLoad(callback: () => void, timeout = 4000): () => void {
  let done = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const scheduleTimer = () => {
    timer = setTimeout(fire, timeout);
  };

  const cleanup = () => {
    for (const type of INTERACTION_EVENTS) {
      window.removeEventListener(type, fire);
    }

    window.removeEventListener('load', scheduleTimer);

    if (timer) {
      clearTimeout(timer);
    }
  };

  function fire() {
    if (done) {
      return;
    }

    done = true;
    cleanup();
    callback();
  }

  for (const type of INTERACTION_EVENTS) {
    window.addEventListener(type, fire, { once: true, passive: true });
  }

  if (document.readyState === 'complete') {
    scheduleTimer();
  } else {
    window.addEventListener('load', scheduleTimer, { once: true });
  }

  return cleanup;
}

/** Вставляет внешний скрипт один раз; повторный вызов с тем же src ничего не делает. */
export function loadScriptOnce(src: string): void {
  if (document.querySelector(`script[src="${CSS.escape(src)}"]`)) {
    return;
  }

  const script = document.createElement('script');

  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}
