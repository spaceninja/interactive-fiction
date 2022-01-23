/**
 * Pick One Item from an Array
 * @param {array} array
 * @returns any
 */
export const pickOne = (array: string[]) =>
  array[Math.floor(Math.random() * array.length)];
