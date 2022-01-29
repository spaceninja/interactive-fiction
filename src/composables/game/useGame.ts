import { ref, Ref } from 'vue';
import { pickOne } from '../../helpers/pickOne';
import { uuid } from '../../helpers/uuid';
import Item from '../../classes/Item';
import * as items from '../useItem';
import * as verbs from '../useVerb';
import * as rooms from '../useRoom';
import * as gameVerbs from './useGameVerb';
import { parser } from './useParser';

interface Output {
  message: string;
  className: string | undefined;
  key: string;
}

// game meta variables
export const theScore = ref(0);
export const theScoreMax = ref<number | null>(null);
export const theMoves = ref(0);
export const showHelp = ref(false);

// parser variables
export const playerInput = ref('');
export const theVerb = ref('');
export const theDirect = ref('');
export const theIndirect = ref('');
export const theOutput = ref<Output[]>([]);
export const it = ref('');

// game state variables
export const here = ref(rooms.LivingRoom.value);
export const player = ref(items.Adventurer.value); // the player
export const winner = ref(player.value); // the current actor, not always the player

// global flags (TODO get rid of these in favor of item/room flags)
export const magicFlag = ref(false);

// TODO see if we need this, relocate if so
export const dummyMessages = [
  'Look around.',
  'Too late for that.',
  'Have your eyes checked.',
];

/**
 * Initialize the Game
 * Used to set or reset the initial state of the game, print the version
 * info, and perform a `LOOK` command for the player.
 */
export const init = () => {
  // set starting location
  here.value = rooms.LivingRoom.value;
  // reset winner to the player
  winner.value = player.value;
  // move the winner to the starting location
  winner.value.location = here.value.id;
  // turn on the lights (TODO: debug only)
  here.value.flags.isOn = true;
  // Look around you!
  perform('Look');
};

/**
 * Go To
 * Move the player to the room, handle room change things, and LOOK
 *
 * @param roomId - ID of the room to go to
 */
export const goTo = (roomId: string) => {
  // @ts-ignore
  here.value = rooms[roomId].value;
  // TODO: update lighting info
  // TODO: run room's ENTER action
  // TODO: handle score
  perform('Look');
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
 * @param command - the command we need to deal with
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
 * @param item - the item to open or close.
 * @param verb - whether to open or close the item.
 * @param openMessage - the message to show when opening.
 * @param closeMessage - the messgage to show when closing.
 */
export const openClose = (
  item: Ref<Item>,
  verb: string,
  openMessage: string,
  closeMessage: string
) => {
  if (verb === 'Open') {
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
 * @param v - the Verb to perform.
 * @param d - the Direct Noun receives the action of the verb.
 * @param i - the Indirect Noun receives the direct item.
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
 * Tell
 *
 * Adds text to the on-screen output.
 *
 * @param message - the text to display.
 * @param className - a CSS class to add to the text.
 */
export const tell = (message: string, className?: string) => {
  theOutput.value.push({ message, className, key: uuid() });
};
