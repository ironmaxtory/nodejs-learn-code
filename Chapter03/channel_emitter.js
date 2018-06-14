var EventEmitter = require('events').EventEmitter;

var channel = new EventEmitter();
channel.on('join', function(nickname){
  console.log('Welcome ' + nickname);
});
console.log('Channel is waiting for emitting ...');

setTimeout(function(){
  channel.emit('join', 'Cyber Hades');
}, 500);
