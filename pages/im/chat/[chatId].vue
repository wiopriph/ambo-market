<script setup lang="ts">
import {
  getFirestore,
  collection,
  doc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { useUser } from '~/composables/useUser';


definePageMeta({
  middleware: 'auth',
});

const message = ref<string>('');

const { $fire } = useNuxtApp();
const firestore = getFirestore($fire.app);

const sendMessage = () => {
  if (message.value) {
    const tempMessage = {
      id: `temp-${Date.now()}`,
      text: message.value,
      senderId: uid.value,
      timestamp: Date.now(),
      isRead: false,
      isSending: true,
      isFailed: false,
    };

    messages.value.push(tempMessage);

    message.value = '';

    nextTick(() => scrollToLastMessage());

    $fire.https('sendMessage', {
      text: tempMessage.text,
      chatId: route.params.chatId,
    })
      .catch(() => {
        const index = messages.value.findIndex(msg => msg.id === tempMessage.id);

        if (index !== -1) {
          messages.value[index].isFailed = true;
          messages.value[index].isSending = false;
        }
      });
  }
};

const retrySendMessage = async (messageId: string) => {
  const messageToRetry = messages.value.find(msg => msg.id === messageId);

  if (messageToRetry) {
    messageToRetry.isFailed = false;
    messageToRetry.isSending = true;

    try {
      await $fire.https('sendMessage', {
        text: messageToRetry.text,
        chatId: route.params.chatId,
      });

      messages.value = messages.value.filter(msg => msg.id !== messageId);
    } catch (error) {
      messageToRetry.isFailed = true;
      messageToRetry.isSending = false;
    }
  }
};


const product = ref<Record<string, any>>({});
const user = ref<Record<string, any>>({});

const getChatInfo = async (chatId: string) => {
  try {
    const chat = await $fire.https('getChatById', { chatId });

    product.value = chat.post;
    user.value = chat.participant;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    navigateTo({ name: 'im' });
  }
};


const messagesContainer = ref<HTMLElement | null>(null);

const scrollToLastMessage = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const messages = ref<Array<any>>([]);

const getChatSubscription = (chatId: string) => {
  const messagesCollection = collection(firestore, `chats/${chatId}/messages`);

  return onSnapshot(messagesCollection, (snapshot) => {
    snapshot.docChanges().forEach(({ type, doc }) => {
      const messageData = {
        ...doc.data(),
        id: doc.id,
      };

      if (type === 'added') {
        // Проверяем, есть ли временное сообщение с таким же текстом
        const tempMessageIndex = messages.value.findIndex(
          msg => msg.id.startsWith('temp-') && msg.text === messageData.text,
        );

        if (tempMessageIndex !== -1) {
          messages.value.splice(tempMessageIndex, 1);
        }

        messages.value.push(messageData);

        if (!messageData.isRead && messageData.senderId !== uid.value) {
          markMessageAsRead(chatId, messageData.id);
        }
      } else if (type === 'modified') {
        const index = messages.value.findIndex(msg => msg.id === messageData.id);

        if (index !== -1) {
          messages.value[index] = messageData;
        }
      }
    });

    messages.value.sort((a, b) => a.timestamp - b.timestamp);

    nextTick(() => scrollToLastMessage());
  });
};

const markMessageAsRead = async (chatId: string, messageId: string) => {
  try {
    const messageDoc = doc(firestore, `chats/${chatId}/messages`, messageId);

    await updateDoc(messageDoc, { isRead: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error marking message as read: ${error}`);
  }
};


const isLoading = ref<boolean>(true);

let chatSubscription: null | (() => void) = null;

const getChatRoom = async (chatId: string) => {
  isLoading.value = true;

  if (chatSubscription) {
    chatSubscription();
  }

  try {
    await getChatInfo(chatId);

    chatSubscription = getChatSubscription(chatId);

    isLoading.value = false;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    navigateTo({ name: 'im' });
  }
};


const route = useRoute();

watch(() => route.params.chatId, (newChatId, oldChatId) => {
  if (newChatId !== oldChatId) {
    getChatRoom(newChatId as string);
  }
});

onMounted(async () => {
  const chatId = route.params.chatId as string;

  await getChatRoom(chatId);
});

onBeforeUnmount(() => {
  if (chatSubscription) {
    chatSubscription();
  }
});


const { uid } = useUser();

const isBuyerReviewEnabled = computed(() => {
  const { buyerId, isReviewed } = product.value;

  return buyerId && uid.value === buyerId && !isReviewed;
});

const checkMessageOwnership = (id: string) => (id === uid.value);

const goToProfile = () => {
  navigateTo({
    name: 'user-userUid-status',
    params: { userUid: user.value.id },
  });
};


const { t } = useI18n();

const { isDesktopOrTablet } = useDevice();
</script>

<template>
  <div :class="$style.root">
    <UILoader v-if="isLoading" />

    <template v-else>
      <div :class="$style.header">
        <div
          v-if="!isDesktopOrTablet"
          :class="$style.mobileTop"
        >
          <LazyChatBackButton :to="{ name: 'im' }" />

          <LazyUserProfile
            :userId="user.id"
            :name="user.name"
            :photo="user.photoUrl"
            @click="goToProfile"
          />
        </div>

        <ChatProductInfo
          :user="user"
          :product="product"
        />
      </div>

      <div
        ref="messagesContainer"
        :class="$style.messages"
      >
        <ul>
          <li
            v-for="(mes, index) in messages"
            :key="index"
            :class="$style.message"
          >
            <ChatMessage
              :isSending="mes.isSending"
              :isFailed="mes.isFailed"
              :isRead="mes.isRead"
              :isMine="checkMessageOwnership(mes.senderId)"
              :date="mes.timestamp"
              :message="mes.text"
              @resend="retrySendMessage(mes.id)"
            />
          </li>

          <li v-if="isBuyerReviewEnabled">
            <RatingCreateButton
              :userId="user.id"
              :userName="user.name"
              :userPhoto="user.photoUrl"
              :postId="product.id"
            />
          </li>
        </ul>
      </div>

      <div :class="$style.footer">
        <UIInput
          v-model="message"
          name="message"
          @keydown.enter="sendMessage"
        />

        <UIButton
          :text="t('send')"
          :disabled="!message"
          :class="$style.sendButton"
          @click="sendMessage"
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  color: $ui-color-black;
}

.header {
  flex-shrink: 0;
  padding: 10px;
  border-bottom: 1px solid $ui-color-transparent;
}

.mobileTop {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.messages {
  flex-grow: 1;
  padding: 10px;
  overflow: auto;
}

.message {

  & + & {
    margin-top: 4px;
  }
}

.footer {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  padding: 10px;
}

.sendButton {
  flex-shrink: 0;
  width: 70px;
  margin-left: 10px;
  padding: 12px 10px;
}
</style>
