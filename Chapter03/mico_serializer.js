var Nimble = {};

Nimble.series = function(cbs){
  var s = new Serializer(cbs);
  s.series();
};

var Serializer = function(cbs){
  // 保存异步函数的数组
  this.cbs = cbs;
  // 执行游标
  this.cursor = -1;
};
// 开始串行化执行异步函数
Serializer.prototype.series = function(){
  var len = this.cbs.length;
  var cb = null;

  this.cursor = -1;
  if (len >= 1) {
    cb = this.cbs[++this.cursor];
    cb(this.next.bind(this));
  }
};
// 异步函数结束时，调用next，相当于调用下一个异步函数
Serializer.prototype.next = function(err, result){
  var cb = null;
  if (!!err && (err instanceof Error)) {
    throw err;
    return ;
  }
  if (this.cursor < this.cbs.length-1) {
    cb = this.cbs[++this.cursor];
    cb(this.next.bind(this), result);
  }
};

module.exports = Nimble;

// 来测试一下以上代码
Nimble.series([
  function(next){
    setTimeout(function(){ console.log('1000ms 后调用'); next(); }, 1000);
  },
  function(next){
    setTimeout(function(){ console.log('1500ms 后调用'); next(); }, 500);
  },
  function(next){
    setTimeout(function(){ console.log('1600ms 后调用'); next(); }, 100);
  },
]);
