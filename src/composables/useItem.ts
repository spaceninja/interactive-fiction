import { ref } from 'vue';
import Item from '../classes/Item';
import { pickOne } from '../helpers/pickOne';
import {
  theVerb,
  here,
  openClose,
  tell,
  dummyMessages,
  theDirect,
  perform,
  handlePlayerInput,
  theIndirect,
  goTo,
} from './game/useGame';
import * as rooms from './useRoom';

/**
 * Items
 * All the items that live in the game that the player can interact with.
 *
 * Nothing should live in this file except Vue refs containing an Item,
 * because the contents of this file build the list of items for the game.
 */

/*
export const Something = ref(
  new Item({
    name: 'some thing',
    id: 'Something',
    location: 'Somewhere',
    synonym: [],
    flags: {},
    action: () => {},
  })
);
*/

export const Elf = ref(
  new Item({
    name: 'elf',
    id: 'Elf',
    location: 'Cellar',
    synonym: ['elf', 'drow'],
    adjective: ['pretty', 'fancy'],
    flags: {},
    action: () => {
      console.log('Elf handler', theVerb.value);
      switch (theVerb.value) {
        case 'Kiss':
          console.log('Elf: kiss handler');
          tell('The elf enthusiastically agrees to make out with you.');
          return true;
        default:
          console.log('Elf: default handler');
          return false;
      }
    },
  })
);

export const Troll = ref(
  new Item({
    name: 'troll',
    id: 'Troll',
    location: 'TrollRoom',
    synonym: ['troll', 'ogre'],
    adjective: ['nasty', 'ugly', 'smelly'],
    description:
      'A nasty-looking troll, brandishing a bloody axe, blocks all passages out of the room.',
    flags: { isActor: true, isOpen: true, tryTakeBit: true },
    action: () => {
      console.log('Troll handler', theVerb.value);
      switch (theVerb.value) {
        case 'Yell':
          tell(
            'Excited to finally find a competitor in a shouting competition, the Troll yells back at you even louder.'
          );
          return true;
        case 'Tell':
          tell("The troll isn't much of a conversationalist.");
          return true;
        case 'Examine':
          tell("The Troll doesn't like the way you're looking at him.");
          return true;
        default:
          console.log('Troll: default handler');
          return false;
      }
    },
    test: () => {
      tell("The troll doesn't like being tested!");
      return true;
    },
  })
);

export const Rope = ref(
  new Item({
    name: 'rope',
    id: 'Rope',
    location: 'Attic',
    synonym: ['rope', 'hemp', 'coil'],
    adjective: ['large'],
    flags: { takeBit: true, tryTakeBit: true },
    initialDescription: 'A large coil of rope is lying in the corner.',
    size: 10,
    action: () => {
      switch (theVerb.value) {
        case 'Tie':
          tell("You can't tie the rope to that.");
          return true;
        default:
          return false;
      }
    },
  })
);

export const AtticTable = ref(
  new Item({
    name: 'table',
    id: 'AtticTable',
    location: 'Attic',
    synonym: ['table'],
    flags: {
      doNotDescribe: true,
      isContainer: true,
      isOpen: true,
      isSurface: true,
    },
    capacity: 40,
    action: () => false,
  })
);

export const Knife = ref(
  new Item({
    name: 'nasty knife',
    id: 'Knife',
    location: 'AtticTable',
    synonym: ['knives', 'knife', 'blade'],
    adjective: ['nasty', 'unrusty'],
    flags: { takeBit: true, isWeapon: true, tryTakeBit: true },
    initialDescription: 'On the table is a nasty-looking knife.',
    action: () => {
      switch (theVerb.value) {
        case 'Take':
          AtticTable.value.flags.doNotDescribe = false;
          return false;
        default:
          return false;
      }
    },
  })
);

