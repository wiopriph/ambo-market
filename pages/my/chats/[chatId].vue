<script setup lang="ts">
import type { RealtimeChannel } from '@supabase/supabase-js';
import { getPostRoute } from '~/utils/getPostRoute';
import { getCityIdByName } from '~/constants/cities';
import { useUser } from '~/composables/useUser';
import { useChatUnread } from '~/composables/useChatUnread';


useHead({ title: 'Conversa - Ambo Market' });

type ChatMessage = {
  id: string;
  body: string;
  createdAt: string;
  isMine: boolean;
  readAt: string | null;
};

type ChatDetail = {
  id: string;
  peer: { id: string; name: string | null; photoURL: string | null };
  post: {
    id: string;
    title: string | null;
    preview: string | null;
    price: number | null;
    status: string;
    'category_id': string | null;
    'subcategory_id': string | null;
    'brand_id': string | null;
    'location_city': string | null;
  } | null;
  messages: ChatMessage[];
};

const route = useRoute();
const toast = useToast();
const { uid } = useUser();
const { refresh: refreshUnread } = useChatUnread();

const chatId = String(route.params.chatId);

const { data, error } = await useFetch<ChatDetail>(`/api/chats/${chatId}`);

if (error.value || !data.value) {
  throw createError({
    statusCode: error.value?.statusCode ?? 404,
    statusMessage: 'Conversa não encontrada',
    fatal: true,
  });
}

const peer = computed(() => data.value!.peer);
const post = computed(() => data.value!.post);

const messages = ref<ChatMessage[]>([...data.value.messages]);

const postRoute = computed(() => post.value?.category_id ?
  getPostRoute({
    productId: post.value.id,
    brandId: post.value.brand_id ?? undefined,
    subcategoryId: post.value.subcategory_id ?? undefined,
    categoryId: post.value.category_id,
    cityId: getCityIdByName(post.value.location_city ?? '') || 'all',
  }) :
  null);

// ── прокрутка к последнему сообщению ──
const scrollArea = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  nextTick(() => {
    scrollArea.value?.scrollTo({ top: scrollArea.value.scrollHeight });
  });
};

const appendMessage = (message: ChatMessage) => {
  if (messages.value.some(existing => existing.id === message.id)) {
    return;
  }

  messages.value.push(message);
  scrollToBottom();
};

const markRead = () => {
  $fetch(`/api/chats/${chatId}/read`, { method: 'POST' })
    .then(() => refreshUnread())
    .catch(() => {});
};

// ── realtime: новые сообщения приходят без перезагрузки ──
const supabase = useSupabaseClient();

let channel: RealtimeChannel | null = null;

onMounted(() => {
  scrollToBottom();

  if (messages.value.some(message => !message.isMine && !message.readAt)) {
    markRead();
  }

  channel = supabase
    .channel(`chat-${chatId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
      (payload) => {
        const row = payload.new as {
          id: string;
          'sender_id': string;
          body: string;
          'created_at': string;
          'read_at': string | null;
        };

        const isMine = row.sender_id === uid.value;

        appendMessage({
          id: row.id,
          body: row.body,
          createdAt: row.created_at,
          isMine,
          readAt: row.read_at,
        });

        if (!isMine) {
          markRead();
        }
      },
    )
    .subscribe();
});

onUnmounted(() => {
  if (channel) {
    supabase.removeChannel(channel);
  }
});

// ── отправка ──
const draft = ref('');
const isSending = ref(false);

const send = async () => {
  const text = draft.value.trim();

  if (!text || isSending.value) {
    return;
  }

  isSending.value = true;

  try {
    const message = await $fetch<ChatMessage>(`/api/chats/${chatId}/messages`, {
      method: 'POST',
      body: { body: text },
    });

    draft.value = '';
    appendMessage(message);
  } catch (error: any) {
    toast.add({
      title: error?.data?.statusMessage || 'Não foi possível enviar a mensagem',
      color: 'error',
    });
  } finally {
    isSending.value = false;
  }
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
</script>

<template>
  <div class="fixed inset-x-0 top-0 z-40 flex h-dvh flex-col bg-default md:static md:z-auto md:h-[70vh] md:overflow-hidden md:rounded-2xl md:border md:border-default">
    <!-- шапка: собеседник и объявление -->
    <div class="flex items-center gap-3 border-b border-default px-4 py-3">
      <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        aria-label="Voltar"
        :to="{ name: 'my-chats' }"
      />

      <UAvatar
        :src="peer.photoURL || undefined"
        :alt="peer.name || 'Utilizador'"
        :text="(peer.name || 'U').charAt(0).toUpperCase()"
      />

      <div class="min-w-0 flex-1">
        <p
          class="truncate text-sm font-semibold text-highlighted"
          v-text="peer.name || 'Utilizador'"
        />

        <NuxtLink
          v-if="post && postRoute"
          :to="postRoute"
          class="block truncate text-xs text-primary hover:underline"
        >
          {{ post.title }}
        </NuxtLink>

        <p
          v-else
          class="truncate text-xs text-muted"
        >
          Anúncio removido
        </p>
      </div>

      <img
        v-if="post?.preview"
        :src="post.preview"
        :alt="post.title || ''"
        class="size-10 shrink-0 rounded-lg object-cover"
      >
    </div>

    <!-- сообщения -->
    <div
      ref="scrollArea"
      class="flex-1 space-y-2 overflow-y-auto overscroll-contain px-4 py-3"
    >
      <p
        v-if="!messages.length"
        class="py-8 text-center text-sm text-muted"
      >
        Escreva a primeira mensagem
      </p>

      <div
        v-for="message in messages"
        :key="message.id"
        class="flex"
        :class="message.isMine ? 'justify-end' : 'justify-start'"
      >
        <div
          class="max-w-[80%] rounded-2xl px-3 py-2"
          :class="message.isMine ?
            'rounded-br-sm bg-primary text-inverted' :
            'rounded-bl-sm bg-elevated text-highlighted'"
        >
          <p
            class="whitespace-pre-wrap break-words text-sm"
            v-text="message.body"
          />

          <p
            class="mt-0.5 text-right text-[10px] opacity-70"
            v-text="formatTime(message.createdAt)"
          />
        </div>
      </div>
    </div>

    <!-- ввод -->
    <form
      class="flex items-end gap-2 border-t border-default px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:pb-3"
      @submit.prevent="send"
    >
      <UTextarea
        v-model="draft"
        placeholder="Escreva uma mensagem…"
        autoresize
        :rows="1"
        :maxrows="5"
        class="flex-1"
        @keydown.enter.exact.prevent="send"
      />

      <UButton
        type="submit"
        icon="i-lucide-send"
        aria-label="Enviar"
        color="primary"
        :loading="isSending"
        :disabled="!draft.trim()"
      />
    </form>
  </div>
</template>
