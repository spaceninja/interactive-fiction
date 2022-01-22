<template>
  <section class="app-input">
    <form class="app-input__form prose" @submit.prevent="onSubmit">
      <span class="app-input__prompt">&gt;&nbsp;</span>
      <input
        v-model.trim="playerInput"
        class="app-input__input"
        placeholder="What do you want to do?"
      />
      <button class="app-input__submit visually-hidden">Submit</button>
    </form>
  </section>
</template>

<script setup>
import { playerInput, handlePlayerInput } from '../composables/game/useGame';

const onSubmit = () => {
  handlePlayerInput();
};
</script>