export const TrophyCase = ref(
  new Item({
    name: 'trophy case',
    id: 'TrophyCase',
    location: 'LivingRoom',
    synonym: ['case'],
    adjective: ['trophy'],
    flags: {
      isTransparent: true,
      isContainer: true,
      doNotDescribe: true,
      tryTakeBit: true,
      searchBit: true,
    },
    capacity: 1000,
    priority: 99,
    action: () => {
      switch (theVerb.value) {
        case 'Take':
          if (theDirect.value === TrophyCase.value.id) {
            tell('The trophy case is securely fastened to the wall.');
            return true;
          }
          return false;
        default:
          return false;
      }
    },
  })
);

export const Map = ref(
  new Item({
    name: 'ancient map',
    id: 'Map',
    location: 'TrophyCase',
    synonym: ['parchment', 'map'],
    adjective: ['antique', 'old', 'ancient'],
    flags: { isInvisible: true, readBit: true, takeBit: true },
    initialDescription:
      'In the trophy case is an ancient parchment which appears to be a map.',
    size: 2,
    text: `The map shows a forest with three clearings.
           The largest clearing contains a house.
           Three paths leave the large clearing.
           One of these paths, leading southwest, is marked "To Stone Barrow".`,
    action: () => false,
  })
);

export const Nails = ref(
  new Item({
    name: 'nails',
    id: 'Nails',
    location: 'LivingRoom',
    synonym: ['nails', 'nail'],
    flags: { doNotDescribe: true },
    action: () => {
      switch (theVerb.value) {
        case 'Take':
          tell('The nails, deeply embedded in the door, cannot be removed.');
          return true;
        default:
          return false;
      }
    },
  })
);

export const Board = ref(
  new Item({
    name: 'board',
    id: 'Board',
    location: 'LocalGlobals',
    synonym: ['boards', 'board'],
    flags: { doNotDescribe: true },
    action: () => {
      switch (theVerb.value) {
        case 'Take':
          tell('The boards are securely fastened.');
          return true;
        default:
          return false;
      }
    },
  })
);

export const BoardedWindow = ref(
  new Item({
    name: 'boarded window',
    id: 'BoardedWindow',
    location: 'LocalGlobals',
    synonym: ['window'],
    adjective: ['boarded'],
    flags: { doNotDescribe: true },
    action: () => {
      switch (theVerb.value) {
        case 'Open':
          tell("The windows are boarded and can't be opened.");
          return true;
        case 'Destroy':
          tell("You can't break the windows open.");
          return true;
        default:
          return false;
      }
    },
  })
);

export const WhiteHouse = ref(
  new Item({
    name: 'white house',
    id: 'WhiteHouse',
    location: 'LocalGlobals',
    synonym: ['house'],
    adjective: ['white', 'beautiful', 'colonial'],
    flags: { doNotDescribe: true },
    action: () => {
      switch (theVerb.value) {
        case 'Find':
          if (
            [
              rooms.Kitchen.value.id,
              rooms.LivingRoom.value.id,
              rooms.Attic.value.id,
            ].includes(here.value.id)
          ) {
            tell('Why not find your brains?');
            return true;
          }
          if (
            [
              rooms.EastOfHouse.value.id,
              rooms.WestOfHouse.value.id,
              rooms.NorthOfHouse.value.id,
              rooms.SouthOfHouse.value.id,
            ].includes(here.value.id)
          ) {
            tell("It's right here! Are you blind or something?");
            return true;
          }
          return false;
        case 'Examine':
          tell(`The house is a beautiful colonial house which is painted white.
            It is clear that the owners must have been extremely wealthy.`);
          return true;
        case 'Through':
        case 'Open':
          if (here.value.id === rooms.EastOfHouse.value.id) {
            if (KitchenWindow.value.flags.isOpen) {
              goTo(rooms.Kitchen.value.id);
            } else {
              tell('The window is closed.');
            }
          } else {
            tell("I can't see how to get in from here.");
          }
          return true;
        case 'Burn':
          tell('You must be joking.');
          return true;
        default:
          return false;
      }
    },
  })
);

