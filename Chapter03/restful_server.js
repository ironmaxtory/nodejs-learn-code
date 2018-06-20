var http = require('http');
var items = [];

var server = http.createServer(function(req, res){
  
  switch (req.method) {
    case 'POST':
      postMiddleware(req, res);
      break;
    case 'GET':
      getMiddleware(req, res);
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
  var body = items.map(function(item, i){
    return (i+') ' + item);
  }).join('\r\n');
  res.setHeader('Content-Length', Buffer.byteLength(body));
  res.setHeader('Content-Type', 'text/plain; charset="utf-8"'); 
  res.end(body);
}