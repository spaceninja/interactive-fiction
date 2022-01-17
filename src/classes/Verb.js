export default class Item {
  /**
   * @param {object} props
   * @param {string} props.name The internal name of the verb.
   * @param {array} props.synonym List of all words which can be used to
   *    refer to the verb.
   * @param {function} props.action The function called for this verb.
   */
  constructor({ name, synonym, action }) {
    this.name = name;
    this.synonym = synonym;
    this.action = action;
  }
}
