export function useAnalyticsEvent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pushEvent = (event: string, data: Record<string, any> = {}) => {
    if (process.env.NODE_ENV === 'production' && import.meta.client && window?.dataLayer) {
      window.dataLayer.push({
        event,
        ...data,
      });
    } else {
      // eslint-disable-next-line no-console
      console.log('pushEvent', {
        event,
        ...data,
      });
    }
  };

  return {
    pushEvent,
  };
}
