export default class Verb {
  /**
   * @param {object} props
   * @param {string} props.name The internal name of the verb.
   * @param {array} props.synonym List of all words which can be used to
   *    refer to the verb.
   * @param {function} props.action The function called for this verb.
   * @param {function} props.action The function called to test this verb.
   */
  constructor({ name, synonym, action, test }) {
    this.name = name;
    this.synonym = synonym;
    this.action = action;
    this.test = test;
  }
}
