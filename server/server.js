/* !
 * {{project-name}}
 * {{project-descriptor}}
 *
 * @author Enrico Marino and Federico Spini
 * @copyright 2012 Enrico Marino and Federico Spini
 * @licence MIT
 */

var express = require('express');
var build = require('./build.js');

var server = express();
var port = 8000;

server
  .use(express.favicon())


server.configure('development', function() {
  server
    .use(express.logger('dev'))
    .use(build)
    .use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
});

server.configure('production', function() {
  server.use(express.errorHandler());
});

server
  .use(express.static(__dirname + '/public'))
  .use(express.bodyParser());

server.listen(port, function() {
  console.log('Server listening on http://localhost:' + port);
});