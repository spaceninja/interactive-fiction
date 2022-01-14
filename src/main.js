import { createApp } from 'vue';
import './assets/main.scss';
import App from './App.vue';
import {
  allTokens,
  tokenVocabulary,
  parser,
  lex,
  toAst,
} from './composables/useParser';

createApp(App).mount('#app');

parser('Attack the Troll');
parser('blow up door with dynamite');
parser('climb up the rope');
parser('climb down the rope');
parser('climb in the coffin');
parser('climb on the table');
parser('climb over the barricade');
parser('examine the red key');
parser('examine salt and pepper');
parser('get the lamp oil from under the bed');
parser('give the duck the razor blade');
parser('give the razor blade to the duck');
parser('look at the faded picture');
parser('look behind the oil painting');
parser('look for the money');
parser('open the wooden door with the gold key');
parser('pick up the ticket');
parser('plant the pot plant in the plant pot');
parser('put on the jacket');
parser('put down the gun');
parser('put the key in the box');
parser('put the key on the table');
parser('take all from the basket except the chip and the socket');
parser('take all from the basket');
parser('take the chip from the basket');
parser('talk to ford');
parser('turn dial to 11');
parser('turn the oil lamp off');
parser('turn the oil lamp on');
parser('worry about uncle otto');
parser('fret about uncle otto');
parser('agonize about uncle otto');

console.log('ALL TOKENS', allTokens);
console.log('TOKEN VOCAB', tokenVocabulary);

console.log(lex('stab the ogre'));
console.log(lex('kiss the elf'));
console.log(lex('attack the milf'));

console.log(toAst('stab the ogre'));
console.log(toAst('kiss the elf'));
console.log(toAst('attack the milf'));
