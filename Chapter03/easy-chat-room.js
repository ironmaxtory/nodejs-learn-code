var EventEmitter = require('events').EventEmitter;
var net = require('net');

var channel = new EventEmitter();
channel.clients = {};
channel.subscriptions = {};
channel.on('join', function(id, client){
  this.clients[id] = client;
  this.subscriptions[id] = function(senderID, msg){
    if (id !== senderID) {
      this.clients[id].write(msg);
    }
  };

  this.on('broadcast', this.subscriptions[id]);
  this.on('leave', function(sid){
    console.log(channel.subscriptions[sid]);
    channel.removeListener('broadcast', channel.subscriptions[sid]);
    channel.emit('broadcast', sid, sid+' has left the chat room.\r\n');
  });
});

var server = net.createServer(function(client){
  var id = client.remoteAddress + ':' + client.remotePort;
  channel.emit('join', id, client);
  client.on('data', function(data){
    channel.emit('broadcast', id, data);
  });
  client.on('close', function(){
    console.log('有人断开连接');
    // 用户断开连接时发出 leave 事件
    channel.emit('leave', id);
  });
});
// server.on('connection', function(client){
//   var id = client.remoteAddress + ':' + client.remotePort;
//   channel.emit('join', id, client);
// });

server.listen(5020, function(){
  console.log('An easy server for chating is listening on port 5020 ...');
});
