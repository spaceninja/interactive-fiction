import { ref, Ref } from 'vue';
import { magicFlag, tell, theVerb } from './game/useGame';
import Item from '../classes/Item';
import Room from '../classes/Room';
import * as rawItems from './useItem';

// Have to redeclare these with types, which is dumb
const items = rawItems as { [key: string]: Ref<Item> };

/**
 * Rooms
 * All the locations in the game that the player can visit.
 *
 * Nothing should live in this file except Vue refs containing a Room,
 * because the contents of this file build the list of room for the game.
 */

export const WestOfHouse = ref(
  new Room({
    name: 'West of House',
    id: 'WestOfHouse',
    description: `You are standing in an open field west of a white house,
      with a boarded front door.`,
    exits: {
      north: { room: 'NorthOfHouse' },
      northeast: { room: 'NorthOfHouse' },
      south: { room: 'SouthOfHouse' },
      southeast: { room: 'SouthOfHouse' },
      east: { fail: "The door is boarded and you can't remove the boards." },
    },
    flags: { isOn: true },
    global: ['WhiteHouse', 'Board'],
    action: () => false,
  })
);

export const NorthOfHouse = ref(
  new Room({
    name: 'North of House',
    id: 'NorthOfHouse',
    description: `You are facing the north side of a white house.
      There is no door here, and all the windows are boarded up.`,
    exits: {
      west: { room: 'WestOfHouse' },
      southwest: { room: 'WestOfHouse' },
      east: { room: 'EastOfHouse' },
      southeast: { room: 'EastOfHouse' },
      south: { fail: 'The windows are all boarded.' },
    },
    flags: { isOn: true },
    global: ['BoardedWindow', 'WhiteHouse', 'Board'],
    action: () => false,
  })
);

export const SouthOfHouse = ref(
  new Room({
    name: 'South of House',
    id: 'SouthOfHouse',
    description: `You are facing the south side of a white house.
      There is no door here, and all the windows are boarded.`,
    exits: {
      west: { room: 'WestOfHouse' },
      northwest: { room: 'WestOfHouse' },
      east: { room: 'EastOfHouse' },
      northeast: { room: 'EastOfHouse' },
      north: { fail: 'The windows are all boarded.' },
    },
    flags: { isOn: true },
    global: ['BoardedWindow', 'WhiteHouse', 'Board'],
    action: () => false,
  })
);

export const EastOfHouse = ref(
  new Room({
    name: 'Behind House',
    id: 'EastOfHouse',
    exits: {
      north: { room: 'NorthOfHouse' },
      northwest: { room: 'NorthOfHouse' },
      south: { room: 'SouthOfHouse' },
      southwest: { room: 'SouthOfHouse' },
      west: {
        room: 'Kitchen',
        door: 'KitchenWindow',
      },
      in: {
        room: 'Kitchen',
        door: 'KitchenWindow',
      },
    },
    flags: { isOn: true },
    global: ['KitchenWindow', 'WhiteHouse'],
    action: () => {
      console.log('EAST OF HOUSE HANDLER');
      switch (theVerb.value) {
        case 'Look': {
          tell(
            `You are behind the white house.
            In one corner of the house there is a small window which is
            ${
              items.KitchenWindow.value.flags.isOpen ? 'open' : 'slightly ajar'
            }.`
          );
          return true;
        }
        default:
          return false;
      }
    },
  })
);

export const Kitchen = ref(
  new Room({
    name: 'Kitchen',
    id: 'Kitchen',
    exits: {
      west: { room: 'LivingRoom' },
      up: { room: 'Attic' },
      east: {
        room: 'EastOfHouse',
        door: 'KitchenWindow',
      },
      out: {
        room: 'EastOfHouse',
        door: 'KitchenWindow',
      },
    },
    flags: { isOn: true },
    value: 10,
    global: ['KitchenWindow', 'Stairs'],
    action: () => {
      console.log('KITCHEN HANDLER');
      switch (theVerb.value) {
        case 'Look': {
          tell(
            `You are in the kitchen of the white house.
             A table seems to have been used recently for the preparation of food.
             A passage leads to the west and a dark staircase can be seen leading upward.
             To the east is a small window which is
            ${
              items.KitchenWindow.value.flags.isOpen ? 'open' : 'slightly ajar'
            }.`
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
