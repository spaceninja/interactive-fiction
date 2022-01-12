<template>
  <form class="app-input" @submit.prevent="onSubmit">
    <input v-model.trim="userInput" />
    <button>Submit</button>
    <button type="button" @click="onTest">Test</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import {
  magicFlag,
  theVerb,
  theObject,
  evaluate,
} from '../composables/useGlobal';
import { items } from '../composables/useItem';
import { rooms } from '../composables/useRoom';

const onSubmit = () => {
  const userInputTokens = userInput.value.toLowerCase().split(' ');
  console.log(userInputTokens);
  theVerb.value = userInputTokens[0];
  theObject.value = userInputTokens[1];
  evaluate();
};

const onTest = () => {
  rooms.livingRoom.value.action('look');

  items.rug.value.action('take');
  items.rug.value.action('climb on');
  items.rug.value.action('raise');
  items.rug.value.action('look under');
  items.rug.value.action('move');

  rooms.livingRoom.value.action('look');

  items.rug.value.action('climb on');
  items.rug.value.action('raise');
  items.rug.value.action('look under');
  items.rug.value.action('move');

  items.trapDoor.value.action('look under');
  items.trapDoor.value.action('raise');
  items.trapDoor.value.action('look under');
  items.trapDoor.value.action('close');

  magicFlag.value = true;

  rooms.livingRoom.value.action('look');
};

const userInput = ref('Take Rug');
</script>
