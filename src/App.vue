<template>
  <AppHeader />
  <main class="app-main">
    <AppHelp v-if="showHelp" />
    <template v-else>
      <AppOutput />
      <AppInput />
    </template>
  </main>
  <AppFooter />
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
import AppHelp from './components/AppHelp.vue';
import AppOutput from './components/AppOutput.vue';
import AppInput from './components/AppInput.vue';
import AppFooter from './components/AppFooter.vue';
import { here, showHelp } from './composables/game/useGame';
import { rooms } from './composables/useRoom';
import { Look } from './composables/game/useGameVerb';

// GO!
here.value = rooms.Kitchen.value;
Look.value.action();
</script>
