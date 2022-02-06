import { ref, Ref } from 'vue';
import {
  here,
  perform,
  tell,
  held,
  theDirect,
  theIndirect,
  handlePlayerInput,
  goTo,
  winner,
} from './game/useGame';
import Item from '../classes/Item';
import Verb from '../classes/Verb';
import * as rawItems from './useItem';
// Have to redeclare these with types, which is dumb
const items = rawItems as { [key: string]: Ref<Item> };

/**
 * Verbs
 * All the commands the player can issue to the game.
 * (For special game-related verbs like "inventory" see _useGameVerb.ts).
 *
 * Keep alphabetized! Add the `priority` flag if you need the verbs sorted.
 *
 * Nothing should live in this file except Vue refs containing a Verb,
 * because the contents of this file build the list of verbs for the game.
 */

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
      const direct = items[theDirect.value].value;
      const indirect = items[theIndirect.value]?.value;
      if (!direct.flags.isActor) {
        tell(`I've known some strange people, but fighting a ${direct.name}?`);
      } else if (!indirect) {
        tell(
          `Trying to attack a ${direct.name} with your bare hands is suicidal.`
        );
      } else if (indirect.location !== winner.value.id) {
        tell(`You aren't even holding the ${indirect.name}?`);
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

export const Examine = ref(
  new Verb({
    name: 'Examine',
    synonym: ['examine', 'describe', 'what', 'whats', 'look at'],
    action: () => {
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

// "Look" is in _useGameVerb.ts

export const LookBehind = ref(
  new Verb({
    name: 'LookBehind',
    synonym: ['look behind'],
    priority: 1,
    action: () => {
      console.log('LookBehind: default handler');
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
      if (items[theDirect.value].value.flags.isContainer) {
        console.log('LOOK ON THE CONTAINER');
        perform('LookInside', theDirect.value);
        return true;
      }
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
    preaction: () => {
      if (theDirect.value in items && held(items[theDirect.value])) {
        tell("You aren't an accomplished enough juggler.");
        return true;
      }
      return false;
    },
    action: () => {
      console.log('Move: default handler');
      if (theIndirect.value) {
        perform('PushTo', theDirect.value, theIndirect.value);
        return true;
      }
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
        `Pushing the ${items[theDirect.value].value.name} doesn't seem to work.`
      );
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

export const Read = ref(
  new Verb({
    name: 'Read',
    synonym: ['read', 'skim'],
    preaction: () => {
      // TODO: use LIT?
      if (!here.value.flags.isOn) {
        tell('It is impossible to read in the dark.');
        return true;
      }
      if (
        theIndirect.value &&
        !items[theIndirect.value].value.flags.isTransparent
      ) {
        tell(
          `How does one look through a ${items[theIndirect.value].value.name}?`
        );
        return true;
      }
      return false;
    },
    action: () => {
      const item = items[theDirect.value].value;
      if (item.text) {
        tell(item.text);
        return true;
      }
      tell(`How does one read a ${item.name}?`);
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
      tell(`It smells like a ${items[theDirect.value].value.name}.`);
      return true;
    },
  })
);

export const Walk = ref(
  new Verb({
    name: 'Walk',
    synonym: ['walk', 'go', 'run', 'proceed', 'step'],
    action: () => {
      const direction = theDirect.value;
      console.log('Walk: default handler', direction);
      const exit = here.value.exits[direction];
      if (!exit) {
        tell("You can't go that way.");
        return true;
      }
      // Door Exit — goTo room if door is open, else tell fail
      if ('door' in exit) {
        const door = items[exit.door].value;
        const result = door.flags.isOpen;
        if (result) {
          goTo(exit.room);
          return true;
        }
        tell(exit.fail ? exit.fail : `The ${door.name} is closed.`);
        return true;
      }
      // Conditional Exit — goTo room if true, else tell fail
      if ('condition' in exit) {
        const result = exit.condition();
        if (result) {
          goTo(exit.room);
          return true;
        }
        tell(exit.fail ? exit.fail : "You can't go that way.");
        return true;
      }
      // Method Exit - call method, which returns either a room or a fail string
      if ('method' in exit) {
        const result = exit.method();
        if (result) {
          if ('room' in result) {
            goTo(result.room);
            return true;
          }
          tell(result.fail ? result.fail : "You can't go that way.");
          return true;
        }
        console.error("Whoops, our exit method didn't return any result!");
        tell("You can't go that way.");
        return true;
      }
      // Unconditional Exit - goTo room
      if ('room' in exit) {
        goTo(exit.room);
        return true;
      }
      // Unconditional Non-Exit - tell fail or generic error
      if ('fail' in exit) {
        tell(exit.fail ? exit.fail : "You can't go that way.");
        return true;
      }
      return false;
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
