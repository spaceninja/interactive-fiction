import { ref } from 'vue';
import { items } from './useItem';
import { verbs } from './useVerb';
import { parser } from '../composables/useParser';
import { pickOne, uuid } from '../composables/useHelper';

export const here = ref('');
export const theScore = ref(0);
export const theScoreMax = ref(null);
export const theMoves = ref(0);
export const showHelp = ref(false);

export const playerInput = ref('kiss the elf');
export const theVerb = ref('');
export const theDirect = ref('');
export const theIndirect = ref('');
export const theOutput = ref([]);
export const it = ref('');

export const magicFlag = ref(false);

export const trapDoorExit = () => true;

export const dummyMessages = [
  'Look around.',
  'Too late for that.',
  'Have your eyes checked.',
];

export const evaluate = () => {
  items[theDirect.value].value.action(theVerb.value);
};

/**
 * Tell
 *
 * Adds text to the on-screen output.
 *
 * @param {string} message - the text to display.
 * @param {string} className - a CSS class to add to the text.
 */
export const tell = (message, className) => {
  theOutput.value.push({ message, className, key: uuid() });
};

/**
 * Perform
 *
 * The parser translates the command "Hit the Troll with the Rock" into
 * a Verb (Hit), a Direct Item (Troll), and an Indirect Item (Rock).
 *
 * This routine saves those tokens to global state, and tries to handle
 * the command by calling the action handlers of the Indirect Item followed
 * by the Direct Item, followed by the Verb iteself.
 *
 * If none of those handle the command, then a simple fallback is used.
 *
 * @param {string} v - the Verb to perform.
 * @param {string} d - the Direct Item receives the action of the verb.
 * @param {string} i - the Indirect Item receives the direct item.
 * @returns boolean
 */
export const perform = (v, d = false, i = false) => {
  console.log('PERFORM', v, d, i);

  // Save the tokens to their global variables
  theVerb.value = v;
  theDirect.value = d;
  theIndirect.value = i;

  // Try the indirect item's handler
  const indirectHandled = i ? items[i]?.value.action() : false;
  if (indirectHandled) return true;

  // Try the direct item's handler
  const directHandled = d ? items[d]?.value.action() : false;
  if (directHandled) return true;

  // Nothing else handled it, so pass to the verb
  const verbHandled = v ? verbs[v]?.value.action() : false;
  if (verbHandled) return true;

  // Something went wrong, nothing handled the input!
  tell("I don't know how to do that.", 'error');
  return false;
};

/**
 * Handle Player Input
 *
 * When the player enters a command, this routine attempts to process it
 * by passing the text to the parser, which attempts to understand the
 * structure of the command and returns recognized tokens. If it can't
 * parse the command, then it returns an error, and we handle that here.
 * If it succeeds, the the parsed command is passed to `perform`.
 *
 * @param {string} command - the command we need to deal with
 * @returns boolean
 */
export const handlePlayerInput = (command = playerInput.value) => {
  console.log('HANDLE PLAYER INPUT', command);

  // Echo the command to the screen
  tell(`> ${command}`, 'command');

  // Parse the player's command
  const parsedPlayerInput = parser(command);

  // Handle any parser errors
  if (parsedPlayerInput.error) {
    console.error(parsedPlayerInput.error.message);
    tell(
      `Sorry, I don't understand the word “${parsedPlayerInput.error.token}.”`,
      'error'
    );
    playerInput.value = ''; // clear the input bar
    return false;
  }

  // Pass the parsed command to `perform`
  perform(
    parsedPlayerInput.verb.name,
    parsedPlayerInput.noun?.name,
    parsedPlayerInput.indirect?.name
  );
  playerInput.value = ''; // clear the input bar
  theMoves.value++; // TODO this should live in CLOCKER
  return true;
};

/**
 * Open/Close
 *
 * @param {object} item - the item to open or close.
 * @param {string} verb - whether to open or close the item.
 * @param {string} openMessage - the message to show when opening.
 * @param {string} closeMessage - the messgage to show when closing.
 */
export const openClose = (item, verb, openMessage, closeMessage) => {
  if (verb === 'open') {
    if (item.value.flags.isOpen) {
      tell(pickOne(dummyMessages));
      return;
    }
    // eslint-disable-next-line no-param-reassign
    item.value.flags.isOpen = true;
    tell(openMessage);
  } else {
    if (!item.value.flags.isOpen) {
      tell(pickOne(dummyMessages));
      return;
    }
    // eslint-disable-next-line no-param-reassign
    item.value.flags.isOpen = false;
    tell(closeMessage);
  }
};
