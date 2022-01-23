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

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import AppHelp from './components/AppHelp.vue';
import AppOutput from './components/AppOutput.vue';
import AppInput from './components/AppInput.vue';
import AppFooter from './components/AppFooter.vue';
import { showHelp, theVerb } from './composables/game/useGame';
import { Look } from './composables/game/useGameVerb';

// GO!
theVerb.value = 'Look';
Look.value.action();
</script>
