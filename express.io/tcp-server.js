var net = require('net');
var es = require('event-stream');

var server = net.createServer(function (socket) {
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    console.log("Connection from " + socket.name);

    var lines = es.pipeline(socket, es.split());

    lines.on('data', function (data) {
      console.log("Received data: " + JSON.stringify(data.toString()));
      });

    lines.on('end', function () {
      console.log("Disconnect from " + socket.name);
      });

    lines.on('error', function(err) {
      console.log("Error from " + socket.name + ": " + JSON.stringify(err));
      });

    });

server.listen(5000);

console.log("Listening on port 5000");
