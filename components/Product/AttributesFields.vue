<script setup lang="ts">
import type { AttributeField } from '~/constants/productAttributes';


const props = defineProps<{
  fields: AttributeField[];
  modelValue: Record<string, unknown>;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>];
}>();

const setValue = (key: string, value: unknown) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
};
</script>

<template>
  <div
    v-if="fields.length"
    class="rounded-2xl border border-default bg-default divide-y divide-default overflow-hidden"
  >
    <div
      v-for="field in fields"
      :key="field.key"
      class="px-5 py-4"
    >
      <UFormField
        :label="field.unit ? `${field.label} (${field.unit})` : field.label"
        :name="`attributes.${field.key}`"
        :required="field.required"
      >
        <USelect
          v-if="field.type === 'select'"
          :modelValue="(modelValue[field.key] as string)"
          :items="field.options"
          valueKey="value"
          labelKey="label"
          :placeholder="field.placeholder ?? 'Selecione'"
          size="lg"
          class="w-full"
          @update:model-value="setValue(field.key, $event)"
        />

        <UInput
          v-else-if="field.type === 'number'"
          :modelValue="(modelValue[field.key] as string)"
          type="number"
          inputmode="decimal"
          size="lg"
          class="w-full"
          :placeholder="field.placeholder"
          @update:model-value="setValue(field.key, $event)"
        />

        <USwitch
          v-else-if="field.type === 'boolean'"
          :modelValue="!!modelValue[field.key]"
          @update:model-value="setValue(field.key, $event)"
        />

        <UInput
          v-else
          :modelValue="(modelValue[field.key] as string)"
          type="text"
          size="lg"
          class="w-full"
          :placeholder="field.placeholder"
          @update:model-value="setValue(field.key, $event)"
        />
      </UFormField>
    </div>
  </div>
</template>
