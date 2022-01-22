/**
 * Pick One Item from an Array
 * @param {array} array
 * @returns any
 */
export const pickOne = (array) =>
  array[Math.floor(Math.random() * array.length)];