export const FrontDoor = ref(
  new Item({
    name: 'door',
    id: 'FrontDoor',
    location: 'WestOfHouse',
    synonym: ['door'],
    flags: { isDoor: true, doNotDescribe: true },
    action: () => {
      switch (theVerb.value) {
        case 'Open':
          tell('The door cannot be opened.');
          return true;
        case 'Burn':
          tell('You cannot burn this door.');
          return true;
        case 'Destroy':
          tell("You can't seem to damage the door.");
          return true;
        case 'LookBehind':
          tell("It won't open.");
          return true;
        default:
          return false;
      }
    },
  })
);

export const Mailbox = ref(
  new Item({
    name: 'small mailbox',
    id: 'Mailbox',
    location: 'WestOfHouse',
    synonym: ['mailbox', 'box'],
    adjective: ['small'],
    flags: { isContainer: true, tryTakeBit: true },
    capacity: 10,
    priority: 1,
    action: () => {
      switch (theVerb.value) {
        case 'Take':
          if (theDirect.value === Mailbox.value.id) {
            tell('It is securely anchored.');
            return true;
          }
          return false;
        default:
          return false;
      }
    },
    test: () => {
      tell('You tested the mailbox!');
      return true;
    },
  })
);

export const Advertisement = ref(
  new Item({
    name: 'leaflet',
    id: 'Advertisement',
    location: 'Mailbox',
    synonym: ['advertisement', 'leaflet', 'booklet', 'mail'],
    adjective: ['small'],
    description: 'A small leaflet is on the ground.',
    size: 2,
    flags: { burnBit: true, takeBit: true, readBit: true },
    capacity: 10,
    text: `"WELCOME TO ZORK! ZORK is a game of adventure, danger, and low cunning.
      In it you will explore some of the most amazing territory ever seen by mortals.
      No computer should be without one!"`,
    action: () => false,
    test: () => {
      tell('You tested the leaflet!');
      return true;
    },
  })
);

export const KitchenWindow = ref(
  new Item({
    name: 'kitchen window',
    id: 'KitchenWindow',
    location: 'LocalGlobals',
    synonym: ['window'],
    adjective: ['kitchen', 'small'],
    flags: { isDoor: true, doNotDescribe: true, isOpen: false },
    action: () => {
      switch (theVerb.value) {
        case 'Open':
        case 'Close':
          openClose(
            KitchenWindow,
            theVerb.value,
            'With great effort, you open the window far enough to allow entry.',
            'The window closes (more easily than it opened).'
          );
          return true;
        case 'Examine':
          if (!KitchenWindow.value.flags.isOpen) {
            tell('The window is slightly ajar, but not enough to allow entry.');
            return true;
          }
          return false;
        case 'Walk':
        case 'Board':
        case 'Through':
          if (here.value.id === rooms.Kitchen.value.id) {
            perform('Walk', 'east');
          } else {
            perform('Walk', 'west');
          }
          return true;
        case 'LookInside':
          if (here.value.id === rooms.Kitchen.value.id) {
            tell('You can see a clear area outside the house.');
          } else {
            tell('You can see what appears to be a kitchen.');
          }
          return true;
        default:
          return false;
      }
    },
  })
);

export const Lamp = ref(
  new Item({
    name: 'brass lantern',
    id: 'Lamp',
    location: 'LivingRoom',
    synonym: ['lamp', 'lantern', 'light'],
    adjective: ['brass'],
    flags: { takeBit: true, isLight: true },
    size: 15,
    priority: 1,
    description: 'There is a brass lantern (battery-powered) here.',
    initialDescription:
      'A battery-powered brass lantern is on the trophy case.',
    action: () => {
      switch (theVerb.value) {
        case 'Throw':
          tell(
            'The lamp has smashed into the floor, and the light has gone out.'
          );
          // TODO: handle removing queued event
          // dequeue('iLantern');
          Lamp.value.location = null;
          BrokenLamp.value.location = here.value.id;
          return true;
        case 'LampOn':
          if (Lamp.value.flags.isDestroyed) {
            tell("A burned-out lamp won't light");
            return true;
          }
          // TODO: V-LAMP-ON
          // TODO: handle queued event
          // queue('iLantern');
          return false;
        case 'LampOff':
          if (Lamp.value.flags.isDestroyed) {
            tell('The lamp has already burned out.');
            return true;
          }
          // TODO: V-LAMP-OFF
          // TODO: handle removing queued event
          // dequeue('iLantern');
          return false;
        case 'Examine':
          if (Lamp.value.flags.isDestroyed) {
            tell('The lamp has burned out.');
          } else if (Lamp.value.flags.isOn) {
            tell('The lamp is on.');
          } else {
            tell('The lamp is turned off.');
          }
          return true;
        default:
          return false;
      }
    },
    test: () => {
      handlePlayerInput('examine brass lantern');
      handlePlayerInput('turn on brass lantern');
      handlePlayerInput('examine brass lantern');
      handlePlayerInput('turn off brass lantern');
      handlePlayerInput('throw brass lantern');
      handlePlayerInput('examine brass lantern');
      return true;
    },
  })
);

