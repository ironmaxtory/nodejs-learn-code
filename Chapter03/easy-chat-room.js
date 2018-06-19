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
  this.on('leave', function(senderID){
    if (id === senderID) {
      this.removeListener('broadcast', this.subscriptions[senderID]);
      this.emit('broadcast', senderID, '['+senderID+']'+' has left the chat room.\r\n');
    }
  });
});
channel.on('shutdown', function(){
  console.log('关闭所有连接');
  this.emit('broadcast', '', 'Chat room has been shutdown!');
  this.removeAllListeners('broadcast');
});

var server = net.createServer(function(client){
  var id = client.remoteAddress + ':' + client.remotePort;
  console.log('[' + id + ']' + ' 已连接');

  // 加入 channel
  channel.emit('join', id, client);

  // 接收到数据后，广播给其他用户
  client.on('data', function(data){
    data = data.toString();
    console.log(data.length);
    if (data.length > 2 && data.slice(0, -2) === 'shutdown') {
      channel.emit('shutdown');
    }
    channel.emit('broadcast', id, data);
  });

  // 关闭时，离开 channel
  client.on('close', function(){
    console.log('[' + id + ']' + ' 已关闭');
    // 用户断开连接时发出 leave 事件
    channel.emit('leave', id);
  });
});

server.listen(5020, function(){
  console.log('An easy server for chating is listening on port 5020 ...');
});
