export function useScrollToTopOnLoad(isLoading: Ref<boolean>) {
  return () => {
    let sawLoading = false;

    const stop = watch(isLoading, (loading) => {
      if (loading) {
        sawLoading = true;

        return;
      }

      if (sawLoading) {
        stop();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    setTimeout(stop, 5000);
  };
}
