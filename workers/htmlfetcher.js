// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
archive.readListOfUrls()
  .then(function(urlList) {
    fs.readdir(archive.paths.archivedSites, function(err, files) {
      console.log(files);
      urlList = urlList.filter(function(item) {
        return !(files.indexOf(item) > -1) && item !== '';
      });
      
      console.log(urlList);
      archive.downloadUrls(urlList);

    });
  });
