import { ref, Ref } from 'vue';
import { pickOne } from '../../helpers/pickOne';
import { uuid } from '../../helpers/uuid';
import { sortByPriority } from '../../helpers/sortByPriority';
import { parser } from './useParser';
import Item from '../../classes/Item';
import Room from '../../classes/Room';
import Verb from '../../classes/Verb';
import * as rawItems from '../useItem';
import * as rawRooms from '../useRoom';
import * as rawVerbs from '../useVerb';
import * as rawGameVerbs from './useGameVerb';

// Have to redeclare these with types, which is dumb
const items = rawItems as { [key: string]: Ref<Item> };
const rooms = rawRooms as { [key: string]: Ref<Room> };
const verbs = rawVerbs as { [key: string]: Ref<Verb> };
const gameVerbs = rawGameVerbs as { [key: string]: Ref<Verb> };

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
export const winner = ref(player.value); // the current actor (player or NPC)

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
  here.value = rooms.WestOfHouse.value;
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
 *
 * This routine takes one argument, which should be a room. It sends the player
 * to that room, and does all the appropriate things, such as call the room's
 * action routine with M-ENTER, and call the describers. Walk, the routine
 * which normally handles all movement, calls this routine; however, there are
 * many instances when you will want to call it yourself, such as when the
 * player pushes the button in the teleportation booth.
 *
 * @param roomId - ID of the room to go to
 */
export const goTo = (roomId: string) => {
  here.value = rooms[roomId].value;
  // TODO: update lighting info
  // TODO: run room's ENTER action
  // TODO: handle score
  perform('Look');
};

/**
 * Handle Player Input
 * This is the equivalent of the main loop in Zork.
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
      `You used the word “${parsedPlayerInput.error.token}”
       in a way that I don't understand.`,
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
  const indirectHandled = i ? items[i]?.value.action() : false;
  if (indirectHandled) return true;

  // Try the direct item's handler
  const directHandled = d ? items[d]?.value.action() : false;
  if (directHandled) return true;

  // Nothing else handled it, so pass to the verb
  const verbHandled = v ? verbs[v]?.value.action() : false;
  if (verbHandled) return true;

  // If it's not a verb, it might be a game verb
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

/**
 * Openable?
 *
 * This routine takes an object and checks whether it's openable.
 * (i.e. is a door or a container)
 *
 * @param item - The item to evaluate
 * @returns
 */
export const openable = (item: Ref<Item>) => {
  return item.value.flags.isDoor || item.value.flags.isContainer;
};

/**
 * See Inside?
 *
 * A small routine which takes an object—a container—and returns true
 * if the player can see the contents of the container.
 * (i.e. is it open or transparent)
 *
 * @param item - The container to evaluate
 * @returns boolean
 */
export const seeInside = (item: Ref<Item>) => {
  return (
    !item.value.flags.isInvisible &&
    (item.value.flags.isTransparent || item.value.flags.isOpen)
  );
};

/**
 * Global In?
 *
 * This routine takes two arguments, an object and a room, and returns true
 * if the object is a local-global in that room.
 *
 * @param item
 * @returns boolean
 */
export const globalIn = (item: Ref<Item>, room: Ref<Room>) => {
  return room.value.global?.includes(item.value.id);
};

/**
 * In?
 *
 * Takes an argument, an object, as well as an optional argument, which can be
 * either a room or an object. If no optional argument is supplied, it assumes
 * that the second argument is the PLAYER object. Takes the first object and
 * determines if it is directly within the second object, without recursion.
 *
 * @param item - The item to look for
 * @param container - The container to check for the item (defaults to the player)
 * @returns boolean
 */
export const inside = (
  item: Ref<Item>,
  container: Ref<Item | Room> = winner
) => {
  return item.value.location === container.value.id;
};

/**
 * Held?
 *
 * Takes an argument, an object, as well as an optional argument, which can be
 * either a room or an object. If no optional argument is supplied, it assumes
 * that the second argument is the PLAYER object. Takes the first object and
 * recurses to determine if it is ultimately within the second object.
 *
 * @param item - The item to look for
 * @param container - The container to check for the item (defaults to the player)
 * @returns boolean
 */
export const held = (
  item: Ref<Item | Room>,
  container: Ref<Item | Room> = winner
): boolean => {
  const location = item.value.location;
  // if no location, or item in rooms, return false
  if (!location || location === 'rooms') return false;
  // if item in container, return true
  if (inside(item, container)) return true;
  // else, recurse a level deeper
  if (location in rooms) return held(rooms[location], container);
  return held(items[location], container);
};

/**
 * Meta Location
 *
 * This routine take the supplied object and recurses until it determines what
 * room the object is currently in, then returns that room. It will return false
 * if the ultimate location of the supplied object is not a room: for example,
 * if the object has been removed (its location is falsy), or if the object is
 * inside an object which has been removed, etc.
 *
 * @param item
 * @returns (Room | boolean)
 */
export const metaLocation = (item: Ref<Item | Room>): Ref<Room> | false => {
  const location = item.value.location;
  // if no location, return false
  if (!location) return false;
  // TODO: if the item is in global objects, return global objects
  // if the item is in rooms, return the object
  if (location === 'rooms') return item as Ref<Room>;
  // else, recurse a level deeper
  if (location in rooms) return metaLocation(rooms[location]);
  return metaLocation(items[location]);
};

/**
 * Get Contents
 * Returns an array containing all the items this container holds.
 *
 * @param containerId - ID of the container to search
 * @returns array
 */
export const getContents = (containerId: string) => {
  return Object.values(items)
    .filter((item) => item.value.location === containerId)
    .sort(sortByPriority);
};

/**
 * Visible?
 *
 * This routine returns true if the supplied object is visible to the player;
 * that is, if it can be currently referred to.
 *
 * @param item - The item to evaluate
 * @returns boolean
 */
export const visible = (item: Ref<Item>) => {
  return !item.value.flags.isInvisible;
};

/**
 * Accessible?
 *
 * This routine returns true if the supplied object is visible to the player and
 * can be gotten. For example, an object inside a closed, transparent container
 * would be visible but not accessible.
 *
 * @param item - The item to evaluate
 * @returns boolean
 */
export const accessible = (item: Ref<Item>) => {
  const itemLocation = item.value.location;
  const metaLoc = metaLocation(item);
  const itemMetaLocation = metaLoc ? metaLoc.value.id : metaLoc;
  // if item is invisible, return false
  if (item.value.flags.isInvisible) return false;
  // if item has no location, return false
  if (!itemLocation) return false;
  // TODO: if item is a global object, return true
  // if item is a local global here, return true
  if (globalIn(item, here)) return true;
  // if the item is neither here nor where the player is, return false
  if (
    itemMetaLocation &&
    !(
      itemMetaLocation === here.value.id ||
      itemMetaLocation === winner.value.location
    )
  ) {
    return false;
  }
  // if the item is here, carried by the player, or where the player is, return true
  if (
    itemLocation === winner.value.id ||
    itemLocation === here.value.id ||
    itemLocation === winner.value.location
  ) {
    return true;
  }
  // if the item's location is open and accessible, return true
  if (
    itemLocation in items &&
    items[itemLocation].value.flags.isOpen &&
    accessible(items[itemLocation])
  ) {
    return true;
  }
  // else return false;
  return false;
};
