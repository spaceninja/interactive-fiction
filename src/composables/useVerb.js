import { ref } from 'vue';
import Verb from '../classes/Verb';
import { tell, theScore, theScoreMax, theMoves } from './useGlobal';

export const Kiss = ref(
  new Verb({
    name: 'Kiss',
    synonym: ['kiss', 'make out', 'smooch', 'hug'],
    action: () => {
      console.log('Kiss: default handler');
      tell("I'd sooner kiss a pig.");
      return true;
    },
  })
);

export const Yell = ref(
  new Verb({
    name: 'Yell',
    synonym: ['yell', 'shout', 'holler', 'berate'],
    action: () => {
      console.log('Yell: default handler');
      tell('Aaaarrrrgggghhhh!');
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
        console.log('score percent', scorePercent);
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
    },
  })
);

export const verbs = { Kiss, Yell, Score };
