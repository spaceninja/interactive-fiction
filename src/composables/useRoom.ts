import { ref } from 'vue';
import Room from '../classes/Room';
import { magicFlag, tell, theVerb } from './game/useGame';
import * as items from './useItem';

/**
 * Rooms
 * All the locations in the game that the player can visit.
 *
 * Nothing should live in this file except Vue refs containing a Room,
 * because the contents of this file build the list of room for the game.
 */

export const Kitchen = ref(
  new Room({
    name: 'Kitchen',
    id: 'Kitchen',
    exits: {
      west: { room: 'LivingRoom' },
      up: { room: 'Attic' },
    },
    flags: { isOn: true },
    value: 10,
    global: ['Stairs'],
    action: () => {
      console.log('KITCHEN HANDLER');
      switch (theVerb.value) {
        case 'Look': {
          tell(
            `You are in the kitchen of the white house.
             A table seems to have been used recently for the preparation of food.
             A passage leads to the west and a dark staircase can be seen leading upward.`
          );
          return true;
        }
        default:
          return false;
      }
    },
  })
);

export const Attic = ref(
  new Room({
    name: 'Attic',
    id: 'Attic',
    exits: {
      down: { room: 'Kitchen' },
    },
    flags: { isOn: false },
    global: ['Stairs'],
    description: 'This is the attic. The only exit is a stairway leading down.',
    action: () => false,
  })
);

export const LivingRoom = ref(
  new Room({
    name: 'Living Room',
    id: 'LivingRoom',
    exits: {
      east: { room: 'Kitchen' },
      west: {
        room: 'StrangePassage',
        condition: () => magicFlag.value,
        fail: 'The door is nailed shut.',
      },
      down: {
        method: () => {
          if (items.Rug.value.flags.isMoved) {
            if (items.TrapDoor.value.flags.isOpen) {
              return { room: 'Cellar' };
            }
            return { fail: 'The trap door is closed.' };
          }
          return { fail: "You can't go that way." };
        },
      },
    },
    flags: { isOn: true },
    global: ['Stairs'],
    action: () => {
      console.log('LIVING ROOM HANDLER');
      switch (theVerb.value) {
        case 'Look': {
          let message =
            'You are in the living room. There is a doorway to the east';
          message += magicFlag.value
            ? `. To the west is a cyclops-shaped opening in an old wooden door,
               above which is some strange gothic lettering, `
            : `, a wooden door with strange gothic lettering to the west,
               which appears to be nailed shut, `;
          message += 'a trophy case, ';
          const TrapDoorMessage = items.TrapDoor.value.flags.isOpen
            ? `and a rug lying beside an open trap door.`
            : 'and an open trap door at your feet.';
          message += items.Rug.value.flags.isMoved
            ? TrapDoorMessage
            : 'and a large oriental rug in the center of the room.';
          tell(message);
          return true;
        }
        default:
          return false;
      }
    },
  })
);

export const Cellar = ref(
  new Room({
    name: 'Cellar',
    id: 'Cellar',
    exits: {
      north: { room: 'TrollRoom' },
      up: {
        room: 'LivingRoom',
        door: 'TrapDoor',
      },
    },
    flags: { isOn: false },
    value: 25,
    global: ['TrapDoor', 'Stairs'],
    action: () => {
      switch (theVerb.value) {
        case 'Look':
          tell(
            `You are in a dark and damp cellar with a narrow passageway leading north.`
          );
          return true;
        default:
          return false;
      }
    },
  })
);

export const TrollRoom = ref(
  new Room({
    name: 'The Troll Room',
    id: 'TrollRoom',
    exits: {
      south: { room: 'Cellar' },
    },
    flags: { isOn: false },
    description: `This is a small room with a forbidding hole leading west.
                  Bloodstains and deep scratches (perhaps made by an axe)
                  mar the walls.`,
    action: () => {
      switch (theVerb.value) {
        default:
          return false;
      }
    },
  })
);
