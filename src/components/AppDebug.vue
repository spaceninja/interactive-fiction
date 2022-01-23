<template>
  <span class="app-debug__verb">V: {{ theVerb }}</span>
  <span class="app-debug__object">O: {{ theDirect }}</span>
  <span class="app-debug__indirect">I: {{ theIndirect }}</span>
  <button type="button" @click="testRoom">Test Room</button>
  <button type="button" @click="testParser">Test Parser</button>
</template>

<script setup lang="ts">
import {
  here,
  magicFlag,
  theVerb,
  theDirect,
  theIndirect,
} from '../composables/game/useGame';
import * as rooms from '../composables/useRoom';
import { tokenVocabulary } from '../composables/game/useParserVocabulary';
import { handlePlayerInput } from '../composables/game/useGame';

const testRoom = () => {
  here.value = rooms.LivingRoom.value;
  handlePlayerInput('look');

  handlePlayerInput('take rug');
  handlePlayerInput('climb on rug');
  handlePlayerInput('raise rug');
  handlePlayerInput('look under rug');
  handlePlayerInput('move rug');

  handlePlayerInput('look');

  handlePlayerInput('climb on rug');
  handlePlayerInput('raise rug');
  handlePlayerInput('look under rug');
  handlePlayerInput('move rug');

  handlePlayerInput('look under trap door');
  handlePlayerInput('raise trap door');
  handlePlayerInput('look under trap door');
  handlePlayerInput('close trap door');

  magicFlag.value = true;
  handlePlayerInput('look');
};

const testParser = () => {
  console.log('TOKEN VOCAB', tokenVocabulary);

  handlePlayerInput('yell at the ugly troll');
  handlePlayerInput('holler at the elf');
  handlePlayerInput('smooch the pretty elf');
  handlePlayerInput('kill the ogre');

  handlePlayerInput('yell at the MILF');
  handlePlayerInput('yell at the large carpet');
  handlePlayerInput('yell at the Rug');
  handlePlayerInput('yell at the trap door');
  handlePlayerInput('yell at the TrapDoor');

  handlePlayerInput('yell at a Troll?');
  handlePlayerInput('kiss an ogre');
  handlePlayerInput('kiss of ogre');
  handlePlayerInput('kiss is ogre');
  handlePlayerInput('examine blade');
  handlePlayerInput('examine antique blade');
  handlePlayerInput('examine nasty blade');
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
