function divEscapedContentElement(message) {
  return $('<div></div>').text(message);
}

function divSystemContentElement(message) {
  return $('<div></div>').html('<i>'+message+'</i>');
}

function processUserInput(chatApp, socket) {
  var message = $('#send-message').val();
  var systemMessage;

  if (message.charAt(0) == '/') {
    // 如果用户输入的内容以斜杠开头，则作为聊天命令
    systemMessage = chatApp.processCommand(message);

    if (systemMessage) {
      $('#messages').append(divSystemContentElement(systemMessage));
    } else {
      // 非命令，则广播给其他用户
      chatApp.sendMessage($('#room').text(), message);

      $('#messages').append(divEscapedContentElement(message));

      $('messages').scrollTop($('#messages').prop('scrollHeight'));
    }
    $('#send-message').val('');
  }
}

var socket = io.connect();
$(document).ready(function(){
  var chatApp = new Chat(socket);
  
  // 更名尝试结果
  socket.on('nameResult', function(result){
    var message;
    if (result.success) {
      message = 'You are known as ' + result.name + '. ';
    } else {
      message = result.message;
    }

    $('#message').append(divSystemContentElement(message));
  });

  // 房间变更结果
  socket.on('joinResult', function(result){
    $('#room').text(result.room);
    $('#messages').append(divSystemContentElement('Room Changed.'));
  });

  // 显示接收到的消息
  socket.on('message', function(message){
    var newElement = $('<div></div>').text(message.text);
    $('#messages').append(newElement);
  });

  // 显示可用的房间列表
  socket.on('rooms', function(rooms){
    var room ;

    $('#room-list').empty();

    for (room in rooms) {
      room = room.substring(1, room.length);
      if (room != '') {
        $('#room-list').append(divEscapedContentElement(room));
      } 
    }

    // 点击房间名可以换到那个房间中
    $('#room-list div').click(function(){
      chatApp.processCommand('/join ' + $(this).text());
      $('#send-message').focus();
    });
  });

  // 定期请求可用的房间列表
  setInterval(function(){
    socket.emit('rooms');
  }, 1000);

  // 聚焦
  $('#send-message').focus();
  
  // 提交表单可以发送聊天消息
  $('#send-form').submit(function(){
    processUserInput(chatApp, socket);
    return false;
  });

});
