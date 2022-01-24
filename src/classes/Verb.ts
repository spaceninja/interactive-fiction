export default class Verb {
  name: string;
  synonym: Array<string>;
  action: () => boolean;
  test?: () => void;
  priority?: number;

  /**
   * @param props
   * @param props.name The internal name of the verb.
   * @param props.synonym List of all words which can refer to the verb.
   * @param props.action The function called for this verb.
   * @param props.test The function called to test this verb.
   * @param props.priority Priority of this item when sorting
   */
  constructor({
    name,
    synonym,
    action,
    test,
    priority,
  }: {
    name: string;
    synonym: Array<string>;
    action: () => boolean;
    test?: () => void;
    priority?: number;
  }) {
    this.name = name;
    this.synonym = synonym;
    this.action = action;
    this.test = test;
    this.priority = priority;
  }
}
