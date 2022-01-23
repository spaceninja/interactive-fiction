export default class Item {
  name: string;
  id: string;
  location: string | null;
  synonym: Array<string>;
  flags: Record<string, unknown>;
  adjective?: Array<string>;
  action: () => boolean;
  test?: () => void;
  descriptionFunction?: () => boolean;
  description?: string;
  initialDescription?: string;
  size?: number;
  capacity?: number;
  value?: number;
  text?: string;
  priority?: number;

  /**
   * @param props the properties of the Item.
   * @param props.name The name of the item.
   * @param props.id The ID of the item.
   * @param props.synonym List of all nouns which can refer to the item.
   * @param props.adjective List of all adjectives which can refer to the item.
   * @param props.action The function called when the item is interacted with.
   * @param props.test The function called when the item is being tested.
   * @param props.descriptionFunction A function used to describe the item.
   * @param props.description The description of the item.
   * @param props.initialDescription Description used before the player has interacted with the item.
   * @param props.location The ID of the item which contains this item.
   * @param props.size The size/weight of the item. Only meaningful for takable items.
   * @param props.capacity How many items can be placed inside the item. Only meaningful for containers.
   * @param props.value How many points the player gets for interacting with the item for the first time.
   * @param props.text A string used when the player tries to read the item.
   * @param props.flags List of all flags set in the item.
   * @param props.priority Priority of this item when sorting
   */
  constructor({
    name,
    id,
    location,
    synonym,
    flags,
    adjective,
    action,
    test,
    descriptionFunction,
    description,
    initialDescription,
    size,
    capacity,
    value,
    text,
    priority,
  }: {
    name: string;
    id: string;
    location: string | null;
    synonym: Array<string>;
    flags: Record<string, unknown>;
    action: () => boolean;
    adjective?: Array<string>;
    test?: () => void;
    descriptionFunction?: () => boolean;
    description?: string;
    initialDescription?: string;
    size?: number;
    capacity?: number;
    value?: number;
    text?: string;
    priority?: number;
  }) {
    this.name = name;
    this.id = id;
    this.location = location;
    this.synonym = synonym;
    this.flags = flags;
    this.adjective = adjective;
    this.action = action;
    this.test = test;
    this.descriptionFunction = descriptionFunction;
    this.description = description;
    this.initialDescription = initialDescription;
    this.size = size;
    this.capacity = capacity;
    this.value = value;
    this.text = text;
    this.priority = priority;
  }
}