export const BrokenLamp = ref(
  new Item({
    name: 'broken lantern',
    id: 'BrokenLamp',
    location: null,
    synonym: ['lamp', 'lantern'],
    adjective: ['broken'],
    flags: { takeBit: true },
    action: () => false,
  })
);

export const WoodenDoor = ref(
  new Item({
    name: 'wooden door',
    id: 'WoodenDoor',
    location: 'LivingRoom',
    synonym: ['door', 'lettering', 'writing'],
    adjective: ['wooden', 'gothic', 'strange', 'west'],
    flags: {
      readBit: true,
      isDoor: true,
      doNotDescribe: true,
      isTransparent: true,
    },
    text: 'The engravings translate to "This space intentionally left blank."',
    action: () => {
      switch (theVerb.value) {
        case 'Open':
          tell('The door cannot be opened.');
          return true;
        case 'Burn':
          tell('You cannot burn this door.');
          return true;
        case 'Destroy':
          tell("You can't seem to damage the door.");
          return true;
        case 'LookBehind':
          tell("It won't open.");
          return true;
        default:
          return false;
      }
    },
    test: () => {
      handlePlayerInput('open strange door');
      handlePlayerInput('burn strange door');
      handlePlayerInput('destroy strange door');
      handlePlayerInput('look behind strange door');
      return true;
    },
  })
);

export const Sword = ref(
  new Item({
    name: 'sword',
    id: 'Sword',
    location: 'LivingRoom',
    synonym: ['sword', 'orcrist', 'glamdring', 'blade'],
    adjective: ['elvish', 'old', 'antique'],
    flags: { takeBit: true, isWeapon: true, tryTakeBit: true },
    size: 30,
    // tValue: 0,
    initialDescription:
      'Above the trophy case hangs an elvish sword of great antiquity.',
    action: () => {
      switch (theVerb.value) {
        case 'Take':
          // TODO: handle queued event
          // if (winner.value === adventurer.value) {
          //   queue('iSword', -1);
          // }
          return false;
        case 'Examine':
          // if (Sword.value.tValue === 1) {
          //   tell('Your sword is glowing with a faint blue glow.');
          //   return true;
          // }
          // if (Sword.value.tValue === 2) {
          //   tell('Your sword is glowing very brightly.');
          //   return true;
          // }
          return false;
        default:
          return false;
      }
    },
  })
);

export const Garlic = ref(
  new Item({
    name: 'clove of garlic',
    id: 'Garlic',
    location: 'SandwichBag',
    synonym: ['garlic', 'clove'],
    flags: { takeBit: true, foodBit: true },
    size: 4,
    action: () => {
      console.log('Garlic Handler', theVerb.value);
      switch (theVerb.value) {
        case 'Eat':
          Garlic.value.location = null;
          tell(
            "What the heck! You won't make friends this way, but nobody around here is too friendly anyhow. Gulp!"
          );
          return true;
        default:
          return false;
      }
    },
  })
);

