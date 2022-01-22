export default class Item {
  /**
   * @param {object} props
   * @param {string} props.name The name of the item.
   * @param {string} props.id The ID of the item.
   * @param {array} props.synonym List of all nouns which can be used to
   *    refer to the item.
   * @param {array} props.adjective List of all adjectives which can be
   *    used to refer to the item.
   * @param {function} props.action The function called when the item
   *    is interacted with.
   * @param {function} props.test The function called when the item
   *    is being tested.
   * @param {function} props.descriptionFunction A function used to
   *    describe the item. Can be the same function as `action`, if
   *    set up to handle `M-OBJDESC` or `M-OBJDESC?`.
   * @param {string} props.description The description of the item.
   * @param {string} props.initialDescription Description used for the
   *    item before the player has interacted with it.
   * @param {string} props.location The name of the item which contains
   *    this item.
   * @param {number} props.size The size/weight of the item. Affects
   *    the number of items a placer can carry, how much container it
   *    takes up, etc. Only meaningful for takable items.
   * @param {number} props.capacity How many items can be placed
   *    inside the item. Only meaningful for containers.
   * @param {number} props.value The number of points the player gets
   *    for interacting with the item for the first time.
   * @param {string} props.text A string used when the player tries to
   *    read the item.
   * @param {object} props.flags List of all flags set in the item.
   * @param {number} props.priority Priority of this item when sorting
   */
  constructor({
    name,
    id,
    synonym,
    adjective,
    action,
    test,
    descriptionFunction,
    description,
    initialDescription,
    location,
    size,
    capacity,
    value,
    text,
    flags,
    priority,
  }) {
    this.name = name;
    this.id = id;
    this.synonym = synonym;
    this.adjective = adjective;
    this.action = action;
    this.test = test;
    this.descriptionFunction = descriptionFunction;
    this.description = description;
    this.initialDescription = initialDescription;
    this.location = location;
    this.size = size;
    this.capacity = capacity;
    this.value = value;
    this.text = text;
    this.flags = flags;
    this.priority = priority;
  }
}
