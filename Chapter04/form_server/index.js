var http = require('http');
var url = require('url');
var qs = require('querystring');
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');

var ROOT_PATH = __dirname;

var server = http.createServer(function(req, res){
  switch (req.method) {
    case 'POST':
      postHandler(req, res);
      break;
    case 'GET':
      getHandler(req, res);
      break;
    default:
      badRequestHandler(req, res);
      break;
  }
});
server.listen(5020, function(){
  console.log('Server is listening on port 5020 ...');
});

var notFoundHandler = function(req, res){
  res.statusCode = 404;
  res.end('404 Not Found');
};

var badRequestHandler = function(req, res){
  rres.statusCode = 404;
  res.end('404 Bad Request');
};

var postHandler = function(req, res){
  var urlObj= url.parse(req.url);
  if (urlObj.pathname !== '/addItem') {
    notFoundHandler(req, res);
  }
  addItem(req, res);
};

var getHandler = function(req, res){
  var urlObj= url.parse(req.url);
  if (urlObj.pathname !== '/' && urlObj.pathname !== '/index.html') {
    notFoundHandler(req, res);
  }
  showHtml(req, res);
};

var showHtml = function(req, res){
  var absPath = path.join(ROOT_PATH, 'templates/index.html');
  var stream = fs.createReadStream(absPath);
  res.setHeader('Content-Type', 'text/html; charset="uft-8"');
  stream.pipe(res);
};

var addItem = function(req, res){
  // var body = '';
  // req.setEncoding('utf8');
  // req.on('data', function(chunk){
  //   body += chunk;
  // });
  // req.on('end', function(){
  //   var obj = qs.parse(body);
  //   console.log(obj);
  //   showHtml(req, res);
  // });

  var form = new formidable.IncomingForm();
  form.on('progress', function(bytesReceived, bytesExpected){
    var percent = Math.floor(bytesReceived / bytesExpected * 100);
    console.log(percent);
  });
  form.parse(req, function(err, fields, files){
    console.log(fields);
    console.log(files);
    showHtml(req, res);
  });
};
