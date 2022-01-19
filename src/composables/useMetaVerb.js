import { ref } from 'vue';
import Verb from '../classes/Verb';
import {
  tell,
  here,
  theDirect,
  theScore,
  theScoreMax,
  theMoves,
} from './useGlobal';
import { items } from './useItem';
import { verbs } from './useVerb';

export const PrintCont = ref(
  new Verb({
    name: 'PrintCont',
    synonym: ['print contents'],
    action: () => {
      tell('There are some objects here, I guess?');
      return true;
    },
  })
);

export const DescribeRoom = ref(
  new Verb({
    name: 'DescribeRoom',
    synonym: ['describe room'],
    action: () => {
      if (!here.value.flags.isOn) {
        tell('It is pitch black. You are likely to be eaten by a grue.');
        return false;
      }
      // TODO: add touched logic
      tell(here.value.name, 'room-name');
      // TODO: add vehicle logic
      tell(here.value.action('look'));
      return true;
    },
  })
);

export const DescribeObjects = ref(
  new Verb({
    name: 'DescribeObjects',
    synonym: ['describe objects'],
    action: () => {
      if (!here.value.flags.isOn) {
        tell("Only bats can see in the dark. And you're not one.");
        return false;
      }
      PrintCont.value.action(here.value);
      return true;
    },
  })
);

export const Look = ref(
  new Verb({
    name: 'Look',
    synonym: ['look', 'l', 'stare', 'gaze'],
    action: () => {
      const wasRoomDescribed = DescribeRoom.value.action();
      if (wasRoomDescribed) DescribeObjects.value.action();
      return true;
    },
  })
);

export const Test = ref(
  new Verb({
    name: 'Test',
    synonym: ['test'],
    action: () => {
      // Try the direct item's handler
      const itemTest = items[theDirect.value]?.value.test;
      const itemHandled = itemTest ? itemTest() : false;
      if (itemHandled) return true;

      // Nothing else handled it, so pass to the verb
      const verbTest = verbs[theDirect.value]?.value.test;
      const verbHandled = verbTest ? verbTest() : false;
      if (verbHandled) return true;

      // If it's not a verb, it might be a meta verb
      const metaVerbTest = metaVerbs[theDirect.value]?.value.test;
      const metaVerbHandled = metaVerbTest ? metaVerbTest() : false;
      if (metaVerbHandled) return true;

      tell("That item doesn't have a test routine.");
      return true;
    },
  })
);

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
        if (scorePercent >= 1) scoreRank = 'Master Adventurer';
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

export const metaVerbs = { Look, Score, Test };
