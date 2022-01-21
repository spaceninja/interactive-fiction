import { ref } from 'vue';
import Verb from '../classes/Verb';
import {
  tell,
  here,
  theDirect,
  theScore,
  theScoreMax,
  theMoves,
  handlePlayerInput,
} from './useGlobal';
import { rooms } from './useRoom';
import { items } from './useItem';
import { verbs } from './useVerb';

export const DescribeObject = ref(
  new Verb({
    name: 'DescribeObject',
    synonym: ['describe object'],
    action: (item, level = 0) => {
      console.group(`DESCRIBE OBJECT: ${item.value.name}, level ${level}`);
      if (level === 0) {
        if (item.value.descriptionFunction) {
          // TODO: test this
          console.log('Object has a description function');
          item.value.descriptionFunction();
        } else if (
          !item.value.flags.touchBit &&
          item.value.initialDescription
        ) {
          console.log(
            'Object is untouched and has an initial description function'
          );
          tell(item.value.initialDescription);
        } else if (item.value.description) {
          console.log('Object has a description');
          tell(item.value.description);
        } else {
          console.log('Using default object description');
          tell(
            `There is a ${item.value.name} here${
              item.value.flags.isOn ? ' (providing light)' : ''
            }.`
          );
        }
      } else {
        console.log('Object is nested, using indented default description');
        tell(
          `A ${item.value.name}${
            item.value.flags.isOn ? ' (providing light)' : ''
          }${item.value.flags.isWorn ? ' (being worn)' : ''}`,
          `indent-${level}`
        );
      }
      console.groupEnd();
    },
  })
);

export const getContents = (containerId) => {
  return Object.values(items).filter(
    (item) => item.value.location === containerId
  );
};

export const PrintCont = ref(
  new Verb({
    name: 'PrintCont',
    synonym: ['print contents'],
    action: (container) => {
      console.group(`PRINT CONTENTS: ${container}`);
      // get all items with this container set as their locations
      const containerItems = getContents(container);
      console.log(
        'CONTAINER ITEMS',
        containerItems.map((i) => i.value.name)
      );

      // if this container is empty, return early
      if (containerItems.length < 1) {
        console.log('NO ITEMS, RETURNING EARLY', containerItems);
        return true;
      }

      // loop over items and describe them
      containerItems.forEach((item) => {
        console.group(`ITEM LOOP: ${item.value.name}`);

        // if the item is invisible, return early
        if (item.value.flags.invisible) {
          console.log('ITEM IS INVISIBLE');
          return true;
        }

        // if the item is describable
        if (!item.value.flags.doNotDescribe) {
          console.log('ITEM IS DESCRIBABLE');
          DescribeObject.value.action(item);
        }
        if (item.value.flags.doNotDescribe) {
          console.log('ITEM IS NOT DESCRIBABLE');
        }

        // if the item is a container
        if (item.value.flags.isContainer) {
          console.log('ITEM IS A CONTAINER');
          if (item.value.flags.isTransparent || item.value.flags.isOpen) {
            console.log('ITEM IS OPEN OR TRANSPARENT');
            PrintCont.value.action(item.value.id);
          } else {
            console.log('ITEM IS CLOSED OR OPAQUE');
          }
        }
        console.groupEnd();
      });

      console.groupEnd();
      return true;
    },
  })
);

export const DescribeObjects = ref(
  new Verb({
    name: 'DescribeObjects',
    synonym: ['describe objects'],
    action: () => {
      if (!here.value.flags?.isOn) {
        tell("Only bats can see in the dark. And you're not one.");
        return false;
      }
      PrintCont.value.action(here.value.id);
      return true;
    },
  })
);

export const DescribeRoom = ref(
  new Verb({
    name: 'DescribeRoom',
    synonym: ['describe room'],
    action: () => {
      if (!here.value.flags?.isOn) {
        tell('It is pitch black. You are likely to be eaten by a grue.');
        return false;
      }
      // TODO: add touched logic
      tell(here.value.name, 'room-name');
      // TODO: add vehicle logic

      if (here.value.description) {
        tell(here.value.description);
        return true;
      }

      here.value.action('look');
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
    test: () => {
      here.value = rooms.DarkRoom.value;
      handlePlayerInput('look');
      here.value = rooms.RoomA.value;
      handlePlayerInput('look');
      here.value = rooms.RoomB.value;
      handlePlayerInput('look');
      here.value = rooms.LivingRoom.value;
      handlePlayerInput('look');
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
      console.log('TEST as item', theDirect.value, itemHandled);
      if (itemHandled) return true;

      // Nothing else handled it, so pass to the verb
      const verbTest = verbs[theDirect.value]?.value.test;
      const verbHandled = verbTest ? verbTest() : false;
      console.log('TEST as verb', theDirect.value, verbHandled);
      if (verbHandled) return true;

      // If it's not a verb, it might be a meta verb
      const metaVerbTest = metaVerbs[theDirect.value]?.value.test;
      const metaVerbHandled = metaVerbTest ? metaVerbTest() : false;
      console.log('TEST as meta verb', theDirect.value, metaVerbHandled);
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
