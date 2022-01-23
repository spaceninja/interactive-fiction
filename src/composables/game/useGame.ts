import { ref } from 'vue';
import { pickOne } from '../../helpers/pickOne';
import { uuid } from '../../helpers/uuid';
import * as items from '../useItem';
import * as verbs from '../useVerb';
import * as rooms from '../useRoom';
import * as gameVerbs from './useGameVerb';
import { parser } from './useParser';

export const here = ref(rooms.Kitchen.value);
export const theScore = ref(0);
export const theScoreMax = ref<number | null>(null);
export const theMoves = ref(0);
export const showHelp = ref(false);

export const playerInput = ref('');
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
  // @ts-ignore
  items[theDirect.value].value.action(theVerb.value);
};

/**
 * Tell
 *
 * Adds text to the on-screen output.
 *
 * @param message - the text to display.
 * @param className - a CSS class to add to the text.
 */
export const tell = (message: string, className?: string) => {
  // @ts-ignore
  theOutput.value.push({ message, className, key: uuid() });
};

/**
 * Perform
 *
 * The parser translates the command "Hit the Troll with the Rock" into
 * a Verb (Hit), a Direct Noun (Troll), and an Indirect Noun (Rock).
 *
 * This routine saves those tokens to global state, and tries to handle
 * the command by calling the action handlers of the Indirect Noun followed
 * by the Direct Noun, followed by the Verb iteself.
 *
 * If none of those handle the command, then a simple fallback is used.
 *
 * @param {string} v - the Verb to perform.
 * @param {string} d - the Direct Noun receives the action of the verb.
 * @param {string} i - the Indirect Noun receives the direct item.
 * @returns boolean
 */
export const perform = (v = '', d = '', i = '') => {
  console.log('PERFORM', v, d, i);

  // Save the tokens to their global variables
  theVerb.value = v;
  theDirect.value = d;
  theIndirect.value = i;

  // Try the indirect item's handler
  // @ts-ignore
  const indirectHandled = i ? items[i]?.value.action() : false;
  if (indirectHandled) return true;

  // Try the direct item's handler
  // @ts-ignore
  const directHandled = d ? items[d]?.value.action() : false;
  if (directHandled) return true;

  // Nothing else handled it, so pass to the verb
  // @ts-ignore
  const verbHandled = v ? verbs[v]?.value.action() : false;
  if (verbHandled) return true;

  // If it's not a verb, it might be a game verb
  // @ts-ignore
  const gameVerbHandled = v ? gameVerbs[v]?.value.action() : false;
  if (gameVerbHandled) return true;

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
    console.error(parsedPlayerInput.error);
    tell(
      `You used the word “${parsedPlayerInput.error.token}” in a way that I don't understand.`,
      'error'
    );
    playerInput.value = ''; // clear the input bar
    return false;
  }

  // Pass the parsed command to `perform`
  console.log('PARSED PLAYER INPUT', parsedPlayerInput);
  perform(
    parsedPlayerInput.verb?.name,
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
export const openClose = (
  // @ts-ignore
  item,
  verb: string,
  openMessage: string,
  closeMessage: string
) => {
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
