var fs = require('fs');
var path = require('path');

var args = process.argv.splice(2);
var command = args.shift();
var taskDesc = args.join(' ');
var file = path.join(process.cwd(), './tasks');

switch (command) {
  case 'list':
    handleListTask(file);
    break;
  case 'add':
    handleAddTask(file, taskDesc);
    break;  
}

var _getTasks = function(file, cb){
  fs.exists(file, function(exists){
    if (!exists) {
      return [];
    } else {
      fs.readFile(file, 'utf8', function(err, data){
        if (err) throw err;
        var data = data.toString();
        var tasks = JSON.parse(data || '[]');
        cb(tasks);
      });
    }
  });
};

var _storeTasks = function(file, tasks){
  fs.writeFile(file, JSON.stringify(tasks), 'utf8', function(err){
    if (err) throw err;
    console.log('Saved');
  });
};

var handleListTask = function(file){
  _getTasks(file, function(tasks){
    tasks.forEach(function(v, i){
      console.log(v);
    });
  });
};

var handleAddTask = function(file, taskDesc){
  _getTasks(file, function(tasks){
    tasks.push(taskDesc);
    _storeTasks(file, tasks);
  });
};

