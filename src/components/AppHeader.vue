<template>
  <header class="app-header">
    <span class="app-header__location">{{ here.name }}</span>
    <span class="app-header__score"
      >Score: {{ theScore }}
      <span v-if="theScoreMax" class="app-header__score-max"
        >/ {{ theScoreMax }}</span
      ></span
    >
    <span class="app-header__moves">Moves: {{ theMoves }}</span>
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
  theScore,
  theScoreMax,
  theMoves,
  showHelp,
} from '../composables/useGlobal';

const helpClick = () => {
  showHelp.value = !showHelp.value;
};
</script>
