export type FeedbackType = 'idea' | 'bug' | 'complaint' | 'other';

export function useFeedback() {
  const isOpen = useState<boolean>('feedbackOpen', () => false);
  // предзаполненный тип при открытии (например «bug» из страницы ошибки)
  const initialType = useState<FeedbackType>('feedbackInitialType', () => 'idea');

  const openFeedback = (type: FeedbackType = 'idea') => {
    initialType.value = type;
    isOpen.value = true;
  };

  const closeFeedback = () => {
    isOpen.value = false;
  };

  return {
    isOpen,
    initialType,
    openFeedback,
    closeFeedback,
  };
}