export const Lunch = ref(
  new Item({
    name: 'lunch',
    id: 'Lunch',
    location: 'SandwichBag',
    synonym: ['food', 'sandwich', 'lunch', 'dinner'],
    adjective: ['hot', 'pepper'],
    flags: { takeBit: true, foodBit: true },
    description: 'A hot pepper sandwich is here.',
    action: () => false,
  })
);

export const SandwichBag = ref(
  new Item({
    name: 'brown sack',
    id: 'SandwichBag',
    location: 'KitchenTable',
    synonym: ['bag', 'sack'],
    adjective: ['brown', 'elongated', 'smelly'],
    flags: { takeBit: true, isContainer: true, burnBit: true, isOpen: false },
    initialDescription:
      'On the table is an elongated brown sack, smelling of hot peppers.',
    capacity: 9,
    size: 9,
    priority: 1,
    action: () => {
      console.log('Sandwich Bag Handler', theVerb.value);
      switch (theVerb.value) {
        case 'Smell':
          if (Lunch.value.location === SandwichBag.value.id) {
            tell('It smells of hot peppers.');
            return true;
          }
          return false;
        default:
          return false;
      }
    },
  })
);

export const Water = ref(
  new Item({
    name: 'quantity of water',
    id: 'Water',
    location: 'Bottle',
    synonym: ['water', 'quantity', 'liquid', 'h2o'],
    flags: { tryTakeBit: true, takeBit: true, drinkBit: true },
    size: 4,
    action: () => {
      // TODO add these
      return false;
    },
  })
);

export const Bottle = ref(
  new Item({
    name: 'glass bottle',
    id: 'Bottle',
    location: 'KitchenTable',
    synonym: ['bottle', 'container'],
    adjective: ['clear', 'glass'],
    flags: { takeBit: true, isTransparent: true, isContainer: true },
    initialDescription: 'A bottle is sitting on the table.',
    capacity: 4,
    action: () => {
      console.log('Bottle Handler', theVerb.value);
      let empty = false;
      switch (theVerb.value) {
        case 'Throw':
          if (theDirect.value === 'Bottle') {
            empty = true;
            Bottle.value.location = null;
            tell('The bottle hits the far wall and shatters.');
          }
          return false;
        case 'Destroy':
          empty = true;
          Bottle.value.location = null;
          tell('A brilliant maneuver destroys the bottle.');
          return false;
        case 'Open':
          Bottle.value.flags.isOpen = true;
          console.log('OPEN', Bottle.value.flags);
          tell('You open the bottle');
          return false;
        case 'Shake':
          console.log('SHAKE', Bottle.value.flags);
          if (Bottle.value.flags.isOpen && Water.value.location === 'Bottle') {
            console.log('HANDLE WATER');
            empty = true;
            tell(
              'You shake the bottle as hard as you can, spraying water everywhere.'
            );
          } else {
            tell('You shake the bottle to no effect.');
          }
          return false;
        default:
          return false;
      }
      // TODO: unreachable!
      if (empty === true && Water.value.location === 'Bottle') {
        Water.value.location = null;
        tell('The water spills to the floor and evaporates.');
      }
      return true;
    },
    test: () => {
      theDirect.value = 'Bottle';

      tell('> throw bottle', 'command');
      theVerb.value = 'Throw';
      Bottle.value.action();

      tell('> destroy bottle', 'command');
      Water.value.location = 'Bottle';
      theVerb.value = 'Destroy';
      Bottle.value.action();

      tell('> shake bottle', 'command');
      Water.value.location = 'Bottle';
      theVerb.value = 'Shake';
      Bottle.value.action();

      tell('> open bottle', 'command');
      Water.value.location = 'Bottle';
      theVerb.value = 'Open';
      Bottle.value.action();

      tell('> shake bottle', 'command');
      Water.value.location = 'Bottle';
      theVerb.value = 'Shake';
      Bottle.value.action();

      return true;
    },
  })
);

export const KitchenTable = ref(
  new Item({
    name: 'kitchen table',
    id: 'KitchenTable',
    location: 'Kitchen',
    synonym: ['table'],
    adjective: ['kitchen'],
    flags: {
      doNotDescribe: true,
      isContainer: true,
      isOpen: true,
      isSurface: true,
    },
    capacity: 50,
    action: () => false,
  })
);

