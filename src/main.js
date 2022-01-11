import { createApp } from 'vue';
import App from './App.vue';

import * as o from './objects';
import * as r from './rooms';

createApp(App).mount('#app');

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

o.trapDoor.action('look under');
o.trapDoor.action('raise');
o.trapDoor.action('look under');
o.trapDoor.action('close');
