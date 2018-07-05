var data = ['Jason', 'Tobby', 'Alex'];
var routes = {
  GET: {
    '/users': function(req, res){
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    },
    '/users/:id': function(req, res, id){
      id = Number(id);
      if (data[id]) {
        res.setHeader('Content-Type', 'text/plain');
        res.end(data[id]);
      } else {
        res.statusCode = 404;
        res.end('404 Not Found');
      }
    },
  },
  POST: {
    '/users/add': function(req, res){
      var data = '';
      req.on('data', function(chunk){
        data += chunk;
      });
      req.on('end', function(){
        res.end(data);
      });
    },
  },
};

module.exports = routes;