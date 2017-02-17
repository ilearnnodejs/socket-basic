var moment = require('moment');
var now = moment();

console.log(now.format());

now.subtract(1, 'year');

console.log(now.format());
console.log(now.format('h:mm a'));