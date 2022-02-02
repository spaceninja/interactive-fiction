import { Ref } from 'vue';
import { tell, here, getContents, winner, seeInside } from './useGame';
import Item from '../../classes/Item';
import Room from '../../classes/Room';
import * as rawItems from '../useItem';
import * as rawRooms from '../useRoom';

// Have to redeclare these with types, which is dumb
const items = rawItems as { [key: string]: Ref<Item> };
const rooms = rawRooms as { [key: string]: Ref<Room> };

/**
 * Describe Object
 * Determines the best way to describe an object.
 *
 * @param item - The object to describe.
 * @param level - How many levels of nesting containers this object is in.
 */
export const describeObject = (item: Ref<Item>, level = 0) => {
  console.group(`DESCRIBE OBJECT: ${item.value.id}, level ${level}`);
  if (level === 0) {
    if (item.value.descriptionFunction) {
      // TODO: test this
      console.log('Object has a description function');
      item.value.descriptionFunction();
    } else if (!item.value.flags.touchBit && item.value.initialDescription) {
      console.log(
        'Object is untouched and has an initial description function',
        item.value.initialDescription
      );
      tell(item.value.initialDescription);
    } else if (item.value.description) {
      console.log('Object has a description', item.value.description);
      tell(item.value.description);
    } else {
      console.log(
        'Using default object description',
        `There is a ${item.value.name} here`
      );
      tell(
        `There is a ${item.value.name} here${
          item.value.flags.isOn ? ' (providing light)' : ''
        }.`
      );
    }
  } else {
    console.log(
      'Object is nested, using indented default description',
      `A ${item.value.name}`
    );
    tell(
      `A ${item.value.name}${
        item.value.flags.isOn ? ' (providing light)' : ''
      }${item.value.flags.isWorn ? ' (being worn)' : ''}`,
      `indent-${level}`
    );
  }
  // if you can see items inside, describe them
  if (seeInside(item) && getContents(item.value.id)) {
    console.log('Object has visible items inside');
    describeContents(item.value.id, false, level);
  } else {
    console.log('Object has no visible items inside');
  }
  console.groupEnd();
};

/**
 * Describe Contents
 * Determines the best way to describe the items a container holds.
 *
 * TODO: see if we can simplify this beast of a routine
 *
 * @param container - the container to describe the contents of
 * @param verbose - Whether to use long descriptions or not
 * @param level - How many levels of nesting containers this object is in.
 * @returns boolean
 */
