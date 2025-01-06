<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { boolean, object, string } from 'yup';
import type { RatingCreateProps } from './types';
import IconStar from '~/assets/images/icon-star.svg?component';


const props = defineProps<RatingCreateProps>();

const formattedUserName = computed(() => props.userName || `User_${props.userId.slice(0, 4)}`);


const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};


const { t } = useI18n();

const {
  errors,
  handleSubmit,
  handleReset,
} = useForm({
  initialValues: {
    review: '',
  },
  validationSchema: object({
    review: string()
      .required(t('validation.required'))
      .max(300, t('validation.reviewMaxLength')),
  }),
});

const { value: review } = useField<string>('review');


const { $fire } = useNuxtApp();

const isLoading = ref(false);
const hasAPIError = ref(false);

const saveReview = handleSubmit.withControlled(async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  try {
    await $fire.https('addRating', {
      postId: props.postId,
      sellerId: props.userId,
      rating: rating.value,
      message: review.value,
    });

    handleReset();
    closeModal();
  } catch (error) {
    hasAPIError.value = true;
  } finally {
    isLoading.value = false;
  }
});


const STAR_COUNT = 5;
const rating = ref(5);

const setRating = (score: number) => {
  rating.value = score;
};


const style = useCssModule();

const starIconClassNames = (index: number) => ({
  [style.starIcon]: true,
  [style.starIconInactive]: index > rating.value,
});
</script>

<i18n>
{
  "en": {
    "rate_user": "Rate the user",
    "rate": "Rate",
    "skip": "Skip"
  },
  "pt": {
    "rate_user": "Avalie o usuário",
    "rate": "Avaliar",
    "skip": "Pular"
  }
}
</i18n>

<template>
  <UIModal
    maxWidth="500px"
    @close="closeModal"
  >
    <form
      :class="$style.root"
      @submit.prevent="saveReview"
    >
      <div :class="$style.user">
        <UIAvatar
          :size="65"
          :src="userPhoto"
          :name="formattedUserName"
        />

        <h2
          :class="$style.title"
          v-text="formattedUserName"
        />
      </div>

      <p
        :class="$style.text"
        v-text="t('rate_user')"
      />

      <ul :class="$style.list">
        <li
          v-for="(star, index) in STAR_COUNT"
          :key="index"
          :class="$style.item"
        >
          <button
            :class="$style.starButton"
            type="button"
            @click="setRating(star)"
          >
            <IconStar :class="starIconClassNames(star)" />
          </button>
        </li>
      </ul>

      <div :class="$style.textarea">
        <UIInputTextArea
          v-model="review"
          :errors="errors"
          name="review"
        />

        <UIError :text="errors.review" />
      </div>

      <div :class="$style.controls">
        <UIButton
          :text="t('rate')"
          :isLoading="isLoading"
          :class="$style.button"
          @click="saveReview"
        />

        <UIButton
          :text="t('skip')"
          :class="$style.button"
          type="secondary"
          @click="closeModal"
        />
      </div>
    </form>
  </UIModal>
</template>

<style lang="scss" module>
.root {
  width: 100%;
  padding: 20px;
}

.user {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  @include ui-typo-20-bold;

  margin-top: 8px;
}

.text {
  margin-top: 20px;
  text-align: center;
}

.list {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 16px;
}

.item {

  & + & {
    margin-left: 10px;
  }
}

.starButton {
  margin: 0;
  padding: 0;
  line-height: 0;
  background-color: initial;
  border: none;
  cursor: pointer;
}

.starIcon {
  width: 44px;
  height: 44px;
}

.starIconInactive {
  fill: $ui-color-transparent;
}

.textarea {
  margin-top: 16px;
}

.controls {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}

.button {
  width: 100%;

  & + & {
    margin-left: 10px;
  }
}
</style>
