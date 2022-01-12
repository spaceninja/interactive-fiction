import { ref } from 'vue';
import Room from '../classes/Room';
import { magicFlag, trapDoorExit, tell } from './useGlobal';
import { items } from './useItem';

export const livingRoom = ref(
  new Room({
    name: 'Living Room',
    east: 'kitchen',
    west: magicFlag.value ? 'strangePassage' : 'The door is nailed shut.',
    down: trapDoorExit(),
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
          const trapDoorMessage = items.trapDoor.value.flags.isOpen
            ? 'and a rug lying beside an open trap door.'
            : 'and an open trap door at your feet.';
          message += items.rug.value.flags.isMoved
            ? trapDoorMessage
            : 'and a large oriental rug in the center of the room.';
          tell(message);
          break;
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

export const rooms = { livingRoom };
