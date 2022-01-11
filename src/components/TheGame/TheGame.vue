<template>(View Console)</template>

<script setup>
import { onMounted } from 'vue';
import * as g from '../../composables/useGlobal';
import * as i from '../../composables/useItem';
import * as r from '../../composables/useRoom';

onMounted(() => {
  console.log('WHAT UP DORKS???');
  console.log('main.js', r.livingRoom.value);

  r.livingRoom.value.action();

  console.log('main.js', i.rug.value);

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
});
</script>
