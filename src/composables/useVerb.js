import { ref } from 'vue';
import Verb from '../classes/Verb';
import { tell } from './useGlobal';

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
    test: () => {
      tell('🎉🎉🎉');
      return true;
    },
  })
);

export const verbs = { Kiss, Yell };
