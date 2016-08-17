var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var fs = require('fs');
var helpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  console.log('Method: ', req.method, 'URL: ', req.url);
  var parsedUrl = url.parse(req.url);

  if (req.method === 'GET') {
    if (parsedUrl.pathname === '/') {
      helpers.serveAssets(res, '/index.html');
    } else if (parsedUrl.pathname === '/styles.css') {
      helpers.serveAssets(res, '/styles.css');
    } else {
      var filePath = archive.paths.archivedSites + parsedUrl.pathname;
      fs.exists(filePath, function(exists) {
        if (exists) {
          fs.readFile(filePath, function(error, data) {
            res.end(data);
          });
        } else {
          res.writeHead(404, null);
          res.end('Not Found');
        }
      });
    }
  } else if (req.method === 'POST') {
    var site = '';
    req.on('data', function(chunk) {
      site += chunk;
    });

    req.on('end', function() {
      site = site.split('=');
      fs.appendFile(archive.paths.list, site[1] + '\n', function(err) {
        if (err) { throw err; }
        res.writeHead(302, null);
        res.end();
      });
    });

  }
  // res.end(archive.paths.list);
};
