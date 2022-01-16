<template>
  <form class="app-input" @submit.prevent="onSubmit">
    <input v-model.trim="userInput" />
    <button>Submit</button>
    <button type="button" @click="testRoom">Test Room</button>
    <button type="button" @click="testParser">Test Parser</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { magicFlag, evaluate } from '../composables/useGlobal';
import { items } from '../composables/useItem';
import { rooms } from '../composables/useRoom';
import { tokenVocabulary } from '../composables/useVocabulary';
import { parser } from '../composables/useParser';

const userInput = ref('Take Rug');

const onSubmit = () => {
  parser(userInput);
  evaluate();
};

const testRoom = () => {
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

const testParser = () => {
  console.log('TOKEN VOCAB', tokenVocabulary);

  console.log(parser('stab the ogre'));
  console.log(parser('kiss the elf'));
  console.log(parser('attack the milf'));

  console.log(parser('Attack a Troll?'));
  console.log(parser('kiss an ogre'));
  console.log(parser('kiss of ogre'));
  console.log(parser('kiss is ogre'));
  console.log(parser('blow up door with dynamite'));
  console.log(parser('climb up the rope'));
  console.log(parser('climb down the rope'));
  console.log(parser('climb in the coffin'));
  console.log(parser('climb on the table'));
  console.log(parser('climb over the barricade'));
  console.log(parser('examine the red key'));
  console.log(parser('examine salt and pepper'));
  console.log(parser('get the lamp oil from under the bed'));
  console.log(parser('give the duck the razor blade'));
  console.log(parser('give the razor blade to the duck'));
  console.log(parser('look at the faded picture'));
  console.log(parser('look behind the oil painting'));
  console.log(parser('look for the money'));
  console.log(parser('open the wooden door with the gold key'));
  console.log(parser('pick up the ticket'));
  console.log(parser('plant the pot plant in the plant pot'));
  console.log(parser('put on the jacket'));
  console.log(parser('put down the gun'));
  console.log(parser('put the key in the box'));
  console.log(parser('put the key on the table'));
  console.log(
    parser('take all from the basket except the chip and the socket')
  );
  console.log(parser('take all from the basket'));
  console.log(parser('take the chip from the basket'));
  console.log(parser('talk to ford'));
  console.log(parser('turn dial to 11'));
  console.log(parser('turn the oil lamp off'));
  console.log(parser('turn the oil lamp on'));
  console.log(parser('worry about uncle otto'));
  console.log(parser('fret about uncle otto'));
  console.log(parser('agonize about uncle otto'));
};
</script>
