//const fs = require('fs'); // commonjs module
//import fs from 'fs'; // es module
//fs.writeFileSync('test.txt', 'hello node');

//const common = require('./common.js');
import common from './common.js';
common.hello();
import es from './es.js';
es.hello()