<template>
  <ul class="app-output">
    <li
      v-for="{ message, className, key } in theOutput"
      :key="key"
      :class="['prose', className]"
    >
      {{ message }}
    </li>
  </ul>
</template>

<script setup>
import { watch, nextTick } from 'vue';
import { theOutput } from '../composables/game/useGame';

const scrollToBottom = () => {
  const lastOutputEl = document.querySelector('.app-output :last-child');
  lastOutputEl.scrollIntoView({ behavior: 'smooth' });
};

watch(
  () => theOutput,
  async () => {
    await nextTick();
    scrollToBottom();
  },
  { deep: true }
);
</script>
