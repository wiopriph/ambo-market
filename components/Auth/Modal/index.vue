<script setup lang="ts">
import { AUTH_STATES } from '~/constants/auth-states';
import type { AuthModalStateValue } from '~/constants/auth-states';
import type { AuthModalProps } from '~/components/Auth/Modal/types';
import {
  AuthWelcome,
  AuthRegistration,
  AuthRegistrationSuccess,
  AuthLogin,
  AuthRecovery,
  AuthRecoverySuccess,
} from '#components';


const props = withDefaults(defineProps<AuthModalProps>(), {
  state: AUTH_STATES.WELCOME,
});


const currentState = ref<AuthModalStateValue>(props.state);

const selectState = (newState: AuthModalStateValue) => {
  currentState.value = newState;
};

const COMPONENT_MAP = {
  [AUTH_STATES.WELCOME]: AuthWelcome,
  [AUTH_STATES.REGISTRATION]: AuthRegistration,
  [AUTH_STATES.REGISTRATION_SUCCESS]: AuthRegistrationSuccess,
  [AUTH_STATES.LOGIN]: AuthLogin,
  [AUTH_STATES.RECOVERY]: AuthRecovery,
  [AUTH_STATES.RECOVERY_SUCCESS]: AuthRecoverySuccess,
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
