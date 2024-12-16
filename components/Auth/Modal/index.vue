<script setup lang="ts">
import { AUTH_STATES } from '~/constants/auth-states';
import type { AuthModalStateValue } from '~/constants/auth-states';
import type { AuthModalProps } from '~/components/Auth/Modal/types';


const props = withDefaults(defineProps<AuthModalProps>(), {
  state: AUTH_STATES.WELCOME,
});


const currentState = ref<AuthModalStateValue>(props.state);

const selectState = (newState: AuthModalStateValue) => {
  currentState.value = newState;
};

const COMPONENT_MAP = {
  [AUTH_STATES.WELCOME]: defineAsyncComponent(() => import('~/components/Auth/Welcome.vue')),
  [AUTH_STATES.REGISTRATION]: defineAsyncComponent(() => import('~/components/Auth/Registration.vue')),
  [AUTH_STATES.REGISTRATION_SUCCESS]: defineAsyncComponent(() => import('~/components/Auth/RegistrationSuccess.vue')),
  [AUTH_STATES.LOGIN]: defineAsyncComponent(() => import('~/components/Auth/Login.vue')),
  [AUTH_STATES.RECOVERY]: defineAsyncComponent(() => import('~/components/Auth/Recovery.vue')),
  [AUTH_STATES.RECOVERY_SUCCESS]: defineAsyncComponent(() => import('~/components/Auth/RecoverySuccess.vue')),
};

const currentComponent = computed(() => {
  const state = currentState.value || AUTH_STATES.WELCOME;

  return COMPONENT_MAP[state];
});


const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<template>
  <UIModal
    maxWidth="500px"
    @close="closeModal"
  >
    <component
      :is="currentComponent"
      @select="selectState"
      @close="closeModal"
    />
  </UIModal>
</template>
