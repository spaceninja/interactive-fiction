import { ref } from 'vue';
import Room from '../classes/Room';
import { magicFlag, tell, theVerb } from './game/useGame';
import * as items from './useItem';

export const Kitchen = ref(
  new Room({
    name: 'Kitchen',
    id: 'Kitchen',
    exits: {
      west: 'LivingRoom',
      up: 'Attic',
    },
    flags: { isOn: true },
    value: 10,
    global: ['stairs'],
    action: () => {
      switch (theVerb.value) {
        case 'look': {
          tell(
            `You are in the kitchen of the white house.
             A table seems to have been used recently for the preparation of food.
             A passage leads to the west and a dark staircase can be seen leading upward.`
          );
          return true;
        }
        case 'beginning':
          // TODO: ???
          // some sort of logic around climbing the stairs.
          // probably shouldn't live here
          return false;
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
      down: 'Kitchen',
    },
    flags: { isOn: true },
    global: ['stairs'],
    description: 'This is the attic. The only exit is a stairway leading down.',
    action: () => false,
  })
);

export const LivingRoom = ref(
  new Room({
    name: 'Living Room',
    id: 'LivingRoom',
    exits: {
      east: 'Kitchen',
      // TODO: handle special exits
      // west: magicFlag.value ? 'strangePassage' : 'The door is nailed shut.',
      // down: trapDoorExit(),
    },
    flags: { isOn: true },
    global: ['stairs'],
    // TODO: handle pseudos
    pseudo: [{ name: 'nails' }, { name: 'nail' }],
    action: () => {
      switch (theVerb.value) {
        case 'look': {
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
        case 'end':
          // TODO: ???
          // some sort of complex logic involving the trophy case and the score
          return false;
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
      north: 'TrollRoom',
      // up: trapdooropen ? 'LivingRoom' : null
    },
    flags: { isOn: false },
    value: 25,
    global: ['TrapDoor', 'stairs'],
    action: () => {
      switch (theVerb.value) {
        case 'look':
          tell(
            `You are in a dark and damp cellar with a narrow passageway leading north.`
          );
          return true;
        case 'enter':
          // TODO: ???
          // some sort of complex logic involving the trap door closing
          return false;
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
      south: 'Cellar',
    },
    flags: { isOn: false },
    description: `This is a small room with a forbidding hole leading west.
                  Bloodstains and deep scratches (perhaps made by an axe)
                  mar the walls.`,
    action: () => {
      switch (theVerb.value) {
        case 'enter':
          // TODO: ???
          // some sort of complex logic involving the troll
          return false;
        default:
          return false;
      }
    },
  })
);
