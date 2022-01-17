import { ref } from 'vue';
import { items } from './useItem';
import { parser } from '../composables/useParser';

export const here = ref('');
export const score = ref(0);
export const scoreMax = ref(null);
export const moves = ref(0);
export const showHelp = ref(false);

export const playerInput = ref('');
export const theVerb = ref('');
export const theObject = ref('');
export const theIndirect = ref('');
export const theOutput = ref([]);
export const it = ref('');

export const magicFlag = ref(false);

export const trapDoorExit = () => true;

export const tell = (message) => {
  theOutput.value.push(message);
};

export const dummyMessages = [
  'Look around.',
  'Too late for that.',
  'Have your eyes checked.',
];

export const evaluate = () => {
  items[theObject.value].value.action(theVerb.value);
};

export const perform = (a, o = false, i = false) => {
  theVerb.value = a;
  theObject.value = o;
  theIndirect.value = i;
  tell(
    `Verb: ${theVerb.value}, Object: ${theObject.value}, Indirect Object: ${theIndirect.value}`
  );
};

export const handlePlayerInput = (input = playerInput.value) => {
  tell(`> ${input}`);
  console.log('HANDLE PLAYER INPUT', input);
  const parsedPlayerInput = parser(input);
  if (parsedPlayerInput.error) {
    console.error(parsedPlayerInput.error.message);
    tell(
      `Sorry, I don't understand the word “${parsedPlayerInput.error.token}.”`
    );
    playerInput.value = '';
    return false;
  }
  console.log(parsedPlayerInput);
  perform(
    parsedPlayerInput.verb.name,
    parsedPlayerInput.noun?.name,
    parsedPlayerInput.indirect?.name
  );
  playerInput.value = '';
};

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
