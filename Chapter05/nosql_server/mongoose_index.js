var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/irm', function(err, db2){
  if (err) throw err;
});

var TaskSchema = new mongoose.Schema({
  content: String,
  created_at: Number,
  updated_at: Number,
});

// 预处理器：保存
TaskSchema.pre('save', function(next){
  var timestamp = Math.floor(+new Date() / 1000);
  if (this.isNew) {
    this.created_at = timestamp;
  }
  this.updated_at = timestamp;
  next();
});
// 预处理器：更新
TaskSchema.pre('update', function(next){
  var timestamp = Math.floor(+new Date() / 1000);
  this.updated_at = timestamp;
  next();
});

var Task = mongoose.model('task', TaskSchema);

// 增加
new Task({
  content: 'Go swimming',
}).save(function(err, res){
  if (err) throw err;
  console.log('新增成功！');
});


// 查找
Task.find({}, function(err, tasks){
  console.log('查找结果如下：');
  console.log(tasks);
});


// 更新
Task.update({
  _id: '5b3b4d72ebe1cbaf5842d6dd'
}, {
  content: 'Go dating'
}, function(err, res){
  if (err) throw err;
  console.log('更新成功！');
});

// 删除
Task.find({
  content: 'Go dating'
}, function(err, task){
  if (err) throw err;
  task.remove();
});



