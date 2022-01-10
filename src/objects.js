export class Object {
  constructor(name) {
    this.name = name;
  }
}

export const lantern = new Object('latern');

console.log('objects.js', lantern);
