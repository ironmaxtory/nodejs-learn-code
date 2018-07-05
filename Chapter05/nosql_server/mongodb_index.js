var Mongodb = require('mongodb');
var MongoClient = Mongodb.MongoClient;
var ObjectID = Mongodb.ObjectID;
var DB_IRM = 'irm';
var COLL_TODO= 'todo';
var url = "mongodb://localhost:27017";
// var url = 'mongodb://$[username]:$[password]@$[hostlist]/$[database]?authSource=$[authSource]';

MongoClient.connect(url, function(err, client){
  if (err) throw err;

  console.log('成功连接到数据库');

  var db = client.db(DB_IRM);

  // 插入数据
  db.collection(COLL_TODO).insertOne({
    content: 'Record',
    created_at: Math.floor((+new Date()) / 1000),
    updated_at: Math.floor((+new Date()) / 1000),
  }, {safe: true}, function(err, res){
    if (err) throw err;
    console.log('文档插入成功');
    console.log(res.insertedCount);
    console.log(res.insertedId);

    // 查询数据
    db.collection(COLL_TODO).find({}).toArray(function(err, res){
      console.log(res);

      // client.close();
    });

    // 更新数据
    db.collection(COLL_TODO).updateOne({content: 'Record'}, {
      $set: { content: 'New Record' }
    }, function(err, res){
      if (err) throw err;
      console.log('更新成功');
    });

    // 指定 id 以更新数据
    var _id = new ObjectID('5b3ae51140aacf9ecf33fdb0');
    db.collection(COLL_TODO).update({_id, _id}, {
      $set: { content: 'Record modified' }
    }, function(err, res){
      if (err) throw err;
      console.log('指定 id 以更新数据成功');
      
    });

    // 删除文档
    db.collection(COLL_TODO).remove({content: 'New Record'}, function(err, res){
      if (err) throw err;
      console.log('删除成功');
      client.close();
    });
    
  });

});