export const OwnersManual = ref(
  new Item({
    name: "owner's manual",
    id: 'OwnersManual',
    location: 'LivingRoom',
    synonym: ['manual', 'piece of paper', 'paper'],
    adjective: ['zork', "owner's", 'small'],
    description: "ZORK owner's manual",
    flags: { readBit: true, takeBit: true },
    initialDescription: 'Loosely attached to a wall is a small piece of paper.',
    text: `Congratulations! You are the privileged owner of ZORK I:
      The Great Underground Empire, a self-contained and self-maintaining universe.
      If used and maintained in accordance with normal operating practices for
      small universes, ZORK will provide many months of trouble-free operation.`,
    action: () => false,
  })
);

export const TrapDoor = ref(
  new Item({
    name: 'trap door',
    id: 'TrapDoor',
    location: 'LivingRoom',
    synonym: ['door', 'trapdoor', 'trap-door', 'cover'],
    adjective: ['trap', 'dusty'],
    flags: {
      isDoor: true,
      doNotDescribe: true,
      isInvisible: true,
      isOpen: false,
    },
    action: () => {
      console.log('Trap Door Handler', theVerb.value);
      switch (theVerb.value) {
        case 'Raise':
        case 'Unlock':
        case 'Push':
        case 'Move':
          perform(
            TrapDoor.value.flags.isOpen ? 'Close' : 'Open',
            TrapDoor.value.id
          );
          return true;
        case 'Open':
        case 'Close':
          console.log('OPEN OR CLOSE TRAP DOOR');
          if (here.value.id === 'LivingRoom') {
            openClose(
              TrapDoor,
              theVerb.value,
              'The door reluctantly opens to reveal a rickety staircase descending into darkness.',
              'The door swings shut and closes.'
            );
          } else if (here.value.id === 'Cellar') {
            if (!TrapDoor.value.flags.isOpen) {
              if (theVerb.value === 'Open') {
                tell('The door is locked from above.');
              } else {
                TrapDoor.value.flags.isTouched = false;
                TrapDoor.value.flags.isOpen = false;
                tell('The door closes and locks.');
              }
              tell(pickOne(dummyMessages));
            }
          }
          return true;
        case 'LookUnder':
        case 'LookInside':
          console.log('LOOK UNDER TRAP DOOR', here.value.name);
          if (here.value.name !== 'Living Room') return false;
          if (TrapDoor.value.flags.isOpen) {
            tell('You see a rickety staircase descending into darkness.');
          } else {
            tell("It's closed.");
          }
          return true;
        default:
          return false;
      }
    },
    test: () => {
      here.value = rooms.LivingRoom.value;
      handlePlayerInput('look under trap door');
      handlePlayerInput('move trap door');
      handlePlayerInput('look under trap door');
      handlePlayerInput('push trap door');
      return true;
    },
  })
);

