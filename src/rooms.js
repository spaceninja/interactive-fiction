import { tell } from './globals';
import { Object, rug, trapDoor } from './objects';

export class Room extends Object {
  /**
   * @param {object} props
   * @param {string} props.name The name of the room.
   * @param {function} props.action The function called when the room
   *    is interacted with.
   * @param {string} props.description The description of the room.
   * @param {string} props.location The name of the object/room which
   *    contains this object.
   * @param {number} props.value The number of points the player gets
   *    for interacting with the object for the first time.
   * @param {array} props.flags List of all flags set in the object.
   * @param {string} props.north
   * @param {string} props.south
   * @param {string} props.east
   * @param {string} props.west
   * @param {string} props.ne
   * @param {string} props.se
   * @param {string} props.nw
   * @param {string} props.sw
   * @param {string} props.up
   * @param {string} props.down
   * @param {string} props.inward
   * @param {string} props.out Only meaningful for rooms with one exit.
   * @param {array} props.pseudo List of pseudo objects in the room.
   * @param {array} props.global List of local-global objects in the room.
   */
  constructor({
    name,
    action,
    description,
    value,
    flags,
    north,
    south,
    east,
    west,
    ne,
    se,
    nw,
    sw,
    up,
    down,
    inward,
    out,
    pseudo,
    global,
  }) {
    super({
      name,
      action,
      description,
      location: 'rooms',
      value,
      flags,
    });
    this.north = north;
    this.south = south;
    this.east = east;
    this.west = west;
    this.ne = ne;
    this.se = se;
    this.nw = nw;
    this.sw = sw;
    this.up = up;
    this.down = down;
    this.inward = inward;
    this.out = out;
    this.pseudo = pseudo;
    this.global = global;
  }
}

const magicFlag = false;
const trapDoorExit = () => true;

export const livingRoom = new Room({
  name: 'Living Room',
  east: 'kitchen',
  west: magicFlag ? 'strangePassage' : 'The door is nailed shut.',
  down: trapDoorExit(),
  flags: { isOnLand: true, isOn: true, isSacred: true },
  global: ['stairs'],
  pseudo: [{ name: 'nails' }, { name: 'nail' }],
  action: (verb) => {
    switch (verb) {
      case 'look': {
        let message =
          'You are in the living room. There is a doorway to the east';
        message += magicFlag
          ? '. To the west is a cyclops-shaped opening in an old wooden door, above which is some strange gothic lettering, '
          : ', a wooden door with strange gothic lettering to the west, which appears to be nailed shut, ';
        message += 'a trophy case, ';
        const trapDoorMessage = trapDoor.flags.isOpen
          ? 'and a rug lying beside an open trap door.'
          : 'and an open trap door at your feet.';
        message += rug.flags.isMoved
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
});
