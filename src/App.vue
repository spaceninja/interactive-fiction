<template>
  <AppHeader />
  <main class="app-main">
    <AppOutput />
    <AppInput />
  </main>
  <AppFooter />
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
import AppOutput from './components/AppOutput.vue';
import AppInput from './components/AppInput.vue';
import AppFooter from './components/AppFooter.vue';
</script>
