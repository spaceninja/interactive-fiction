<template>
  <header class="app-header">
    <h1>Interactive Fiction: {{ here }} {{ theVerb }} {{ theObject }}</h1>
  </header>
</template>

<script setup>
import { here, theVerb, theObject } from '../composables/useGlobal';
</script>
