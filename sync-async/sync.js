var Promise = require('bluebird');
var request = require('request');

console.log('starting sync.js');
var myPromise = new Promise(function (resolve, reject) {
  console.log('starting promise');
  request
    .get('http://google.com')
    .on('response', function(response) {
      console.log('response status code: ', response.statusCode);
      console.log('response header content type: ', response.headers['content-type']);
      resolve('got response');
     });
});

myPromise.then(function (res) {
  console.log('res', res);
});

console.log('end of sync.js');
