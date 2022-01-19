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
import { here, showHelp, tell } from './composables/useGlobal';
import { LivingRoom } from './composables/useRoom';
import { Look } from './composables/useMetaVerb';

// GO!
here.value = LivingRoom.value;
Look.value.action();
</script>
