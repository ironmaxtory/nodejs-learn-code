var http = require('http');
var url = require('url');

// 容器
var items = [];

// 创建 Web 服务器
var server = http.createServer(function(req, res){
  // 增删改查
  switch (req.method) {
    case 'POST':
      postMiddleware(req, res);
      break;
    case 'GET':
      getMiddleware(req, res);
      break;
    case 'DELETE':
      delMiddleware(req, res);
      break;
    case 'PUT':
      updateMiddleware(req, res);
      break;
  }
});

server.listen(5020, function(){
  console.log('Server is listening on port 5020 ...');
});

function postMiddleware(req, res) {
  var item = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk){
    item += chunk;
  });
  req.on('end', function(){
    items.push(item);
    res.end('OK\n');
  });
}

function getMiddleware(req, res) {
  var body = '\r\n' + items.map(function(item, i){
    return (i+1+') ' + item);
  }).join('\r\n');
  res.setHeader('Content-Length', Buffer.byteLength(body));
  res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
  res.end(body);
}

function delMiddleware(req, res) {
  var path = (url.parse(req.url)).pathname;
  var idx = parseInt(path.slice(1));
  if (isNaN(idx)) {
    res.statusCode = 400;
    res.end('\r\nInvalid item id');
  } else if (!items[idx]) {
    res.statusCode = 404;
    res.end('\r\nItem not found');
  } else {
    items.splice(idx, 1);
    res.end('\r\nOK!\r\n');
  }
}

function updateMiddleware(req, res) {
  var path = (url.parse(req.url)).pathname;
  var idx = parseInt(path.slice(1));
  var item = '';

  if (isNaN(idx)) {
    res.statusCode = 400;
    res.end('\r\nInvalid item id');
  } else if (!items[idx]) {
    res.statusCode = 404;
    res.end('\r\nItem not found');
  } else {
    req.on('data', function(chunk){
      item += chunk;
    });
    req.on('end', function(){
      items.splice(idx, 1, item);
      res.end('\r\nOK!\r\n');
    });
  }
}
