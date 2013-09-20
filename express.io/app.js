express = require('express.io');
app = express();
app.http().io();

// serve static assets from public
app.use(express.static('public'));

// Setup the ready route, and emit talk event.
app.io.route('ready', function(req) {
    req.io.emit('talk', {
        message: 'io event from an io route on the server'
    });
});

// Send the client html.
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/client.html');
});

app.listen(3000);
