import { ref } from 'vue';
import Verb from '../classes/Verb';
import { perform, tell, theDirect } from './useGlobal';
import { items } from './useItem';

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

export const Examine = ref(
  new Verb({
    name: 'Examine',
    synonym: ['examine', 'describe', 'what', 'whats', 'look at'],
    action: () => {
      const item = items[theDirect.value].value;
      if (item.text) {
        tell(item.text);
        return true;
      }
      if (item.flags?.isContainer || item.flags?.isDoor) {
        perform('LookInside', theDirect.value);
        return true;
      }
      tell(`There's nothing special about the ${item.name}.`);
      return true;
    },
  })
);

export const verbs = { Kiss, Yell, Examine };
