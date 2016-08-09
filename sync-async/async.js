var request = require('request');

console.log('starting async.js process');

request
  .get('http://google.com')
  .on('response', function(response) {
    console.log('request on response');
    console.log('response statusCode: ', response.statusCode);
    console.log('response content-type: ', response.headers['content-type']);
  });

console.log('hello, this is end of line');
