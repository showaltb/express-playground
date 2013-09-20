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

  // create the TCP server
  var net = require('net');
  var server = net.createServer(function (socket) {
      socket.name = socket.remoteAddress + ":" + socket.remotePort;
      console.log("TCP Connection from " + socket.name);

      socket.on('data', function (data) {
        console.log("TCP Received data: " + JSON.stringify(data.toString()));
        app.io.broadcast('talk', { message: data.toString() });
        });

      socket.on('end', function () {
        console.log("TCP Disconnect from " + socket.name);
        });

      socket.on('error', function(err) {
        console.log("TCP Error from " + socket.name + ": " + JSON.stringify(err));
        });

      });

  // start the servers
  server.listen(5000);
  app.listen(3000);

})();
