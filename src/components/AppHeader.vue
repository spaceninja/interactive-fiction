<template>
  <header class="app-header">
    <h1>Interactive Fiction: {{ here }}</h1>
  </header>
</template>

<script setup>
import { here } from '../composables/useGlobal';
</script>
