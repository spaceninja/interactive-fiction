<template>
  <span class="app-debug__verb">V: {{ theVerb }}</span>
  <span class="app-debug__object">O: {{ theObject }}</span>
  <span class="app-debug__indirect">I: {{ theIndirect }}</span>
  <button type="button" @click="testRoom">Test Room</button>
  <button type="button" @click="testParser">Test Parser</button>
</template>

<script setup>
import {
  magicFlag,
  theVerb,
  theObject,
  theIndirect,
} from '../composables/useGlobal';
import { items } from '../composables/useItem';
import { rooms } from '../composables/useRoom';
import { tokenVocabulary } from '../composables/useVocabulary';
import { handlePlayerInput } from '../composables/useGlobal';

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

  handlePlayerInput('stab the ogre');
  handlePlayerInput('kiss the elf');
  handlePlayerInput('attack the MILF');
  handlePlayerInput('attack the large carpet');
  handlePlayerInput('attack the rug');
  handlePlayerInput('attack the trap door');
  handlePlayerInput('attack the trapdoor');

  handlePlayerInput('Attack a Troll?');
  handlePlayerInput('kiss an ogre');
  handlePlayerInput('kiss of ogre');
  handlePlayerInput('kiss is ogre');
  handlePlayerInput('blow up door with dynamite');
  handlePlayerInput('climb up the rope');
  handlePlayerInput('climb down the rope');
  handlePlayerInput('climb in the coffin');
  handlePlayerInput('climb on the table');
  handlePlayerInput('climb over the barricade');
  handlePlayerInput('examine the red key');
  handlePlayerInput('examine salt and pepper');
  handlePlayerInput('get the lamp oil from under the bed');
  handlePlayerInput('give the duck the razor blade');
  handlePlayerInput('give the razor blade to the duck');
  handlePlayerInput('look at the faded picture');
  handlePlayerInput('look behind the oil painting');
  handlePlayerInput('look for the money');
  handlePlayerInput('open the wooden door with the gold key');
  handlePlayerInput('pick up the ticket');
  handlePlayerInput('plant the pot plant in the plant pot');
  handlePlayerInput('put on the jacket');
  handlePlayerInput('put down the gun');
  handlePlayerInput('put the key in the box');
  handlePlayerInput('put the key on the table');

  handlePlayerInput('take all from the basket except the chip and the socket');
  handlePlayerInput('take all from the basket');
  handlePlayerInput('take the chip from the basket');
  handlePlayerInput('talk to ford');
  handlePlayerInput('turn dial to 11');
  handlePlayerInput('turn the oil lamp off');
  handlePlayerInput('turn the oil lamp on');
  handlePlayerInput('worry about uncle otto');
  handlePlayerInput('fret about uncle otto');
  handlePlayerInput('agonize about uncle otto');
};
</script>
