var connect = require('connect');
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var router = require('./middleware/router');
var routeUser = require('./routes/user');
console.log(router);

var ROOT_PATH = __dirname;
var LOG_PATH = path.join(ROOT_PATH, 'log');
var DEBUG_LOG_PATH = path.join(LOG_PATH, 'debug.log');

var mwLogger = function(req, res, next){
  var dataStr = JSON.stringify({
    method: req.method,
    url: req.url,
    timestamp: +new Date(),
    created_at: moment().format('YYYY-MM-DD hh:mm:ss'),
  });
  fs.appendFile(DEBUG_LOG_PATH, dataStr, function(err){
    if (err) throw err;
    next();
  })
};

var adminAuth = function(req, res, next){
  var authArr = req.headers.authorization ? req.headers.authorization.split(' ') : new Array(2);
  var scheme = authArr[0] || '';
  var authorization = authArr[1] || '';
  var auth = new Buffer(authorization, 'base64').toString().split(':');
  var username = auth[0];
  var userpwd = auth[1];

  if (username==='root' && userpwd==='root') 
    next();
  else
    next(new Error('Authenticate Failed. Authorization: ')+authorization); 
};

var adminList = function(req, res, next){
  console.log(req.url);
  if (req.url !== '/users') {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Try ../users');
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify([
      { name: 'ironman', age:20 }
    ]));
  }
};

var errorHandler = function(err, req, res, next){
  res.statusCode = 500;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(err));
};

var api = connect()
  .use('/', function(req, res, next){
    res.end('Hello Api');
  })
  .use(function(req, res, next){
    next(new Error('Invalid path.'));
  })
  .use(function(err, req, res, next){
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(err));
  });

var app = connect();
app.use(mwLogger);
app.use('/admin', adminAuth);
app.use('/admin', adminList);
app.use(router(routeUser));
app.use('/api', api);
app.use(errorHandler);


app.listen(5020, function(){
  console.log('Connect-Server is listening on port 5020');
});


