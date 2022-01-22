import { tell, here } from './useGame';
import { rooms } from '../useRoom';
import { items } from '../useItem';

/**
 * Get Contents
 * Returns an array containing all the items this container holds.
 *
 * @param {string} containerId - ID of the container to search
 * @returns array
 */
export const getContents = (containerId) => {
  return Object.values(items).filter(
    (item) => item.value.location === containerId
  );
};

/**
 * Describe Object
 * Determines the best way to describe an object.
 *
 * @param {object} item - The object to describe.
 * @param {number} level - How many levels of nesting containers this object is in.
 */
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

/**
 * Describe Contents
 * Determines the best way to describe the items a container holds.
 *
 * @param {object} container - the container to describe the contents of
 * @param {number} level - How many levels of nesting containers this object is in.
 * @returns boolean
 */
const describeContents = (container, level = 0) => {
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
        describeContents(item.value.id, level);
        level--;
      } else {
        console.log('Item is closed or opaque container');
      }
    }
    console.groupEnd();
  });

  console.groupEnd();
  return true;
};

/**
 * Container List Intro
 * Determines the proper way to introduce the list of a container's objects.
 *
 * @param {object} container - the container to introduce
 * @param {number} level - How many levels of nesting containers this container is in.
 */
const containerListIntro = (container, level = 0) => {
  console.group(`CONTAINER LIST INTRO, ${container.value.id}, level ${level}`);
  // if (container.value.id === Winner.value.id) {
  //   console.log('Container is the player');
  //   tell('You are carrying:');
  // } else
  if (Object.keys(rooms).includes(container.value.id)) {
    console.log('Container is a room, do not print a container list intro.');
  } else if (container.value.flags.isSurface) {
    console.log('Container is a surface');
    tell(`Sitting on the ${container.value.name} is:`, `indent-${level}`);
  } else if (container.value.flags.isActor) {
    console.log('Container is an actor');
    tell(`The ${container.value.name} is holding:`, `indent-${level}`);
  } else {
    console.log('Container is a simple container. Using default intro.');
    tell(`The ${container.value.name} contains:`, `indent-${level}`);
  }
  console.groupEnd();
};

/**
 * Describe Objects Here
 * Describes all the objects in the current room, if the room is lit.
 *
 * @returns boolean
 */
export const describeHereObjects = () => {
  if (!here.value.flags?.isOn) {
    tell("Only bats can see in the dark. And you're not one.");
    return false;
  }
  describeContents(here.value.id, -1);
  return true;
};

/**
 * Describe Here
 * Determines the best way to describe the current room, if the room is lit.
 *
 * @returns boolean
 */
export const describeHere = () => {
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
};
