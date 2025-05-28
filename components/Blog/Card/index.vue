<script setup lang="ts">
import type { BlogCard } from './types';


const props = defineProps<BlogCard>();
</script>

<template>
  <NuxtLink
    :to="props.route"
    :class="$style.root"
  >
    <div :class="$style.photoWrap">
      <NuxtImg
        :src="img"
        :alt="title"
        :class="$style.photo"
        placeholder="./blog-placeholder.png"
      />
    </div>

    <div :class="$style.info">
      <div
        :class="$style.title"
        v-text="props.title"
      />

      <div
        v-if="tags?.length"
        :class="$style.tagsWrap"
      >
        <ul :class="$style.tags">
          <li
            v-for="tag in tags"
            :key="tag"
            v-text="`#${tag?.toLowerCase()}`"
          />
        </ul>
      </div>
    </div>
  </NuxtLink>
</template>

<style lang="scss" module>
.root {
  @include ui-round-content-blocks;

  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  color: $ui-color-black;
  text-decoration: none;
  background-color: $ui-color-white;
  box-shadow: $box-shadow;
  transition: box-shadow .2s linear;

  @include exclude-md {

    &:hover {
      box-shadow: rgba(0, 0, 0, .1) 0 8px 16px 0;
    }
  }
}

.photoWrap {
  position: relative;
  width: 100%;
  padding-top: 60%;
}

.photo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: $ui-color-transparent;
  border: none;
}

$card-indent: 10px;

.info {
  padding: 10px;
}

.title {
  @include ui-typo-16-bold;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tagsWrap {
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tags {
  @include ui-typo-14;

  margin-top: 2px;
  display: flex;
  gap: 12px;
  color: $ui-color-text-main;
}
</style>
