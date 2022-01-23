import Item from './Item';

export default class Room extends Item {
  declare name: string;
  declare id: string;
  declare action: () => boolean;
  declare description?: string;
  declare value?: number;
  declare flags: Record<string, unknown>;
  exits: Record<string, unknown>;
  global?: Array<string>;

  /**
   * @param props
   * @param props.name The name of the room.
   * @param props.id The ID of the room.
   * @param props.action The function called when the room is interacted with.
   * @param props.description The description of the room.
   * @param props.value The number of points the player gets for entering the room for the first time.
   * @param props.flags List of all flags set in the item.
   * @param props.exits List of exits from this room.
   * @param props.exits.north
   * @param props.exits.south
   * @param props.exits.east
   * @param props.exits.west
   * @param props.exits.ne
   * @param props.exits.se
   * @param props.exits.nw
   * @param props.exits.sw
   * @param props.exits.up
   * @param props.exits.down
   * @param props.exits.inward
   * @param props.exits.out Only meaningful for rooms with one exit.
   * @param props.global List of local-global items in the room.
   */
  constructor({
    name,
    id,
    action,
    description,
    value,
    flags,
    exits,
    global,
  }: {
    name: string;
    id: string;
    action: () => boolean;
    description?: string;
    value?: number;
    flags: Record<string, unknown>;
    exits: Record<string, unknown>;
    global?: Array<string>;
  }) {
    super({
      name,
      synonym: [],
      id,
      action,
      description,
      location: 'rooms',
      value,
      flags,
    });
    this.exits = exits;
    this.global = global;
  }
}
