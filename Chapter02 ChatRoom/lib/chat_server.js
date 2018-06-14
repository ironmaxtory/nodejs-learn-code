var socketio = require('socket.io');

var io;
var guestNumber = 1;
var namesUsed = [];
var nickNames = {};
var currentRoom = {};

// 辅助函数：生成昵称
function assignGuestName(socket, gusetNumber, nickNames, namesUsed) {
  // 生成新昵称
  var name = 'Guest' + gusetNumber;
  // 把用户昵称跟客户端连接id关联上
  nickNames[socket.id] = name;
  // 让用户知道他们的昵称
  socket.emit('nameResult', {
    success: true,
    name: name,
  });
  // 存放已经被占用的昵称
  namesUsed.push(name);
  // 增加用来生成昵称的计数器
  return gusetNumber + 1;
}

// 辅助函数：进入聊天室
function joinRoom(socket, room) {
  // 让用户进入房间
  socket.join(room);
  // 记录用户的当前房间
  currentRoom[socket.id] = room;
  // 让用户知道他们进入了新的房间
  socket.emit('joinResult', {room: room});
  // 让房间里的其他用户知道有新用户进入了房间
  socket.broadcast.to(room).emit('message', {
    text: nickNames[socket.id] + ' has joined ' + room + '.'
  });
  // 确定有哪些用户在这个房间里
  var usersInRoom = io.sockets.clients(room);
  // 如果不止一个用户在该房间里，汇总下都是谁
  if (usersInRoom.length > 1) {
    var usersInRoomSummary = 'Users currently in ' + room + ': ';
    for (var index=0; index<usersInRoom.length; index++) {
      var userSocketId = usersInRoom[index].id;
      if (userSocketId != socket.id) {
        if (index > 0) {
          usersInRoomSummary += ',';
        }
        usersInRoomSummary += nickNames[userSocketId];
      }
    }
    usersInRoomSummary += '.';
    // 将该房间里其他用户的汇总发送给该用户
    socket.emit('message', {
      text: usersInRoomSummary,
    });
  }
}

// 辅助函数：处理昵称变更请求
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
  // 添加nameAttempt事件的监听器
  socket.on('nameAttempt', function(name){
    if (name.indexOf('Guest') == 0) {
      // 昵称不能以Guest开头
      socket.emit('nameResult', {
        success: false,
        message: 'Name cannot begin "Guest"',
      });
    } else {
      if (namesUsed.indexOf(name) == -1) {
        // 如果昵称还没有注册
        var previousName = nickNames[socket.id];
        var previousNameIdx = namesUsed.indexOf(previousName);
        namesUsed.push(name);
        nickNames[socket.id] = name;
        // 删掉之前用的昵称，让其他用户可以使用
        delete namesUsed[previousNameIdx];
        socket.emit('nameResult', {
          success: true,
          name: name,
        });
        socket.broadcast.to(currentRoom[socket.id]).emit('message', {
          text: previousName + 'is now known as ' + name + '.',
        });
      } else {
        socket.emit('nameResult', {
          success: false,
          message: 'That name is already in use',
        });
      }
    }
  });
}

// 辅助函数：转发消息
function handleMessageBroadcasting (socket) {
  socket.on('message', function(message){
    socket.broadcast.to(message.room).emit('message', {
      text: nickNames[socket.id] + ': ' + message.text,
    });
  });
}

// 辅助函数：切换到其他聊天室
function handleRoomJoining (socket) {
  socket.on('join', function(room){
    socket.leave(currentRoom[socket.id]);
    joinRoom(socket, room.newRoom);
  });
}

// 辅助函数：用户断开连接
function handleClientDisconnection (socket) {
  socket.on('disconnect', function(){
    var name = nickNames[socket.id];
    var nameIndex = namesUsed.indexOf(name);
    delete namesUsed[nameIndex];
    delete nickNames[socket.id];
    socket.broadcast.to(currentRoom[socket.id]).emit('message', {
      text: name + ' has been exited the room.',
    });
  });
}

exports.listen = function(server){
  console.log('Socket.io is listening on the server.');
  // 启动 socket.io 服务器，允许其搭载在已有的HTTP服务器上
  io = socketio.listen(server);
  io.set('log level', 1);
  // 定义每个用户连接的处理逻辑
  io.sockets.on('connection', function(socket){
    // 在用户连接上来时，赋予其一个访客名
    guestNumber = assignGuestName(socket, gusetNumber, nickNames, namesUsed);

    // 在用户连接上来时，把他放入聊天室 Lobby 里
    joinRoom(socket, 'Lobby');

    // 处理用户的消息、更名，以及聊天室的创建和变更
    handleMessageBroadcasting(socket, nickNames);
    handleNameChangeAttempts(socket, nickNames, namesUsed);
    handleRoomJoining(socket);

    // 当用户发出请求时，向其提供已经被占用的聊天室的列表
    socket.on('rooms', function(){
      socket.emit('rooms', io.sockets.manager.rooms);
    });

    // 定义用户断开连接后的清除逻辑
    handleClientDisconnection(socket, nickNames, namesUsed);
  });
};
