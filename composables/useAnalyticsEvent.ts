export function useAnalyticsEvent() {
  const pushEvent = (event: string, data: Record<string, any> = {}) => {
    if (process.env.NODE_ENV === 'production' && import.meta.client && window?.dataLayer) {
      window.dataLayer.push({
        event,
        ...data,
      });
    } else {
       
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
