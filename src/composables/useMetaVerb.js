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

export const describeObject = (item, level = 0) => {
  console.group(`DESCRIBE OBJECT: ${item.value.id}, level ${level}`);
  if (level < 1) {
    if (item.value.descriptionFunction) {
      // TODO: test this
      console.log('Object has a description function');
      item.value.descriptionFunction();
    } else if (!item.value.flags.touchBit && item.value.initialDescription) {
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
};

export const containerListIntro = (container, level = 0) => {
  console.group(`CONTAINER LIST INTRO, ${container.value.id}, level ${level}`);
  // if (container.value.id === Winner.value.id) {
  //   tell('You are carrying:');
  // }
  if (Object.keys(rooms).includes(container.value.id)) {
    console.log('Container is a room, do not print a container list intro.');
    return true;
  }
  if (container.value.flags.isSurface) {
    console.log('Container is a surface');
    tell(`Sitting on the ${container.value.name} is:`, `indent-${level}`);
    return true;
  }
  if (container.value.flags.isActor) {
    console.log('Container is an actor');
    tell(`The ${container.value.name} is holding:`, `indent-${level}`);
    return true;
  }
  console.log('Container is a simple container. Using default intro.');
  tell(`The ${container.value.name} contains:`, `indent-${level}`);
  console.groupEnd();
};

export const getContents = (containerId) => {
  return Object.values(items).filter(
    (item) => item.value.location === containerId
  );
};

export const PrintCont = ref(
  new Verb({
    name: 'PrintCont',
    synonym: ['print contents'],
    action: (container, level = 0) => {
      console.group(`PRINT CONTENTS: ${container}, level ${level}`);
      // get all items with this container set as their locations
      const containerItems = getContents(container);
      console.log(
        'Container items:',
        containerItems.map((i) => i.value.name)
      );

      // if this container is empty, return early
      if (containerItems.length < 1) {
        console.log('No items, returning early', containerItems);
        return true;
      }

      // loop over items and describe them
      containerItems.forEach((item) => {
        console.group(`ITEM LOOP: ${item.value.id}, level ${level}`);

        // if the item is invisible, return early
        if (item.value.flags.invisible) {
          console.log('Item is invisible');
          return true;
        }

        // if the item is describable
        if (!item.value.flags.doNotDescribe) {
          console.log('Item is describable');
          describeObject(item, level);
          if (
            item.value.flags.isContainer &&
            (item.value.flags.isTransparent || item.value.flags.isOpen)
          ) {
            containerListIntro(item, level);
          }
        } else {
          console.log('Item is not describable');
        }

        // if the item is a container
        if (item.value.flags.isContainer) {
          if (item.value.flags.isTransparent || item.value.flags.isOpen) {
            console.log('Item is open or transparent container');
            level++;
            PrintCont.value.action(item.value.id, level);
            level--;
          } else {
            console.log('Item is closed or opaque container');
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
      PrintCont.value.action(here.value.id, -1);
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
