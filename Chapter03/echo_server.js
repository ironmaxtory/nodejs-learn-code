var net = require('net');

var server = net.createServer(function(socket) {
  socket.on('data', function(data) {
    socket.write(data);
  });
});

server.listen(5020, function() {
  console.log('Echo Server is listening on port 5020 ...');
});
