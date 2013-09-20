(function () {

  var express, app;

  var talker = function(req) {
    var n = 0;
    var say = function() {
      n++;
      var now = new Date().getTime();
      req.io.emit('talk', { message: "This is event " + n + " at " + now });
      setTimeout(say, 2000);
    };
    say();
  };

  express = require('express.io');
  app = express();
  app.http().io();

  // serve static assets from public
  app.use(express.static('public'));

  // Setup the ready route, and emit talk event.
  app.io.route('ready', function(req) {
      talker(req);
      /*
      req.io.emit('talk', {
message: 'io event from an io route on the server'
});
      */
      });

  // Send the client html.
  app.get('/', function(req, res) {
      res.sendfile(__dirname + '/client.html');
      });

  app.listen(3000);

})();
