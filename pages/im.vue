<script setup lang="ts">
import { useUser } from '~/composables/useUser';
import type { Chat } from '~/types/chat';


definePageMeta({
  middleware: 'auth',
});

const { t } = useI18n();

const title = computed(() => t('messages'));

useHead({ title: title.value });


const { $fire } = useNuxtApp();

const chatList = ref<Chat[]>([]);

const getChatsList = async () => {
  try {
    const response = await $fire.https('getChats');

    chatList.value = Array.isArray(response) ? response as Chat[] : [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch chat list:', error);

    chatList.value = [];
  }
};


const CHAT_LIST_UPDATE_INTERVAL = 30000;

const chatListUpdateTimer = ref<ReturnType<typeof setInterval> | null>(null);

const startChatsTimer = () => {
  chatListUpdateTimer.value = setInterval(() => getChatsList(), CHAT_LIST_UPDATE_INTERVAL);
};

const clearChatsTimer = () => {
  if (chatListUpdateTimer.value) {
    clearInterval(chatListUpdateTimer.value);

    chatListUpdateTimer.value = null;
  }
};


const isLoading = ref(true);

onMounted(async () => {
  await getChatsList();

  isLoading.value = false;

  startChatsTimer();
});

onBeforeUnmount(() => {
  clearChatsTimer();
});


const route = useRoute();

const isMainChatPage = computed(() => route.name === 'im');
const isChatListEmpty = computed(() => !isLoading.value && !(chatList.value && chatList.value.length > 0));

const getActiveChat = (chatId: string) => route.params.chatId === chatId;

const goToChatRoomRoute = (chatId: string) => {
  navigateTo({
    name: 'im-chat-chatId',
    params: { chatId },
  });
};

const {
  uid,
  currentUser,
} = useUser();

const userCabinetRoute = computed(() => ({
  name: 'user-userUid-status',
  params: {
    userUid: uid.value,
  },
}));

const { isDesktopOrTablet } = useDevice();
</script>

<i18n>
{
  "en": {
    "messages": "Messages"
  },
  "pt": {
    "messages": "Mensagens"
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <div
      v-if="isDesktopOrTablet && currentUser"
      :class="$style.left"
    >
      <UserInfo :user="currentUser" />

      <LazyUserMenu :class="$style.desktopMenu" />
    </div>

    <div :class="$style.main">
      <UILoader v-if="isLoading" />

      <template v-else>
        <template v-if="isMainChatPage && !isDesktopOrTablet">
          <LazyChatBackButton
            :to="userCabinetRoute"
            :class="$style.backButton"
          />

          <h3
            :class="$style.chatTitle"
            v-text="t('messages')"
          />
        </template>

        <LazyChatEmptyRooms v-if="isChatListEmpty" />

        <template v-else>
          <ul
            v-if="isDesktopOrTablet || isMainChatPage"
            :class="$style.chatList"
          >
            <li
              v-for="chat in chatList"
              :key="chat.chatId"
              :class="$style.chatItem"
            >
              <ChatPreview
                :product="chat.post"
                :user="chat.participant"
                :message="chat.lastMessage"
                :unreadCount="chat.unreadCount"
                :isActive="getActiveChat(chat.chatId)"
                @click="goToChatRoomRoute(chat.chatId)"
              />
            </li>
          </ul>

          <div
            v-if="isDesktopOrTablet || !isMainChatPage"
            :class="$style.room"
          >
            <NuxtPage />
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-simple-container;

  display: flex;
  height: 100%;

  @include md {
    flex-direction: column;
    max-height: calc(100% - 44px);
  }

  @include exclude-md {
    flex-direction: row;
    padding: 20px;
  }
}

.left {
  max-width: 300px;
  margin-right: 20px;

  @include md {
    display: none;
  }
}

.desktopMenu {
  margin-top: 20px;

  @include md {
    display: none;
  }
}

.main {
  display: flex;
  flex: 1;
  height: 100%;

  @include md {
    flex-direction: column;
    max-height: 100%;
  }

  @include exclude-md {
    @include ui-round-content-blocks;

    flex-direction: row;
    max-height: 580px;
    background-color: $ui-color-white;
    box-shadow: $box-shadow;
  }
}

.backButton {
  padding: 10px;
}

.chatTitle {
  @include ui-typo-24-medium;
  padding: 10px;
}

.chatList {
  width: 100%;
  padding: 10px;
  overflow: scroll;

  @include md {
    @include ui-round-content-blocks;
  }

  @include exclude-md {
    max-width: 380px;
    border-right: 1px solid $ui-color-transparent;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
}

.chatItem {

  & + & {
    border-top: 1px solid $ui-color-transparent;
  }
}

.room {
  display: flex;
  flex: 1 1;
  flex-direction: column;
  height: 100%;
}
</style>
