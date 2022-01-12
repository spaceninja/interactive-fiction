<template>
  <form class="app-input" @submit.prevent="onSubmit">
    <input v-model="userInput" />
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import * as g from '../composables/useGlobal';
import * as i from '../composables/useItem';
import * as r from '../composables/useRoom';

const onSubmit = () => {
  r.livingRoom.value.action('look');

  i.rug.value.action('take');
  i.rug.value.action('climb on');
  i.rug.value.action('raise');
  i.rug.value.action('look under');
  i.rug.value.action('move');

  r.livingRoom.value.action('look');

  i.rug.value.action('climb on');
  i.rug.value.action('raise');
  i.rug.value.action('look under');
  i.rug.value.action('move');

  i.trapDoor.value.action('look under');
  i.trapDoor.value.action('raise');
  i.trapDoor.value.action('look under');
  i.trapDoor.value.action('close');

  g.magicFlag.value = true;

  r.livingRoom.value.action('look');
};

const userInput = ref('');
</script>
