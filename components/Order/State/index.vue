<script setup lang="ts">
import type { OrderStateProps } from './types';


const props = defineProps<OrderStateProps>();


const isActionRequired = computed(() => ['need_to_pay', 'need_to_deliver'].includes(props.status));
const isApprovalRequired = computed(() => props.status === 'need_to_approve');

const emit = defineEmits(['approveOrder']);

const isLoading = ref(false);

const { $fire } = useNuxtApp();

const approveOrder = async () => {
  isLoading.value = true;

  try {
    await $fire.https('approveOrder', { orderId: props.orderId });

    emit('approveOrder');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const { t } = useI18n();
</script>

<i18n lang="json">
{
  "en": {
    "waiting_for_approval": {
      "title": "Wait for the seller's decision",
      "description": "Please wait for the seller to confirm your order."
    },
    "need_to_approve": {
      "title": "Confirm the order",
      "description": "Pressing the confirmation button signifies your agreement to sell the item to the specified buyer."
    },
    "need_to_pay": {
      "title": "Pay for the order.",
      "description": {
        "text": "Please make the payment for your order at {points}.",
        "points": "the nearest pickup point"
      }
    },
    "waiting_for_payment": {
      "title": "Awaiting payment",
      "description": "Please wait for the payment of the item from the buyer."
    },
    "waiting_for_delivery": {
      "title": "Wait for the delivery",
      "description": "Please wait for your item to be delivered to the pickup point."
    },
    "need_to_deliver": {
      "title": "Deliver to pickup",
      "description": {
        "text": "Please deliver your item to {points}.",
        "points": "the nearest pickup point"
      }
    },
    "need_to_check": {
      "title": "Order delivered, collect now",
      "description": "Your order has been delivered. Come to the pickup point to collect it."
    },
    "waiting_for_check": {
      "title": "Wait for the buyer's decision",
      "description": "Wait for the buyer to inspect and purchase your item."
    },
    "successful_purchase": {
      "title": "Order successfully completed",
      "description": "Congratulations on your purchase!"
    },
    "need_to_receive_payment": {
      "title": "Item sold",
      "description": "Please visit the pickup point to collect your money from the sale of your item."
    },
    "successful_sale": {
      "title": "Order successfully completed",
      "description": "Congratulations on your sale!"
    },
    "need_to_take_money": {
      "title": "Your order has been canceled",
      "description": "Please visit the pickup point to collect your money."
    },
    "need_to_take_goods": {
      "title": "Collect your item",
      "description": "Your order has been canceled. Please collect your item at the pickup point."
    },
    "successfully_canceled": {
      "title": "Order canceled",
      "description": "Your order has been canceled."
    },
    "successfully_completed": {
      "title": "Order successfully completed",
      "description": "Congratulations!"
    },
    "unknown_status": {
      "title": "Unknown order status",
      "description": "Unknown status"
    },
    "confirm_order": "Confirm order"
  },
  "pt": {
    "waiting_for_approval": {
      "title": "Aguardando decisão do vendedor",
      "description": "Por favor, aguarde a confirmação do vendedor para o seu pedido."
    },
    "need_to_approve": {
      "title": "Confirme o pedido",
      "description": "Confirme a venda do seu item para este comprador clicando no botão 'Confirmar'. Ao pressionar o botão de confirmação, você concorda em vender o item para o comprador especificado."
    },
    "need_to_pay": {
      "title": "Pague pelo pedido",
      "description": {
        "text": "Por favor, faça o pagamento do seu pedido em {points}, para que o vendedor possa despachar o seu item. O envio não será processado até que o pedido seja pago.",
        "points": "o ponto de retirada mais próximo"
      }
    },
    "waiting_for_payment": {
      "title": "Aguardando pagamento",
      "description": "Por favor, aguarde o pagamento do item pelo comprador."
    },
    "waiting_for_delivery": {
      "title": "Aguarde a entrega",
      "description": "Por favor, aguarde a entrega do seu item no ponto de retirada."
    },
    "need_to_deliver": {
      "title": "Entregue no ponto de retirada",
      "description": {
        "text": "Por favor, entregue o seu item em {points}.",
        "points": "o ponto de retirada mais próximo"
      }
    },
    "need_to_check": {
      "title": "Pedido entregue, colete agora",
      "description": "Seu pedido foi entregue. Vá ao ponto de retirada para coletá-lo."
    },
    "waiting_for_check": {
      "title": "Aguarde a decisão do comprador",
      "description": "Aguarde o comprador inspecionar e comprar o seu item."
    },
    "successful_purchase": {
      "title": "Pedido concluído com sucesso",
      "description": "Parabéns pela sua compra!"
    },
    "need_to_receive_payment": {
      "title": "Item vendido",
      "description": "Por favor, visite o ponto de retirada para receber o dinheiro da venda do seu item."
    },
    "successful_sale": {
      "title": "Pedido concluído com sucesso",
      "description": "Parabéns pela sua venda!"
    },
    "need_to_take_money": {
      "title": "Seu pedido foi cancelado",
      "description": "Seu pedido foi cancelado. Por favor, visite o ponto de retirada para receber o seu dinheiro."
    },
    "need_to_take_goods": {
      "title": "Colete o seu item",
      "description": "Seu pedido foi cancelado. Por favor, colete o seu item no ponto de retirada."
    },
    "successfully_canceled": {
      "title": "Pedido cancelado",
      "description": "Seu pedido foi cancelado."
    },
    "successfully_completed": {
      "title": "Pedido concluído com sucesso",
      "description": "Parabéns!"
    },
    "unknown_status": {
      "title": "Status do pedido desconhecido",
      "description": "Status desconhecido"
    }
  },
  "confirm_order": "Confirmar pedido"
}
</i18n>

<template>
  <div>
    <p
      :class="$style.title"
      v-text="t(`${status}.title`)"
    />

    <template v-if="isActionRequired">
      <I18nT
        :keypath="`${status}.description.text`"
        :class="$style.text"
        tag="p"
      >
        <template #points>
          <NuxtLink :to="{ name: 'offices' }">
            {{ t(`${status}.description.points`) }}
          </NuxtLink>
        </template>
      </I18nT>
    </template>

    <p
      v-else
      :class="$style.text"
      v-text="t(`${status}.description`)"
    />

    <div
      v-if="isApprovalRequired"
      :class="$style.button"
    >
      <UIButton
        :isLoading="isLoading"
        :text="t('confirm_order')"
        @click="approveOrder"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
.title {
  @include ui-typo-15-bold;
  color: $ui-color-black;
}

.text {
  margin-top: 10px;
}

.button {
  margin-top: 20px;
}
</style>
