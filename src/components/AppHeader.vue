<template>
  <header class="app-header">
    <span class="app-header__location">{{ here.name }}</span>
    <span class="app-header__score"
      >Score: {{ score }}
      <span v-if="scoreMax" class="app-header__score-max"
        >/ {{ scoreMax }}</span
      ></span
    >
    <span class="app-header__moves">Moves: {{ moves }}</span>
    <span class="app-header__help">
      <button @click="helpClick">
        <span class="visually-hidden">Help</span>
        <span aria-hidden="true">?</span>
      </button>
    </span>
  </header>
</template>

<script setup>
import {
  here,
  score,
  scoreMax,
  moves,
  showHelp,
} from '../composables/useGlobal';

const helpClick = () => {
  showHelp.value = !showHelp.value;
};
</script>
