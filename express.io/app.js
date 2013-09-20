(function () {

  var express, app;

  var talker = function() {
    var n = 0;
    var say = function() {
      n++;
      var now = new Date().getTime();
      app.io.broadcast('talk', { message: "This is event " + n + " at " + now });
      setTimeout(say, 2000);
    };
    say();
  };

  express = require('express.io');
  app = express();
  app.http().io();

  // serve static assets from public
  app.use(express.static('public'));

  // respond to ready route
  app.io.route('ready', function(req) {
      req.io.emit('talk', { message: 'Welcome client!' });
      });

  // Send the client html.
  app.get('/', function(req, res) {
      res.sendfile(__dirname + '/client.html');
      });

  // start broadcasting
  talker();

  app.listen(3000);

})();
