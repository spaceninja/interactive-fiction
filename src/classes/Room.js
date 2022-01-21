import Item from './Item';

export default class Room extends Item {
  /**
   * @param {object} props
   * @param {string} props.name The name of the room.
   * @param {string} props.id The ID of the room.
   * @param {function} props.action The function called when the room
   *    is interacted with.
   * @param {string} props.description The description of the room.
   * @param {string} props.location The name of the item/room which
   *    contains this item.
   * @param {number} props.value The number of points the player gets
   *    for interacting with the item for the first time.
   * @param {object} props.flags List of all flags set in the item.
   * @param {object} props.exits List of exits from this room.
   * @param {string} props.exits.north
   * @param {string} props.exits.south
   * @param {string} props.exits.east
   * @param {string} props.exits.west
   * @param {string} props.exits.ne
   * @param {string} props.exits.se
   * @param {string} props.exits.nw
   * @param {string} props.exits.sw
   * @param {string} props.exits.up
   * @param {string} props.exits.down
   * @param {string} props.exits.inward
   * @param {string} props.exits.out Only meaningful for rooms with one exit.
   * @param {array} props.pseudo List of pseudo items in the room.
   * @param {array} props.global List of local-global items in the room.
   */
  constructor({
    name,
    id,
    action,
    description,
    value,
    flags,
    exits,
    pseudo,
    global,
  }) {
    super({
      name,
      id,
      action,
      description,
      location: 'rooms',
      value,
      flags,
    });
    this.exits = exits;
    this.pseudo = pseudo;
    this.global = global;
  }
}
