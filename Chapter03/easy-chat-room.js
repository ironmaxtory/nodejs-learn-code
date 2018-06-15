var EventEmitter = require('events').EventEmitter;
var net = require('net');

var channel = new EventEmitter();
channel.clients = {};
channel.subscriptions = {};
channel.on('join', function(id, client){
  console.log('join: '+id);
  this.clients[id] = client;
  this.subscriptions[id] = function(clientID, msg){
    console.log(clientID);
    console.log(msg);
    if (id !== clientID) {
      this.clients[clientID].write(msg);
    }
  };

  this.on('broadcast', this.subscriptions[id]);
});

var server = net.createServer(function(client){
  var id = client.remoteAddress + ':' + client.remotePort;
  channel.emit('join', id, client);
  client.on('data', function(data){
    channel.emit('broadcast', id, data);
  });
});
// server.on('connection', function(client){
//   var id = client.remoteAddress + ':' + client.remotePort;
//   channel.emit('join', id, client);
// });

server.listen(5020, function(){
  console.log('An easy server for chating is listening on port 5020 ...');
});