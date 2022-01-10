import * as o from './objects';
import * as r from './rooms';

console.log('main.js', r.livingRoom);

r.livingRoom.action();

console.log('main.js', o.rug);

r.livingRoom.action('look');

o.rug.action('take');
o.rug.action('climb on');
o.rug.action('raise');
o.rug.action('look under');
o.rug.action('move');

r.livingRoom.action('look');

o.rug.action('take');
o.rug.action('climb on');
o.rug.action('raise');
o.rug.action('look under');
o.rug.action('move');
