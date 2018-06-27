var http = require('http');
var path = require('path');
var mysql = require('mysql');
var work = require('./lib/timetrack');

var TEMPLATE_PATH = path.join(__dirname, '../template')

// 连接 mysql
var db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'ironman@Veronica',
  database: '',
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
  switch (req.pathname) {
    case '/add':
      break;
    case '/update':
      break;
    case '/delete':
      break;
    default:
      handle404(req, res);
      break;
  }
};

var handleGet = function(req, res){
  switch (req.pathname) {
    case '/':
      work.sendHtml(res, path.join(TEMPLATE_PATH, 'index.html'));
      break;
    default:
      handle404(req, res);
      break;
  }
};


db.query(
  "CREATE TABLE IF NOT EXISTS todos ("
  + "id INT(10) NOT NULL AUTO_INCREMENT,"
  + "content VARCHAR(512) NOT NULL COMMENT '内容',"
  + "created_at INT(16) NOT NULL COMMENT '创建时间',"
  + "updated_at INT(16) NOT NULL COMMENT '更新时间',"
  + "PRIMARY KEY(id)"
  + ")",
  function(err){
    if (err) throw err;
    server.listen(5020, '127.0.0.1', function(){
      console.log('Server is listening on port 5020 ...');
    });
  }
);
