var http = require('http');
var mysql = require('mysql');
var work = require('./lib/timetrack');

// 连接 mysql
var db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'myuser',
  password: 'mypassword',
  database: 'timetrack',
});

var server = http.createServer(function(req, res){
  switch (req.method) {
    case 'POST':
      handlePost(req, res);
      break;
    case 'GET':
      handleGet(req, res);
      break;  
  }
});