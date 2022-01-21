import { ref } from 'vue';
import Room from '../classes/Room';
import { magicFlag, trapDoorExit, tell } from './useGlobal';
import { items } from './useItem';

export const DarkRoom = ref(
  new Room({
    name: 'dark room',
    id: 'DarkRoom',
    action: () => {
      return false;
    },
  })
);

export const RoomA = ref(
  new Room({
    name: 'room A',
    id: 'RoomA',
    flags: { isOn: true },
    action: () => {
      return false;
    },
  })
);

export const RoomB = ref(
  new Room({
    name: 'room B',
    id: 'RoomB',
    flags: { isOn: true },
    description: 'This is the Room B long description.',
    action: () => {
      return false;
    },
  })
);

export const Kitchen = ref(
  new Room({
    name: 'kitchen',
    id: 'Kitchen',
    exits: {
      west: 'LivingRoom',
    },
    flags: { isOnLand: true, isOn: true, isSacred: true },
    global: ['kitchen-window', 'chimney', 'stairs'],
    action: (verb) => {
      switch (verb) {
        case 'look': {
          console.log('KITCHEN:');
          tell(
            'You are in the kitchen of the white house. A table seems to have been used recently for the preparation of food. A passage leads to the west and a dark staircase can be seen leading upward. A dark chimney leads down and to the east is a small window which is closed.'
          );
          return true;
        }
        default:
          break;
      }
    },
  })
);

export const LivingRoom = ref(
  new Room({
    name: 'living room',
    id: 'LivingRoom',
    exits: {
      east: 'Kitchen',
      // west: magicFlag.value ? 'strangePassage' : 'The door is nailed shut.',
      // down: trapDoorExit(),
    },
    flags: { isOnLand: true, isOn: true, isSacred: true },
    global: ['stairs'],
    pseudo: [{ name: 'nails' }, { name: 'nail' }],
    action: (verb) => {
      switch (verb) {
        case 'look': {
          console.log('LIVING ROOM:');
          let message =
            'You are in the living room. There is a doorway to the east';
          message += magicFlag.value
            ? '. To the west is a cyclops-shaped opening in an old wooden door, above which is some strange gothic lettering, '
            : ', a wooden door with strange gothic lettering to the west, which appears to be nailed shut, ';
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
          // some sort of complex logic involving the trophy case and the score
          break;
        default:
          break;
      }
    },
  })
);

export const rooms = { DarkRoom, RoomA, RoomB, Kitchen, LivingRoom };
