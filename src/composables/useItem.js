import { ref } from 'vue';
import Item from '../classes/Item';
import { pickOne } from '../composables/useHelper';
import { theVerb, here, openClose, tell, dummyMessages } from './useGlobal';

export const Elf = ref(
  new Item({
    name: 'Elf',
    location: false,
    synonym: ['elf', 'drow'],
    adjective: ['pretty', 'fancy'],
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
    name: 'Troll',
    location: false,
    synonym: ['troll', 'ogre'],
    adjective: ['ugly', 'smelly'],
    action: () => {
      console.log('Troll handler', theVerb.value);
      switch (theVerb.value) {
        case 'Yell':
          console.log('Troll: yell handler');
          tell(
            'Excited to finally find a competitor in a shouting competition, the Troll yells back at you even louder.'
          );
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

export const TrapDoor = ref(
  new Item({
    name: 'trap door',
    location: 'living room',
    synonym: ['door', 'trapdoor', 'trap-door', 'cover'],
    adjective: ['trap', 'dusty'],
    flags: { isDoor: true, doNotDescribe: true, isInvisible: true },
    action: (verb) => {
      switch (verb) {
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
              verb,
              'The door reluctantly opens to reveal a rickety staircase descending into darkness.',
              'The door swings shut and closes.'
            );
          } else if (here.value === 'cellar') {
            if (!TrapDoor.value.flags.isOpen) {
              if (verb === 'open') {
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
        case 'look under':
          console.log('LOOK UNDER TRAP DOOR');
          if (here.value !== 'LivingRoom') return;
          if (TrapDoor.value.flags.isOpen) {
            tell('You see a rickety staircase descending into darkness.');
          } else {
            tell("It's closed.");
          }
          break;
        default:
          break;
      }
    },
  })
);

export const Rug = ref(
  new Item({
    name: 'carpet',
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

export const items = { Elf, Troll, TrapDoor, Rug };
