var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./key-cert.pem'),
};

var server = https.createServer(options, function(req, res){
  res.writeHead(200);
  res.end('hello world');
});

server.listen(5020, function(){
  console.log('Https server is listenning on port 5020 ...');
});