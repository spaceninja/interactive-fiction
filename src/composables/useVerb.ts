import { ref } from 'vue';
import Verb from '../classes/Verb';
import {
  here,
  perform,
  tell,
  theDirect,
  theIndirect,
  handlePlayerInput,
} from './game/useGame';
import * as items from './useItem';
import * as rooms from './useRoom';

export const Attack = ref(
  new Verb({
    name: 'Attack',
    synonym: [
      'attack',
      'kill',
      'murder',
      'slay',
      'dispatch',
      'stab',
      'knock down',
      'strike',
    ],
    action: () => {
      console.log('Attack: default handler');
      // @ts-ignore
      const direct = items[theDirect.value].value;
      // @ts-ignore
      const indirect = items[theIndirect.value]?.value;
      if (!direct.flags.isActor) {
        tell(`I've known some strange people, but fighting a ${direct.name}?`);
      } else if (!indirect) {
        tell(
          `Trying to attack a ${direct.name} with your bare hands is suicidal.`
        );
        // TODO: get WINNER working
        // } else if (indirect.location !== winner.value.id) {
        //   tell(`You aren't even holding the ${indirect.name}?`);
      } else if (!indirect.flags.isWeapon) {
        tell(
          `Trying to attack a ${direct.name} with a ${indirect.name} is suicidal.`
        );
      } else {
        // TODO: add attack method here
        tell("You can't.");
      }
      return true;
    },
    test: () => {
      handlePlayerInput('attack the rug');
      handlePlayerInput('attack troll');
      handlePlayerInput('attack troll with garlic');
      handlePlayerInput('attack troll with sword');
      return true;
    },
  })
);

export const Walk = ref(
  new Verb({
    name: 'Walk',
    synonym: ['walk', 'go', 'run', 'proceed', 'step'],
    action: () => {
      console.log('Walk: default handler');
      if (!theDirect.value) {
        console.log('Missing destination!');
        tell('WALK WHERE?');
        return true;
      }
      // @ts-ignore
      here.value = rooms[theDirect.value].value;
      // TODO handle lighting
      // TODO handle NPCs
      // TODO handle scoring
      perform('Look');
      return true;
    },
  })
);

export const PushTo = ref(
  new Verb({
    name: 'PushTo',
    synonym: ['push to'],
    priority: 1,
    action: () => {
      console.log('PushTo: default handler');
      tell("You can't push things to that.");
      return true;
    },
  })
);

export const Push = ref(
  new Verb({
    name: 'Push',
    synonym: ['push on', 'push', 'press on', 'press'],
    action: () => {
      console.log('Push: default handler');
      if (theIndirect.value) {
        perform('PushTo', theDirect.value, theIndirect.value);
        return true;
      }
      tell(
        // @ts-ignore
        `Pushing the ${items[theDirect.value].value.name} doesn't seem to work.`
      );
      return true;
    },
  })
);

export const Move = ref(
  new Verb({
    name: 'Move',
    synonym: [
      'move',
      'roll up',
      'roll',
      'pull up',
      'pull on',
      'pull',
      'tug on',
      'tug up',
      'tug',
      'yank on',
      'yank up',
      'yank',
    ],
    action: () => {
      console.log('Move: default handler');
      if (theIndirect.value) {
        perform('PushTo', theDirect.value, theIndirect.value);
        return true;
      }
      // @ts-ignore
      const item = items[theDirect.value].value;
      if (item.flags.takeBit) {
        tell(`Moving the ${item.name} reveals nothing.`);
        return true;
      }
      tell(`You can't move the ${item.name}.`);
      return true;
    },
  })
);

export const Kiss = ref(
  new Verb({
    name: 'Kiss',
    synonym: ['kiss', 'make out with', 'smooch', 'hug', 'flirt with'],
    action: () => {
      console.log('Kiss: default handler');
      tell("I'd sooner kiss a pig.");
      return true;
    },
  })
);

export const Smell = ref(
  new Verb({
    name: 'Smell',
    synonym: ['smell', 'sniff'],
    action: () => {
      console.log('Smell: default handler');
      // @ts-ignore
      tell(`It smells like a ${items[theDirect.value].value.name}.`);
      return true;
    },
  })
);

export const Read = ref(
  new Verb({
    name: 'Read',
    synonym: ['read', 'skim'],
    action: () => {
      // @ts-ignore
      const item = items[theDirect.value].value;
      // TODO: use LIT?
      if (!here.value.flags.isOn) {
        tell('It is impossible to read in the dark.');
        return true;
      }
      if (item.text) {
        tell(item.text);
        return true;
      }
      tell(`How does one read a ${item.name}?`);
      return true;
    },
  })
);

export const Yell = ref(
  new Verb({
    name: 'Yell',
    synonym: ['yell', 'shout', 'holler', 'berate'],
    action: () => {
      console.log('Yell: default handler');
      tell('Aaaarrrrgggghhhh!');
      return true;
    },
  })
);

export const LookBehind = ref(
  new Verb({
    name: 'LookBehind',
    synonym: ['look behind'],
    priority: 1,
    action: () => {
      console.log('LookBehind: default handler');
      // @ts-ignore
      tell(`There is nothing behind the ${items[theDirect.value].value.name}.`);
      return true;
    },
  })
);

export const LookOn = ref(
  new Verb({
    name: 'LookOn',
    synonym: ['look on'],
    priority: 1,
    action: () => {
      console.log('LookOn: default handler');
      // @ts-ignore
      if (items[theDirect.value].value.flags.isContainer) {
        console.log('LOOK ON THE CONTAINER');
        perform('LookInside', theDirect.value);
        return true;
      }
      // @ts-ignore
      tell(`Look on a  ${items[theDirect.value].value.name}???`);
      return true;
    },
  })
);

export const LookUnder = ref(
  new Verb({
    name: 'LookUnder',
    synonym: ['look under'],
    priority: 1,
    action: () => {
      console.log('LookUnder: default handler');
      tell('There is nothing but dust there.');
      return true;
    },
  })
);
export const Examine = ref(
  new Verb({
    name: 'Examine',
    synonym: ['examine', 'describe', 'what', 'whats', 'look at'],
    action: () => {
      // @ts-ignore
      const item = items[theDirect.value].value;
      if (item.text) {
        tell(item.text);
        return true;
      }
      if (item.flags?.isContainer || item.flags?.isDoor) {
        perform('LookInside', theDirect.value);
        return true;
      }
      tell(`There's nothing special about the ${item.name}.`);
      return true;
    },
    test: () => {
      // test an item with text
      handlePlayerInput('look at map');
      // test a closed container
      handlePlayerInput('examine smelly sack');
      // test a transparent container
      handlePlayerInput('describe bottle');
      // test a door
      handlePlayerInput('look at trap door');
      // test a regular item
      handlePlayerInput('look at sword');
      return true;
    },
  })
);
