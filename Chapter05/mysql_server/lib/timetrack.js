var qs = require('querystring');

// 发送 HTML 响应
exports.sendHtml = function(res, html){
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.end(html);
};
