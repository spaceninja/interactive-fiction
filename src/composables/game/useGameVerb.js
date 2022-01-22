import { ref } from 'vue';
import Verb from '../../classes/Verb';
import {
  tell,
  here,
  theDirect,
  theScore,
  theScoreMax,
  theMoves,
  handlePlayerInput,
} from './useGame';
import { describeHere, describeHereObjects } from './useDescriber';
import * as rooms from '../useRoom';
import * as items from '../useItem';
import * as verbs from '../useVerb';
// this is dumb, but I need to refer to an unknown gameVerb in test
import * as gameVerbs from './useGameVerb';

/**
 * Look
 * Describe the current room and its contents.
 */
export const Look = ref(
  new Verb({
    name: 'Look',
    synonym: ['look', 'l', 'stare', 'gaze'],
    action: () => {
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
        let scorePercent = theScore.value / theScoreMax.value;
        if (scorePercent > 0.05) scoreRank = 'Amateur Adventurer';
        if (scorePercent > 0.3) scoreRank = 'Novice Adventurer';
        if (scorePercent > 0.45) scoreRank = 'Junior Adventurer';
        if (scorePercent > 0.6) scoreRank = 'Adventurer';
        if (scorePercent > 0.75) scoreRank = 'Master';
        if (scorePercent > 0.9) scoreRank = 'Wizard';
        if (scorePercent === 1) scoreRank = 'Master Adventurer';
        if (scorePercent > 1) scoreRank = 'Double Wizard';
        let rankMessage = `This gives you a rank of ${scoreRank}.`;
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
