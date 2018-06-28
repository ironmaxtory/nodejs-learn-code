var qs = require('querystring');
var path = require('path');
var fs = require('fs');
var ejs = require('ejs');
var CONFIGS = require('../config');

// 发送 HTML 响应
var sendHtml = function(res, htmlPath, data){
  if (data == undefined) data = '';
  renderHtml(htmlPath, data, function(html){
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
  });
};

// 渲染 html
var renderHtml = function(htmlPath, data, cb){
  ejs.renderFile(htmlPath, data, {}, function(err, str){
    if (err) throw err;
    cb(str);
  });
};

// 解析 POST 数据
var parseReceivedData = function(req, cb){
  var body = '';
  // req.setEncoding('utf8');
  req.on('data', function(chunk){
    body += chunk;
  });
  req.on('end', function(){
    var data = qs.parse(body);
    cb(data);
  });
};

// 添加 todo
var addTodo = function(db, req, res){
  parseReceivedData(req, function(todo){
    var timestamp = Math.ceil(+new Date() / 1000);
    db.query(
      "INSERT INTO todos (content, created_at, updated_at) "
        + "VALUES (?, ?, ?)",
      [todo.content, timestamp, timestamp],
      function(err){
        if (err) throw err;
        console.log('addTodo: 发送首页');
        redirectIndexHtml(res);
        // sendIndexHtml(req, res, db);
      },
    );
  });
};

// 获取 todo
var getTodo = function(db, req, cb){
  var query = "SELECT * FROM todos ORDER BY created_at DESC";
  console.log('getTodo: 获取todos');
  // 暂时先不支持条件查询吧
  db.query(query, function(err, rows){
    if (err) throw err;
    cb(rows);
  });
};

var sendIndexHtml = function(req, res, db){
  getTodo(db, req, function(data){
    console.log(data);
    sendHtml(
      res, path.join(CONFIGS.TEMPLATE_PATH, 'index.ejs'),
      {
        title: 'TODO List',
        todos: data,
      },
    );
  });
};

var redirectIndexHtml = function(res){
  res.writeHead(302, {
    'Location': 'http://localhost:5020/'
  });
  res.end();
};

exports.sendHtml = sendHtml;
exports.sendIndexHtml = sendIndexHtml;
exports.addTodo = addTodo;
exports.getTodo = getTodo;
exports.parseReceivedData = parseReceivedData;
