import { tell } from './globals';

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

// Just adding this so the conditions in rug will work
export const trapDoor = new Object({
  name: 'trap door',
  location: 'living room',
  synonym: ['door', 'trapdoor', 'trap-door', 'cover'],
  adjective: ['trap', 'dusty'],
  flags: { isDoor: true, doNotDescribe: true, isInvisible: true },
  action: () => {
    console.log('TRAP DOOR!');
  },
});

export const rug = new Object({
  name: 'carpet',
  location: 'livingRoom',
  synonym: ['rug', 'carpet'],
  adjective: ['large', 'oriental'],
  flags: { doNotDescribe: true, tryTakeBit: true, isMoved: false },
  action: (verb) => {
    switch (verb) {
      case 'raise':
        console.log('RAISE');
        tell(
          `The rug is too heavy to lift${
            rug.flags.isMoved
              ? '.'
              : ', but in trying to take it you have noticed an irregularity beneath it.'
          }`
        );
        break;
      case 'move':
      case 'push':
        console.log('MOVE OR PUSH');
        if (rug.flags.isMoved) {
          tell(
            'Having moved the carpet previously, you find it impossible to move it again.'
          );
        } else {
          tell(
            'With a great effort, the rug is moved to one side of the room, revealing the dusty cover of a closed trap door.'
          );
          rug.flags.isMoved = true;
          trapDoor.flags.isInvisible = false;
          // this-is-it trap-door
        }
        break;
      case 'take':
        console.log('TAKE');
        tell('The rug is extremely heavy and cannot be carried.');
        break;
      case 'look under':
        console.log('LOOK UNDER');
        if (!rug.flags.isMoved && !trapDoor.flags.isOpen) {
          tell(
            'Underneath the rug is a closed trap door. As you drop the corner of the rug, the trap door is once again concealed from view.'
          );
        } else {
          tell(
            'Having moved the carpet previously, there is nothing to see under it.'
          );
        }
        break;
      case 'climb on':
        console.log('CLIMB ON');
        if (!rug.flags.isMoved && !trapDoor.flags.isOpen) {
          tell(
            'As you sit, you notice an irregularity underneath it. Rather than be uncomfortable, you stand up again.'
          );
        } else {
          tell("I suppose you think it's a magic carpet?");
        }
        break;
      default:
        // TODO: My sneaking suspicion is we'll need to return a single value
        // from the action function, and return false in the default state.
        break;
    }
  },
});
