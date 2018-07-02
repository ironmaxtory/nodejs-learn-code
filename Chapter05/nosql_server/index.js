var Mongodb = require('mongodb');
var MongoClient = Mongodb.MongoClient;
var dbName = 'irm';
var url = "mongodb://localhost:27017";
// var url = 'mongodb://$[username]:$[password]@$[hostlist]/$[database]?authSource=$[authSource]';

MongoClient.connect(url, function(err, client){
  if (err) throw err;

  console.log('成功连接到数据库');

  var db = client.db(dbName);
  console.log(db.collection('todo'));
  if (!db.collection('todo')) {
    db.createCollection('todo', function(err, res){
      if (err) throw err;
      console.log('创建集合成功');
    });
  };
});
