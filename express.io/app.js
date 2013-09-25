(function () {

  var config = {
    tcpPort: 5000,
    httpPort: 3000
  };

  var express = require('express.io'),
    net = require('net'),
    es = require('event-stream'),
    app,
    server;

  express = require('express.io');
  app = express();
  app.http().io();

  // serve static assets from public
  app.use(express.static('public'));

  // serve the client app
  app.get('/', function (req, res) {
    res.sendfile(__dirname + '/client.html');
  });

  // create the TCP server
  server = net.createServer(function (socket) {

    var client;

    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    console.log("TCP Connection from " + socket.name);

    // use line-oriented events
    client = es.pipeline(socket, es.split());

    // broadcast lines from TCP port to the browser client(s)
    client.on('data', function (data) {
      app.io.broadcast('talk', { message: data.toString() });
    });

    client.on('end', function () {
      console.log("TCP Disconnect from " + socket.name);
    });

    client.on('error', function (err) {
      console.log("TCP Error from " + socket.name + ": " + JSON.stringify(err));
    });

  });

  // start the servers
  server.listen(config.tcpPort);
  console.log("TCP listening on port " + config.tcpPort);
  app.listen(config.httpPort);
  console.log("HTTP listening on port " + config.httpPort);

}());
