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
} from './game/useGame';

export const Elf = ref(
  new Item({
    name: 'elf',
    id: 'Elf',
    location: 'RoomA',
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
    location: 'LivingRoom',
    synonym: ['troll', 'ogre'],
    adjective: ['ugly', 'smelly'],
    flags: {},
    action: () => {
      console.log('Troll handler', theVerb.value);
      switch (theVerb.value) {
        case 'Yell':
          console.log('Troll: yell handler');
          tell(
            'Excited to finally find a competitor in a shouting competition, the Troll yells back at you even louder.'
          );
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
          break;
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
          break;
      }
    },
  })
);

export const Water = ref(
  new Item({
    name: 'quantity of water',
    id: 'Water',
    location: 'Bottle',
    synonym: ['water', 'quantity', 'liquid', 'h20'],
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
          break;
        case 'Destroy':
          empty = true;
          Bottle.value.location = null;
          tell('A brilliant maneuver destroys the bottle.');
          break;
        case 'Open':
          Bottle.value.flags.isOpen = true;
          console.log('OPEN', Bottle.value.flags);
          tell('You open the bottle');
          break;
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
          break;
        default:
          return false;
      }
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
    text: 'Congratulations! You are the privileged owner of ZORK I: The Great Underground Empire, a self-contained and self-maintaining universe. If used and maintained in accordance with normal operating practices for small universes, ZORK will provide many months of trouble-free operation.',
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
    flags: { isDoor: true, doNotDescribe: true, isInvisible: true },
    action: () => {
      console.log('Trap Door Handler', theVerb.value);
      switch (theVerb.value) {
        case 'raise':
        case 'unlock':
          TrapDoor.value.action('open');
          break;
        case 'open':
        case 'close':
          console.log('OPEN OR CLOSE TRAP DOOR');
          if (here.value === 'LivingRoom') {
            openClose(
              TrapDoor,
              theVerb.value,
              'The door reluctantly opens to reveal a rickety staircase descending into darkness.',
              'The door swings shut and closes.'
            );
          } else if (here.value === 'cellar') {
            if (!TrapDoor.value.flags.isOpen) {
              if (theVerb.value === 'open') {
                tell('The door is locked from above.');
              } else {
                TrapDoor.value.flags.isTouched = false;
                TrapDoor.value.flags.isOpen = false;
                tell('The door closes and locks.');
              }
              tell(pickOne(dummyMessages));
            }
          }
          break;
        case 'LookUnder':
        case 'LookInside':
          console.log('LOOK UNDER TRAP DOOR', here.value.name);
          if (here.value.name !== 'Living Room') return;
          if (TrapDoor.value.flags.isOpen) {
            tell('You see a rickety staircase descending into darkness.');
          } else {
            tell("It's closed.");
          }
          return true;
        default:
          break;
      }
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
    action: (verb) => {
      switch (verb) {
        case 'raise':
          console.log('RAISE RUG');
          tell(
            `The rug is too heavy to lift${
              Rug.value.flags.isMoved
                ? '.'
                : ', but in trying to take it you have noticed an irregularity beneath it.'
            }`
          );
          break;
        case 'move':
        case 'push':
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
          break;
        case 'take':
          console.log('TAKE RUG');
          tell('The rug is extremely heavy and cannot be carried.');
          break;
        case 'look under':
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
          break;
        case 'climb on':
          console.log('CLIMB ON RUG');
          if (!Rug.value.flags.isMoved && !TrapDoor.value.flags.isOpen) {
            tell(
              'As you sit, you notice an irregularity underneath it. Rather than be uncomfortable, you stand up again.'
            );
          } else {
            tell("I suppose you think it's a magic carpet?");
          }
          break;
        default:
          // TODO: My sneaking suspicion is we'll need to return a single value
          // from the action function, and return false in the default state.
          break;
      }
    },
  })
);

export const items = {
  Elf,
  Troll,
  KitchenTable,
  Lunch,
  Garlic,
  SandwichBag,
  Water,
  Bottle,
  OwnersManual,
  TrapDoor,
  Rug,
};
