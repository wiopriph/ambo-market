<script setup lang="ts">
import { useUser } from '~/composables/useUser';


definePageMeta({
  middleware: 'auth',
});

const message = ref<string>('');
const isMessageSending = ref<boolean>(false);

const { $fire } = useNuxtApp();

const sendMessage = async () => {
  if (message.value) {
    isMessageSending.value = true;

    try {
      await $fire.https('sendMessage', {
        text: message.value,
        chatId: route.params.chatId,
      });

      message.value = '';
      isMessageSending.value = false;
    } catch (error) {
      console.error(error);
      isMessageSending.value = false;
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
  const messagesCollection = $fire.firestore.collection(`chats/${chatId}/messages`);

  return $fire.firestore.onSnapshot(messagesCollection, (snapshot) => {
    snapshot.docChanges().forEach(({ type, doc }) => {
      const messageData = {
        ...doc.data(),
        id: doc.id,
      };

      if (type === 'added') {
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
    const messageDoc = $fire.firestore.doc(`chats/${chatId}/messages`, messageId);

    await $fire.firestore.updateDoc(messageDoc, { isRead: true });
  } catch (error) {
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

  return buyerId && !isReviewed && uid.value === buyerId;
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
            :photo="user.photoURL"
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
        <ul :class="$style.list">
          <li
            v-for="(mes, index) in messages"
            :key="index"
            :class="$style.message"
          >
            <ChatMessage
              :isMine="checkMessageOwnership(mes.senderId)"
              :isRead="mes.isRead"
              :date="mes.timestamp"
              :message="mes.text"
            />
          </li>

          <li v-if="isBuyerReviewEnabled">
            <LazyRatingChatButton
              :userId="user.id"
              :userName="user.name"
              :userPhoto="user.photoURL"
              :postId="product.id"
            />
          </li>
        </ul>
      </div>

      <div :class="$style.footer">
        <UIInput
          v-model="message"
          name="message"
        />

        <UIButton
          :text="t('send')"
          :disabled="!message"
          :isLoading="isMessageSending"
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

.list {
  //padding: 20px 0;
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
