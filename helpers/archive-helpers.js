var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');
var Promise = require('bluebird');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function() {
  return new Promise(function(resolve, reject) {
    fs.readFile(exports.paths.list, 'utf8', function(err, data) {
      if (err) { return reject(err); }
      resolve(data.split('\n'));
    });
  });
};

exports.isUrlInList = function(url) {
  return exports.readListOfUrls()
    .then(function(urlList) {
      return new Promise(function(resolve, reject) {
        if (urlList.indexOf(url) > -1) {
          resolve(true);
        } else {
          resolve(false);
        }  
      });
    });
};

exports.addUrlToList = function(url) {
  return new Promise(function(resolve, reject) {
    fs.appendFile(exports.paths.list, url + '\n', function(err) {
      if (err) { return reject(err); }
      resolve();
    });
  });
};

exports.isUrlArchived = function(url) {
  return new Promise(function(resolve, reject) {
    fs.exists(exports.paths.archivedSites + '/' + url, function(exists) {
      resolve(exists);
    });
  });
};

exports.downloadUrls = function(urlArray) {
  urlArray.forEach(function(url, index) {
    request('http://' + url, function (error, response, body) {
      if (error) { console.log(error); }
      fs.writeFile(exports.paths.archivedSites + '/' + url, body, function(err) {
        if (err) { throw err; }
      });
    });
    
  });
};
