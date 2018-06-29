var qs = require('querystring');
var path = require('path');
var fs = require('fs');
var ejs = require('ejs');
var moment = require('moment');
var url = require('url');
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

// 发送首页
var sendIndexHtml = function(req, res, db){
  getTodo(db, req, function(data){
    data.forEach(function(item){
      item.created_at = moment(item.created_at*1000).format('YYYY-MM-DD hh:mm:ss');
      item.updated_at = moment(item.updated_at*1000).format('YYYY-MM-DD hh:mm:ss');
    });
    sendHtml(
      res, path.join(CONFIGS.TEMPLATE_PATH, 'index.ejs'),
      {
        title: 'TODO List',
        todos: data,
      },
    );
  });
};

// 重定向到首页
var redirectIndexHtml = function(res){
  res.writeHead(302, {
    'Location': 'http://localhost:5020/'
  });
  res.end();
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
        redirectIndexHtml(res);
      },
    );
  });
};

// 更新 todo
var updateTodo = function(db, req, res){
  parseReceivedData(req, function(todo){
    var timestamp = Math.ceil(+new Date() / 1000);
    console.log(todo);
    db.query(
      "UPDATE todos SET content=?, updated_at=? WHERE id=? ",
      [todo.content, timestamp, todo.id],
      function(err){
        if (err) throw err;
        redirectIndexHtml(res);
      },
    );
  });
};

// 获取 todo
var getTodo = function(db, req, cb){
  var query = "SELECT * FROM todos ORDER BY created_at DESC";
  // 暂时先不支持条件查询吧
  db.query(query, function(err, rows){
    if (err) throw err;
    cb(rows);
  });
};

// 删除 todo
var deleteTodo = function(db, req, res){
  var query = "DELETE FROM todos WHERE id = ?";
  var uSP = (new url.URL(req.headers.host + req.url)).searchParams;
  var id = uSP.get('id');
  db.query(query, id, function(err){
    if (err) throw err;
    redirectIndexHtml(res);
  });
};



exports.parseReceivedData = parseReceivedData;
exports.sendHtml = sendHtml;
exports.sendIndexHtml = sendIndexHtml;
exports.addTodo = addTodo;
exports.updateTodo = updateTodo;
exports.getTodo = getTodo;
exports.deleteTodo = deleteTodo;
