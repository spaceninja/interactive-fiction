import { ref } from 'vue';

export const here = ref('livingRoom');

export const magicFlag = ref(false);

export const trapDoorExit = () => true;

export const tell = (string) => {
  console.log(string);
};

export const dummyMessages = [
  'Look around.',
  'Too late for that.',
  'Have your eyes checked.',
];

/**
 * Pick One Item from an Array
 * @param {array} array
 * @returns any
 */
export const pickOne = (array) =>
  array[Math.floor(Math.random() * array.length)];

/**
 * Open/Close
 *
 * @param {object} object the object to open or close.
 * @param {string} verb whether to open or close the object.
 * @param {string} openMessage the message to show when opening.
 * @param {string} closeMessage the messgage to show when closing.
 */
export const openClose = (object, verb, openMessage, closeMessage) => {
  if (verb === 'open') {
    if (object.value.flags.isOpen) {
      tell(pickOne(dummyMessages));
      return;
    }
    // eslint-disable-next-line no-param-reassign
    object.value.flags.isOpen = true;
    tell(openMessage);
  } else {
    if (!object.value.flags.isOpen) {
      tell(pickOne(dummyMessages));
      return;
    }
    // eslint-disable-next-line no-param-reassign
    object.value.flags.isOpen = false;
    tell(closeMessage);
  }
};