export const describeContents = (
  containerId: string,
  verbose = false,
  level = 0
) => {
  console.groupCollapsed(`PRINT CONTENTS: ${containerId}, level ${level}`);

  // get the container item itself for reference
  let containerItem: Ref<Room | Item>;
  if (containerId in rooms) {
    containerItem = rooms[containerId];
  } else {
    containerItem = items[containerId];
  }
  console.log('Container Item', containerItem.value);

  // get all items with this container set as their locations
  const containerItems = getContents(containerId);
  console.log(
    'Container items:',
    containerItems.map((i) => i.value.id)
  );

  // get the winner's location object
  // let winnerLocation: Ref<Room | Item>;
  // if (winner.value.location) {
  //   if (winner.value.location in rooms) {
  //     winnerLocation = rooms[winner.value.location];
  //   } else {
  //     winnerLocation = items[winner.value.location];
  //   }
  //   console.log('Winner Location', winnerLocation.value);
  // }

  // if this container is empty, return early
  if (containerItems.length < 1) {
    console.log('No items, returning early', containerItems);
    return true;
  }

  const actorVehicle = false;
  const isActorVehicle = false;
  let isInventory = false;

  // TODO handle if player is in vehicle
  // if (winnerLocation.value.flags.isVehicle) {
  //   actorVehicle = winnerLocation.value.id;
  // }

  // Set safety check variables
  let first = true;
  let shit = true;

  // Loop over items, describe untouched items with initialDescription,
  // check for special cases like if the items are in the player's inventory,
  // or if the item is in the player's vehicle.

  // if our container is the player's inventory (or inside)
  if (
    winner.value.id === containerId ||
    winner.value.id === containerItem.value.location
  ) {
    console.log('PLAYER INVENTORY');
    isInventory = true;
  }

  // if we're not in the player's inventory, loop over the items
  else {
    console.log('NOT PLAYER INVENTORY');
    containerItems.forEach((item) => {
      console.group(`ITEM LOOP 1: ${item.value.id}, level ${level}`);

      // get the item's location object
      const itemLocation: Ref<Room | Item> | null = item.value.location
        ? item.value.location in rooms
          ? rooms[item.value.location]
          : items[item.value.location]
        : null;

      // if the current item is the player's vehicle, set isActorVehicle,
      // and don't describe it.
      if (actorVehicle) {
        // TODO handle if player is in vehicle
      }

      // if the current item is not the player's vehicle, is visible,
      // and has an initialDescription, and has not been touched, describe it.
      else if (
        !item.value.flags.isInvisible &&
        !item.value.flags.touchBit &&
        item.value.initialDescription
      ) {
        console.log(
          'item is not invisible, has not been touched, and has an initial description'
        );
        // if the item is describable, tell the description
        if (!item.value.flags.doNotDescribe) {
          console.log('item is describable', item.value.initialDescription);
          tell(item.value.initialDescription);
          // disable the safety check, since we described an item.
          shit = false;
        } else {
          console.warn('item is has doNotDescribe set');
        }

        // if we can see items inside the item and the item's location does
        // not have a describe function, describe the content
        if (
          seeInside(item) &&
          itemLocation?.value.descriptionFunction &&
          getContents(item.value.id)
        ) {
          console.log(
            `item has contents we can see, and location does not have a describe
            function. calling describeContents for this item`
          );
          const contentsDescribed = describeContents(item.value.id, verbose, 0);

          // if we were able to describe the contents of the item
          if (contentsDescribed) {
            // record this isn't the first time through the loop
            first = false;
          }
        } else {
          if (!seeInside(item)) console.warn("can't see inside item");
          if (!getContents(item.value.id)) console.warn('item has no contents');
        }
      }

      // item might be invisible, touched, or not have an initial description
      else {
        if (item.value.flags.isInvisible) console.warn('item is invisible');
        if (item.value.flags.touchBit) console.warn('item has been touched');
        if (!item.value.initialDescription)
          console.warn('item has no initial description');
      }

      console.groupEnd();
    });
  }

  // Loop over items, describe touched items, items with no initialDescription,
  // and items in the player's inventory
  containerItems.forEach((item) => {
    console.group(`ITEM LOOP 2: ${item.value.id}, level ${level}`);

    // if there is no item
    // this makes no sense to me, we should never enter this condition
    if (!item) {
      console.warn('there is no item!');
      // if this item is the player's vehicle and it contains items
      if (isActorVehicle && actorVehicle && getContents(actorVehicle)) {
        console.log("The item is the player's vehicle and contains items");
        // increase level as we go deeper
        level++;
        // describe the contents of the player's vehicle
        describeContents(actorVehicle, verbose, level);
      }
      // break the loop
      console.groupEnd;
      return true;
    }

    // if there is an item
    // if the item is visible and is either in the player's inventory,
    // or does not have an initial description, or has been touched, describe it.
    else if (
      !item.value.flags.isInvisible &&
      (isInventory ||
        item.value.flags.touchBit ||
        !item.value.initialDescription)
    ) {
      // if the item is describable
      if (!item.value.flags.doNotDescribe) {
        console.log('item is describable');
        // if this is our first time through the loop
        if (first) {
          console.log(
            'this is our first time through, print container list intro'
          );
          // call the container list intro routine
          // note: this was wrapped in a condition in zork, but it always returns true
          if (containerListIntro(containerItem, level)) {
            // if level is less than 0, set it to 0
            if (level < 0) {
              level = 0;
            }
          }

          // increase level as we go deeper, and
          level++;

          // record this isn't the first time through the loop
          first = false;
        }

        // if level is less than 0, set it to 0
        if (level < 0) {
          level = 0;
        }

        // describe the item
        describeObject(
          item,
          // verbose,
          level
        );
      }

      // if the item is not describable, but we can see items inside
      else if (getContents(item.value.id) && seeInside(item)) {
        console.log('item has doNotDescribe set, but we can see items inside');
        // increase level
        level++;
        // print contents of item
        describeContents(item.value.id, verbose, level);
        // reset level
        level--;
      }

      // else,
      else {
        console.warn('item is has doNotDescribe set and no contents');
      }
    }

    // item is invisible, or visible but not in player's inventory, untouched,
    // or has a describe function
    else {
      if (item.value.flags.isInvisible) console.warn('item is invisible');
      if (!isInventory) console.warn('item is not in inventory');
      if (!item.value.flags.touchBit) console.warn('item is untouched');
      if (item.value.initialDescription)
        console.warn('item has an initial description');
    }

    console.groupEnd();
  });

  // Safety check before returning true
  if (first && shit) {
    console.warn('PRINT-CONT ERROR', { first, shit });
    console.groupEnd();
    return false;
  } else {
    console.info('PRINT-CONT SUCCESS', { first, shit });
    console.groupEnd();
    return true;
  }
};

/**
 * Container List Intro
 * Determines the proper way to introduce the list of a container's objects.
 *
 * @param container - the container to introduce
 * @param level - How many levels of nesting containers this container is in.
 */
const containerListIntro = (container: Ref<Item>, level = 0) => {
  console.group(`CONTAINER LIST INTRO, ${container.value.id}, level ${level}`);
  if (container.value.id === winner.value.id) {
    console.log('Container is the player', `You are carrying:`);
    tell('You are carrying:');
  } else if (container.value.id in rooms) {
    console.warn('Container is a room, do not print a container list intro.');
    return false;
  } else if (container.value.flags.isSurface) {
    console.log(
      'Container is a surface',
      `Sitting on the ${container.value.name} is:`
    );
    tell(`Sitting on the ${container.value.name} is:`, `indent-${level}`);
  } else if (container.value.flags.isActor) {
    console.log(
      'Container is an actor',
      `The ${container.value.name} is holding:`
    );
    tell(`The ${container.value.name} is holding:`, `indent-${level}`);
  } else {
    console.log(
      'Container is a simple container. Using default intro.',
      `The ${container.value.name} contains:`
    );
    tell(`The ${container.value.name} contains:`, `indent-${level}`);
  }
  console.groupEnd();
  return true;
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
  describeContents(here.value.id, false, -1);
  return true;
};

/**
 * Describe Here
 * Determines the best way to describe the current room, if the room is lit.
 *
 * @returns boolean
 */
export const describeHere = () => {
  if (!here.value.flags.isOn) {
    tell('It is pitch black. You are likely to be eaten by a grue.');
    return false;
  }
  if (!here.value.flags.isTouched) {
    here.value.flags.isTouched = true;
  }
  tell(here.value.name, 'room-name');
  // TODO: add vehicle logic

  if (here.value.description) {
    tell(here.value.description);
    return true;
  }

  here.value.action();
  return true;
};
