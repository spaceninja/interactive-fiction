import { Object } from './objects';

export class Room extends Object {
  constructor(name) {
    super(name);
    this.roomName = name;
  }
}

export const livingRoom = new Room('Living Room');

console.log('rooms.js', livingRoom);
