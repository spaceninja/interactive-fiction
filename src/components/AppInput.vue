<template>
  <form class="app-input" @submit.prevent="onSubmit">
    <span class="app-input__prompt">&gt;</span>
    <input
      v-model.trim="userInput"
      class="app-input__input"
      placeholder="What do you want to do?"
    />
    <button class="app-input__submit visually-hidden">Submit</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { parser } from '../composables/useParser';

const userInput = ref('');

const onSubmit = () => {
  console.log(parser(userInput.value));
};
</script>
