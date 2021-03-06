import { ref, Ref } from 'vue';
import Verb from '../../classes/Verb';
import Item from '../../classes/Item';
import Room from '../../classes/Room';
import {
  tell,
  here,
  theDirect,
  theScore,
  theScoreMax,
  theMoves,
  handlePlayerInput,
  getContents,
  winner,
} from './useGame';
import {
  describeHere,
  describeHereObjects,
  describeContents,
} from './useDescriber';
import * as rawRooms from '../useRoom';
import * as rawItems from '../useItem';
import * as rawVerbs from '../useVerb';
// this is dumb, but I need to refer to an unknown gameVerb in test
import * as rawGameVerbs from './useGameVerb';

// Have to redeclare these with types, which is dumb
const rooms = rawRooms as { [key: string]: Ref<Room> };
const items = rawItems as { [key: string]: Ref<Item> };
const verbs = rawVerbs as { [key: string]: Ref<Verb> };
const gameVerbs = rawGameVerbs as { [key: string]: Ref<Verb> };

export const Inventory = ref(
  new Verb({
    name: 'Inventory',
    synonym: ['inventory'],
    action: () => {
      console.log('INVENTORY!');
      // get all items with this container set as their locations
      const winnerItems = getContents(winner.value.id);
      console.log(
        'Winner items:',
        winnerItems.map((i) => i.value.id)
      );

      // if this container is empty, return early
      if (winnerItems.length > 0) {
        describeContents(winner.value.id);
      } else {
        tell('You are empty-handed.');
      }
      return true;
    },
    test: () => {
      items.Sword.value.location = winner.value.id;
      items.SandwichBag.value.location = winner.value.id;
      items.Map.value.location = winner.value.id;
      items.OwnersManual.value.location = winner.value.id;
      items.Lamp.value.location = winner.value.id;
      items.Lamp.value.flags.isOn = true;
      items.SandwichBag.value.flags.isOpen = true;
      handlePlayerInput('inventory');
      return true;
    },
  })
);

/**
 * Game Verbs
 * Special commands like "look" and "inventory."
 * Typically, game verbs should be used as a single word.
 *
 * Keep alphabetized! Add the `priority` flag if you need the verbs sorted.
 *
 * Nothing should live in this file except Vue refs containing a Verb,
 * because the contents of this file build the list of game-verbs for the game.
 */

/**
 * Look
 * Describe the current room and its contents.
 */
export const Look = ref(
  new Verb({
    name: 'Look',
    synonym: ['look', 'stare', 'gaze'],
    action: () => {
      console.log('LOOK!');
      const wasRoomDescribed = describeHere();
      if (wasRoomDescribed) describeHereObjects();
      return true;
    },
    test: () => {
      here.value = rooms.Attic.value;
      handlePlayerInput('look');
      here.value = rooms.Cellar.value;
      handlePlayerInput('look');
      here.value = rooms.TrollRoom.value;
      handlePlayerInput('look');
      here.value = rooms.LivingRoom.value;
      handlePlayerInput('look');
      here.value = rooms.Kitchen.value;
      handlePlayerInput('look');
      return true;
    },
  })
);

/**
 * Score
 * Tell the player's current score and rank.
 */
export const Score = ref(
  new Verb({
    name: 'Score',
    synonym: ['score'],
    action: () => {
      let scoreMessage = `Your score is ${theScore.value}`;
      if (theScoreMax.value) {
        scoreMessage += ` of a total of ${theScoreMax.value},`;
      }
      scoreMessage += ` in ${theMoves.value} ${
        theMoves.value === 1 ? 'move' : 'moves'
      }.`;
      tell(scoreMessage);
      if (theScoreMax.value) {
        let scoreRank = 'Beginner';
        const scorePercent = theScore.value / theScoreMax.value;
        if (scorePercent > 0.05) scoreRank = 'Amateur Adventurer';
        if (scorePercent > 0.3) scoreRank = 'Novice Adventurer';
        if (scorePercent > 0.45) scoreRank = 'Junior Adventurer';
        if (scorePercent > 0.6) scoreRank = 'Adventurer';
        if (scorePercent > 0.75) scoreRank = 'Master';
        if (scorePercent > 0.9) scoreRank = 'Wizard';
        if (scorePercent === 1) scoreRank = 'Master Adventurer';
        if (scorePercent > 1) scoreRank = 'Double Wizard';
        const rankMessage = `This gives you a rank of ${scoreRank}.`;
        tell(rankMessage);
      }
      return true;
    },
    test: () => {
      console.log('Score: test handler');
      Score.value.action();
      theScoreMax.value = 100;
      Score.value.action();
      theScore.value = 6;
      Score.value.action();
      theScore.value = 31;
      Score.value.action();
      theScore.value = 46;
      Score.value.action();
      theScore.value = 61;
      Score.value.action();
      theScore.value = 76;
      Score.value.action();
      theScore.value = 91;
      Score.value.action();
      theScore.value = 100;
      Score.value.action();
      theScore.value = 105;
      Score.value.action();
      return true;
    },
  })
);

/**
 * Test
 * Helper verb to run an object's `test` method.
 */
export const Test = ref(
  new Verb({
    name: 'Test',
    synonym: ['test'],
    action: () => {
      // Try the direct item's handler
      const itemTest = items[theDirect.value]?.value.test;
      const itemHandled = itemTest ? itemTest() : false;
      console.log('TEST as item', theDirect.value, itemHandled);
      if (itemHandled) return true;

      // Nothing else handled it, so pass to the verb
      const verbTest = verbs[theDirect.value]?.value.test;
      const verbHandled = verbTest ? verbTest() : false;
      console.log('TEST as verb', theDirect.value, verbHandled);
      if (verbHandled) return true;

      // If it's not a verb, it might be a game verb
      const gameVerbTest = gameVerbs[theDirect.value]?.value.test;
      const gameVerbHandled = gameVerbTest ? gameVerbTest() : false;
      console.log('TEST as game verb', theDirect.value, gameVerbHandled);
      if (gameVerbHandled) return true;

      tell("That item doesn't have a test routine.");
      return true;
    },
  })
);
