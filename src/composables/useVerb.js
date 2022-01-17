import { ref } from 'vue';
import Verb from '../classes/Verb';
import { tell } from './useGlobal';

export const Kiss = ref(
  new Verb({
    name: 'Kiss',
    synonym: ['kiss', 'make out', 'smooch', 'hug'],
    action: () => {
      tell("I'd sooner kiss a pig.");
    },
  })
);

export const verbs = { Kiss };
