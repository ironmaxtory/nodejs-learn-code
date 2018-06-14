// var socket = io('http://localhost:3002');

// socket.on('connect', function() {
//   console.log('Connect');
// });

// socket.on('event', function(data) {
// });

// socket.on('request', function(data) {
//   console.log(data);
// });

// socket.on('disconnect', function() {
//   console.log('Disconnect');
// });

var Chat = function (socket) {
  this.socket = socket;
};

Chat.prototype.sendMessage = function (room, text) {
  var message = {
    room: room,
    text: text,
  };
  this.socket.emit('message', message);
};

Chat.prototype.changeRoom = function (room) {
  this.socket.emit('join', {
    newRoom: room
  });
};

Chat.prototype.processCommand = function (command) {
  var words = command.split(' ');
  var command = words[0].substring(1, words[0].length).toLowerCase();
  var messgae = false;
  var room;
  var name;

  switch (command) {
    case 'join':
      words.shift();
      room = words.join(' ');
      // 处理房间的变换/创建
      thgis.changeRoom(room);
      break;
    case 'nick':
      words.shift();
      name = words.join(' ');
      // 处理更名尝试
      this.socket.emit('nameAttempt', name);
      break;  
    default:
      // 若命令无法识别，返回错误消息
      message = 'Unrecognized Command';
      break;  
  }

  return message;
};