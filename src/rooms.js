import { Object } from './objects';

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

const magicFlag = true;
const trapDoorExit = () => true;

export const livingRoom = new Room({
  name: 'Living Room',
  action: () => {
    console.log('LIVING ROOM!');
  },
  east: 'kitchen',
  west: magicFlag ? 'strangePassage' : 'The door is nailed shut.',
  down: trapDoorExit(),
  flags: ['rLandBit', 'onBit', 'sacredBit'],
  global: ['stairs'],
  pseudo: [{ name: 'nails' }, { name: 'nail' }],
});
