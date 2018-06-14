var socketio = require('socket.io');
var http = require('http');
var fs = require('fs');
var mime = require('mime');
var path = require('path');

var server = http.createServer(function(req, res){
  var filePath = '';
  if (req.url === '/') {
    filePath = './test-public/index.html';
    fs.readFile(filePath, function(err, data){
      res.writeHead(200, {
        'Content-Type': mime.getType(path.basename(filePath)),
      });
      res.end(data);
    });
  } else {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    res.end('Hello World');
  }
});

server.listen(3004, function(){
  console.log('Server is listening on port 3004.');
});

var io = socketio.listen(server);
io.sockets.on('connection', function(socket){
  socket.on('message', function(data, ack){
    console.log('From Client: ' + data);
    ack('I have confirmed.');
  });

  console.log(socket.eventNames());
});
