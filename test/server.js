var urlencode = require('urlencode');
var assert = require('assert');

var actual = urlencode('23 14');
assert.equal(actual, '23%2014')
console.log(actual);

