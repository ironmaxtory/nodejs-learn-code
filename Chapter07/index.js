var connect = require('connect');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var secret = 'tobi is a cool ferret';
var app = connect();

// app.use(cookieParser(secret));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next){
  var form = new formidable.IncomingForm();
  form.uploadDir = './tmp';
  form.maxFileSize = 10 * 1024;
  form.parse(req, function(err, fields, files){
    if (err) return next(err);
    req.body.fields = fields;
    req.body.files = files;
    next();
  });
});
app.use('/', function(req, res, next){
  console.log(req.cookies);
  console.log(req.signedCookies);

  console.log(req.body);

  res.end('Hello World');
});
app.use(function(err, req, res, next){
  if (err) {
    res.statusCode = 500;
    res.end('Error Occurred.');
    console.log(err.__proto__);
    console.log(err.name);
    console.log(err.message);
    console.log(err.stack);
  }
});

app.listen(5020, function(){
  console.log('Server is running ...');
});