// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting
var archive = require('../helpers/archive-helpers');
var fs = require('fs');


var htmlFetcher = function() {
  archive.readListOfUrls()
  .then(function(urlList) {
    fs.readdir(archive.paths.archivedSites, function(err, files) {
      urlList = urlList.filter(function(item) {
        return !(files.indexOf(item) > -1) && item !== '';
      });
      
      archive.downloadUrls(urlList);

    });
  });
};

module.exports.htmlFetcher = htmlFetcher;

htmlFetcher();