<script setup lang="ts">
import { CLICK_CHAT_ITEM } from '~/constants/analytics-events';


useHead({ title: 'Mensagens - Ambo Market' });

const { pushEvent } = useAnalyticsEvent();

type ChatListItem = {
  id: string;
  createdAt: string;
  lastMessageAt: string | null;
  peer: { id: string | null; name: string | null; photoURL: string | null };
  post: { id: string; title: string | null; preview: string | null; price: number | null; status: string } | null;
  lastMessage: { body: string; createdAt: string; isMine: boolean } | null;
  unreadCount: number;
};

const { data, status } = await useFetch<{ chats: ChatListItem[] }>('/api/chats');

const chats = computed(() => data.value?.chats ?? []);
const isLoading = computed(() => status.value === 'pending');

const formatTime = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();

  return sameDay ?
    date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) :
    date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
};
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-lg font-bold text-highlighted">
      Mensagens
    </h1>

    <div
      v-if="isLoading"
      class="space-y-2"
    >
      <USkeleton
        v-for="n in 3"
        :key="n"
        class="h-20 w-full rounded-2xl"
      />
    </div>

    <div
      v-else-if="!chats.length"
      class="rounded-2xl border border-default bg-default p-8 text-center"
    >
      <p class="font-semibold text-highlighted">
        Ainda não tem conversas
      </p>

      <p class="mt-1 text-sm text-muted">
        Toque em «Conversar» num anúncio para falar com o vendedor.
      </p>
    </div>

    <div
      v-else
      class="divide-y divide-default overflow-hidden rounded-2xl border border-default bg-default"
    >
      <NuxtLink
        v-for="chat in chats"
        :key="chat.id"
        :to="{ name: 'my-chats-chatId', params: { chatId: chat.id } }"
        class="flex items-center gap-3 px-4 py-3 transition hover:bg-elevated/60"
        @click="pushEvent(CLICK_CHAT_ITEM, { 'chat_id': chat.id })"
      >
        <UAvatar
          :src="chat.peer.photoURL || undefined"
          :alt="chat.peer.name || 'Utilizador'"
          :text="(chat.peer.name || 'U').charAt(0).toUpperCase()"
          size="lg"
        />

        <div class="min-w-0 flex-1">
          <div class="flex items-baseline justify-between gap-2">
            <p
              class="truncate text-sm font-semibold text-highlighted"
              v-text="chat.peer.name || 'Utilizador'"
            />

            <span
              v-if="chat.lastMessage"
              class="shrink-0 text-xs text-muted"
              v-text="formatTime(chat.lastMessage.createdAt)"
            />
          </div>

          <p
            class="truncate text-xs text-muted"
            v-text="chat.post?.title || 'Anúncio removido'"
          />

          <p
            v-if="chat.lastMessage"
            class="truncate text-sm text-muted"
          >
            <span
              v-if="chat.lastMessage.isMine"
              class="text-dimmed"
            >Você: </span>{{ chat.lastMessage.body }}
          </p>
        </div>

        <UBadge
          v-if="chat.unreadCount"
          color="primary"
          size="sm"
          class="shrink-0 rounded-full"
          :label="String(chat.unreadCount)"
        />

        <img
          v-if="chat.post?.preview"
          :src="chat.post.preview"
          :alt="chat.post.title || ''"
          class="size-12 shrink-0 rounded-lg object-cover"
        >
      </NuxtLink>
    </div>
  </div>
</template>