export const Rug = ref(
  new Item({
    name: 'carpet',
    id: 'Rug',
    location: 'LivingRoom',
    synonym: ['rug', 'carpet'],
    adjective: ['large', 'oriental'],
    flags: { doNotDescribe: true, tryTakeBit: true, isMoved: false },
    action: () => {
      console.log('Rug Handler', theVerb.value);
      switch (theVerb.value) {
        case 'Raise':
          console.log('RAISE RUG');
          tell(
            `The rug is too heavy to lift${
              Rug.value.flags.isMoved
                ? '.'
                : ', but in trying to take it you have noticed an irregularity beneath it.'
            }`
          );
          return false;
        case 'Move':
        case 'Push':
          console.log('MOVE OR PUSH RUG');
          if (Rug.value.flags.isMoved) {
            tell(
              'Having moved the rug previously, you find it impossible to move it again.'
            );
          } else {
            tell(
              'With a great effort, the rug is moved to one side of the room, revealing the dusty cover of a closed trap door.'
            );
            Rug.value.flags.isMoved = true;
            TrapDoor.value.flags.isInvisible = false;
            // this-is-it trap-door
          }
          return true;
        case 'Take':
          console.log('TAKE RUG');
          tell('The rug is extremely heavy and cannot be carried.');
          return true;
        case 'LookUnder':
          console.log('LOOK UNDER RUG');
          if (!Rug.value.flags.isMoved && !TrapDoor.value.flags.isOpen) {
            tell(
              'Underneath the rug is a closed trap door. As you drop the corner of the rug, the trap door is once again concealed from view.'
            );
          } else {
            tell(
              'Having moved the rug previously, there is nothing to see under it.'
            );
          }
          return true;
        case 'ClimbOn':
          console.log('CLIMB ON RUG');
          if (!Rug.value.flags.isMoved && !TrapDoor.value.flags.isOpen) {
            tell(
              'As you sit, you notice an irregularity underneath it. Rather than be uncomfortable, you stand up again.'
            );
          } else {
            tell("I suppose you think it's a magic carpet?");
          }
          return true;
        default:
          return false;
      }
    },
    test: () => {
      handlePlayerInput('take rug');
      handlePlayerInput('climb on rug');
      handlePlayerInput('raise rug');
      handlePlayerInput('look under rug');
      handlePlayerInput('move rug');
      handlePlayerInput('climb on rug');
      handlePlayerInput('raise rug');
      handlePlayerInput('look under rug');
      handlePlayerInput('move rug');
      return true;
    },
  })
);

export const Me = ref(
  new Item({
    name: 'you',
    id: 'Me',
    location: null,
    synonym: ['me', 'myself', 'self', 'cretin'],
    flags: { isActor: true },
    action: () => {
      console.log('Me Handler', theVerb.value);
      switch (theVerb.value) {
        case 'Talk':
          tell(
            'Talking to yourself is said to be a sign of impending mental collapse.'
          );
          return true;
        case 'Give':
          if (theIndirect.value === Me.value.id) {
            perform('Take', theDirect.value);
            return true;
          }
          return false;
        case 'Make':
          tell('Only you can do that.');
          return true;
        case 'Disembark':
          tell("You'll have to do that on your own.");
          return true;
        case 'Eat':
          tell('Auto-cannibalism is not the answer.');
          return true;
        case 'Attack':
        case 'Destroy':
          tell('Suicide is not the answer.');
          return true;
        case 'Throw':
          if (theDirect.value === Me.value.id) {
            tell("Why don't you just walk like normal people?");
            return true;
          }
          return false;
        case 'Take':
          tell('How romantic!');
          return true;
        case 'Examine':
          tell("That's difficult unless your eyes are prehensile.");
          return true;
        default:
          return false;
      }
    },
  })
);

export const Adventurer = ref(
  new Item({
    name: 'cretin',
    id: 'Adventurer',
    location: null,
    synonym: ['adventurer'],
    flags: { doNotDescribe: true, isInvisible: true, isActor: true },
    action: () => false,
  })
);

export const Stairs = ref(
  new Item({
    name: 'stairs',
    id: 'Stairs',
    location: 'LocalGlobals',
    synonym: ['stairs', 'steps', 'staircase', 'stairway'],
    adjective: ['stone', 'dark', 'marble', 'forbidding', 'steep'],
    flags: { doNotDescribe: true, climbBit: true },
    action: () => {
      console.log('Stairs Handler', theVerb.value);
      switch (theVerb.value) {
        case 'Through':
          tell('You should say whether you want to go up or down.');
          return true;
        default:
          return false;
      }
    },
  })
);

export const GlobalObjects = ref(
  new Item({
    name: 'global objects',
    id: 'GlobalObjects',
    location: null,
    synonym: ['globalobjects'],
    flags: { isInvisible: true },
    action: () => false,
  })
);

export const LocalGlobals = ref(
  new Item({
    name: 'local globals',
    id: 'LocalGlobals',
    location: 'GlobalObjects',
    synonym: ['localglobals'],
    flags: { isInvisible: true },
    action: () => false,
  })
);
