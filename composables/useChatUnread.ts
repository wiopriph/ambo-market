import type { RealtimeChannel } from '@supabase/supabase-js';
import { useUser } from '~/composables/useUser';


// клиентский синглтон: одна realtime-подписка на всё приложение
let channel: RealtimeChannel | null = null;

/**
 * Глобальный счётчик непрочитанных сообщений: начальное число с API,
 * дальше realtime-инкремент по INSERT в messages (RLS отдаёт только
 * события моих чатов). После отметки прочитанного зовите refresh().
 */
export function useChatUnread() {
  const count = useState('chatUnreadCount', () => 0);
  const initialized = useState('chatUnreadInitialized', () => false);

  const { uid, isLoggedIn } = useUser();
  const supabase = useSupabaseClient();

  const refresh = async () => {
    if (!isLoggedIn.value) {
      count.value = 0;

      return;
    }

    try {
      const { count: unread } = await $fetch<{ count: number }>('/api/chats/unread-count');

      count.value = unread;
    } catch {
      // не критично: бейдж догонит на следующем refresh
    }
  };

  const subscribe = () => {
    if (channel) {
      return;
    }

    channel = supabase
      .channel('chat-unread')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const row = payload.new as { 'sender_id': string };

          if (row.sender_id !== uid.value) {
            count.value += 1;
          }
        },
      )
      .subscribe();
  };

  const unsubscribe = () => {
    if (channel) {
      supabase.removeChannel(channel);
      channel = null;
    }
  };

  if (import.meta.client && !initialized.value) {
    initialized.value = true;

    watch(isLoggedIn, (loggedIn) => {
      if (loggedIn) {
        refresh();
        subscribe();
      } else {
        count.value = 0;
        unsubscribe();
      }
    }, { immediate: true });
  }

  return { count, refresh };
}
