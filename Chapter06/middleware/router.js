var urlPaser = require('url').parse;

function router (obj){
  var match = function(req, res, next){
    var routes = obj[req.method];
    var url = urlPaser(req.url);
    var paths = Object.keys(routes);
    for (var i=0; i<paths.length; i++) {
      var v = paths[i];
      var fn = routes[v];
      var path = v.replace(/\//g, '\\/')
        .replace(/:(\w+)/g, '([^\\/]+)');
      var re = new RegExp('^' + path + '$');
      var captures = url.pathname.match(re);  
      if (captures) {
        var args = [req, res].concat(captures.slice(1));
        fn.apply(null, args);
        return true;
      }
    }
  };
  return function(req, res, next){
    if (!obj[req.method]) {
      next();
      return ;
    }

    if (match(req, res, next))
      return;
    next();
  };
};

module.exports = router;