/**
 * 静态文件服务器
 */

var http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');
var ROOT_PATH = __dirname;

var server = http.createServer(function(req, res){
  var urlObj = url.parse(req.url);
  // 构造绝对路径
  var absPath = path.join(ROOT_PATH, urlObj.pathname);
  // 创建文件可读流
  var stream = fs.createReadStream(absPath);
  // res.end() 会在 stream.pipe() 内部调用
  stream.pipe(res);

  /*
  // 检查文件是否存在
  fs.stat(absPath, function(err, stat){
    if (err) {
      if ('ENOENT' == err.code) {
        // 文件不存在
        res.statusCode = 404;
        res.end('404 Not Found');
      } else {
        // 其他错误
        res.statusCode = 500;
        res.end('500 Server Internal Error');
      }
    } else {
      // 用 stat 对象的属性设置 Content-Length
      res.setHeader('Content-Length', stat.size);
      // 创建文件可读流
      var stream = fs.createReadStream(absPath);
      // res.end() 会在 stream.pipe() 内部调用
      stream.pipe(res);
      // 捕捉错误
      stream.on('error', function(err){
        res.statusCode = 500;
        res.end('Internal Server Error');
      });
    }
  })
  */
});

server.listen(5020);
