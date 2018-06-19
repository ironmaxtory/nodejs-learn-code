var net = require('net');

var server = net.createServer(function(socket) {
  var id = socket.remoteAddress + ':' + socket.remotePort;
  
  console.log('[' + id + ']' + ' 已连接');

  socket.on('data', function(data) {
    socket.write(data);
  });

  socket.on('close', function(){
    console.log('[' + id + ']' + ' 已关闭');
  });
});


server.listen(5020, function() {
  console.log('Echo Server is listening on port 5020 ...');
});
