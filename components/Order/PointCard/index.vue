<script setup lang="ts">
import type { OrderPointCardProps } from './types';


const props = defineProps<OrderPointCardProps>();

const { t } = useI18n();
</script>

<i18n>
{
  "en": {
    "name": "Pickup point name: {name}",
    "address": "Address: {address}",
    "contact_phone": "Contact phone: {phone}",
    "opening_hours": "Business hours: {hours}"
  },
  "pt": {
    "name": "Nome do ponto de coleta: {name}",
    "address": "Endereço: {address}",
    "contact_phone": "Telefone de contato: {phone}",
    "opening_hours": "Horário de funcionamento: {hours}"
  }
}
</i18n>

<template>
  <ul>
    <li :class="$style.item">
      <p>
        <strong
          :class="$style.text"
          v-text="point.name"
        />
      </p>
    </li>

    <li :class="$style.item">
      <I18nT
        keypath="address"
        tag="p"
      >
        <template #address>
          <span
            :class="$style.text"
            v-text="point.address"
          />
        </template>
      </I18nT>
    </li>

    <li :class="$style.item">
      <I18nT
        keypath="opening_hours"
        tag="p"
      >
        <template #hours>
          <span
            :class="$style.text"
            v-text="point.openingHours"
          />
        </template>
      </I18nT>
    </li>


    <li :class="$style.item">
      <I18nT
        keypath="contact_phone"
        tag="div"
      >
        <template #phone>
          <a :href="`tel:${point.phone}`">{{ props.point.phone }}</a>
        </template>
      </I18nT>
    </li>
  </ul>
</template>

<style lang="scss" module>
.item {
  color: $ui-color-text-main;

  & + & {
    margin-top: 8px;
  }
}

.text {
  color: $ui-color-black;
}
</style>
