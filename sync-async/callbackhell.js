var fs = require('fs');
var gm = require('gm');
var path = require('path');

var source = path.join(__dirname, './images/');
fs.readdir(source, function (err, files) {
  if (err) {
    console.log('Error finding files: ' + err)
  } else {
    files.forEach(function (filename, fileIndex) {
      console.log(filename)
      gm(source + filename).size(function (err, values) {
        if (err) {
          console.log('Error identifying file size: ' + err)
        } else {
          console.log(filename, ' : ', values)
        }
      });
    });
  }
});
