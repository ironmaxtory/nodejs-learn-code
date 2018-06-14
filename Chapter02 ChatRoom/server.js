var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var chatServer = require('./lib/chat_server.js');

// 用来缓存文件内容的对象
var cache = {};

// 辅助函数：所请求资源不存在时发送404错误
function send404(response) {
  response.writeHead(404, {
    'Content-Type': 'text/plain',
  });
  response.write('Error 404: resource not found.');
  response.end();
}

// 辅助函数：提供文件数据服务
function sendFile(response, filePath, fileContents) {
  response.writeHead(200, {
    'Content-Type': mime.getType(path.basename(filePath)),
  });
  response.end(fileContents);
}

// 辅助函数：提供静态文件服务
function serveStatic(response, cache, absPath) {
  if (cache[absPath]) {
    // 从内存中返回文件
    sendFile(response, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, function(exists){
      if (exists) {
        fs.readFile(absPath, function(err, data){
          if (err) { send404(response) }
          else {
            cache[absPath] = data;
            // 从硬盘中读取文件并返回
            sendFile(response, absPath, data);
          }
        });
      } else {
        send404(response);
      }
    });
  }
}

// app：创建HTTP服务器
var server = http.createServer(function(req, res){
  var filePath = false;
  if (req.url === '/') {
    filePath = 'public/index.html';
  } else {
    filePath = 'public' + req.url;
  }

  var absPath = './'+filePath;
  serveStatic(res, cache, absPath);
});

server.listen(3002, function(){
  console.log('Server is listening on port 3002.');
});

chatServer.listen(server);
