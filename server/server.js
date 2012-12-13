/* !
 * server
 * codedoc server
 * Copyright (c) 2012 Enrico Marino e Federico Spini
 * MIT License
 */

var credentials = {
  client_id: 'd5fe8387aa71341450d5',
  client_secret: '61b270213fdb85256d7cc83983194896856cb636'
};

var express = require('express');
var request = require('superagent');
var join = require('path').join;
var redox = require('redox');
var finder = require('github-finder')(credentials);
var build = require('./build.js');

var server = express();

server
  .use(express.favicon())
  .use(express.logger('dev'));


server.configure('development', function() {
  server
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

server.listen(8002, function() {
  console.log('Server listening on port: ' + 8002);
});


// server.get('/:user/:project', function(req, res) {
//   var params = req.params;
//   res.redirect('/#/docs/' + params.user + '/' + params.project);
// });

server.get('/api/0/docs/:user/:project', function(req, res) {
  var params = req.params;
  var docs = [];
  var parsed;

  finder.open({user: params.user, project: params.project})
    .on('file', function (file) {
      if (file.name.match(/.js$/)) {
        parsed = redox.parse((new Buffer(file.content, 'base64')).toString());
        docs.push({
          name: file.name,
          path: file.path,
          docs: parsed.docs,
          codes: parsed.codes
        });
      }
    })
    .on('end', function() {
        res.send(docs);
    });
});