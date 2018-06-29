var fs = require('fs');
var http = require('http');
var path = require('path');
var url = require('url');
var mime = require('mime');
var mysql = require('mysql');
var todo = require('./lib/timetrack');
var CONFIGS = require('./config');

// 连接 mysql
var db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'ironman@Veronica',
  database: 'nodejs',
});

var server = http.createServer(function(req, res){
  switch (req.method) {
    case 'POST':
      handlePost(req, res);
      break;
    case 'GET':
      handleGet(req, res);
      break;
    default:
      handle400(req, res);
      break;
  }
});

var handle404 = function(req, res){
  res.statusCode = 404;
  res.end('404 Not Found');
};

var handle400 = function(req, res){
  res.statusCode = 400;
  res.end('400 Bad Request');
};

var handlePost = function(req, res){
  var urlObj = url.parse(req.url);
  switch (urlObj.pathname) {
    case '/add':
      todo.addTodo(db, req, res);
      break;
    case '/update':
      todo.updateTodo(db, req, res);
      break;
    case '/delete':
      break;
    default:
      handle404(req, res);
      break;
  }
};

var handleGet = function(req, res){
  var urlObj = url.parse(req.url);
  switch (urlObj.pathname) {
    case '/':
      todo.sendIndexHtml(req, res, db);
      break;
    case '/delete':
      todo.deleteTodo(db, req, res);
      break;
    default:
      var resUrl = path.join(CONFIGS.ROOT_PATH, urlObj.pathname);
      var type = mime.getType(resUrl);
      if (fs.existsSync(resUrl)) {
        res.setHeader('Content-Type', type);
        (fs.createReadStream(resUrl)).pipe(res);
      } else {
        handle404(req, res);
      }
      break;
  }
};



db.query(
  "CREATE TABLE IF NOT EXISTS todos ("
  + "id INT(10) NOT NULL AUTO_INCREMENT,"
  + "content VARCHAR(512) NOT NULL COMMENT '内容',"
  + "created_at INT(32) NOT NULL COMMENT '创建时间',"
  + "updated_at INT(32) NOT NULL COMMENT '更新时间',"
  + "PRIMARY KEY(id)"
  + ")",
  function(err){
    if (err) throw err;
    server.listen(5020, '127.0.0.1', function(){
      console.log('Server is listening on port 5020 ...');
    });
  }
);
