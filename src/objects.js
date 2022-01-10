export class Object {
  /**
   * @param {object} props
   * @param {string} props.name The name of the object.
   * @param {array} props.synonym List of all nouns which can be used to
   *    refer to the object.
   * @param {array} props.adjective List of all adjectives which can be
   *    used to refer to the object.
   * @param {function} props.action The function called when the object
   *    is interacted with.
   * @param {function} props.descriptionFunction A function used to
   *    describe the object. Can be the same function as `action`, if
   *    set up to handle `M-OBJDESC` or `M-OBJDESC?`.
   * @param {string} props.description The description of the object.
   * @param {string} props.initialDescription Description used for the
   *    object before the player has interacted with it.
   * @param {string} props.location The name of the object/room which
   *    contains this object.
   * @param {number} props.size The size/weight of the object. Affects
   *    the number of objects a placer can carry, how much container it
   *    takes up, etc. Only meaningful for takable objects.
   * @param {number} props.capacity How many objects can be placed
   *    inside the object. Only meaningful for containers.
   * @param {number} props.value The number of points the player gets
   *    for interacting with the object for the first time.
   * @param {string} props.text A string used when the player tries to
   *    read the object.
   * @param {array} props.flags List of all flags set in the object.
   */
  constructor({
    name,
    synonym,
    adjective,
    action,
    descriptionFunction,
    description,
    initialDescription,
    location,
    size,
    capacity,
    value,
    text,
    flags,
  }) {
    this.name = name;
    this.synonym = synonym;
    this.adjective = adjective;
    this.action = action;
    this.descriptionFunction = descriptionFunction;
    this.description = description;
    this.initialDescription = initialDescription;
    this.location = location;
    this.size = size;
    this.capacity = capacity;
    this.value = value;
    this.text = text;
    this.flags = flags;
  }
}

export const lantern = new Object({
  name: 'brass lantern',
  location: 'livingRoom',
  synonym: ['lamp', 'lantern', 'light'],
  adjective: ['brass'],
  description: 'There is a brass lantern (battery-powered) here.',
  initialDescription: 'A battery-powered brass lantern is on the trophy case.',
  flags: ['takeBit', 'lightBit'],
  action: () => {
    console.log('LANTERN!');
  },
});
