var Nimble = {};

Nimble.parallelizes = function(cbs, fn){
  var p = new Parallelizer(cbs, fn);
  p.parallelizes();
};

var Parallelizer = function(cbs, fn){
  // 保存异步函数的数组
  this.cbs = cbs;
  // 执行成功数
  this.completes = 0;
  // 执行返回结果集
  this.results = [];
  // 全部执行完毕的回调
  this.handleComplete = fn;
};
// 开始串行化执行异步函数
Parallelizer.prototype.parallelizes = function(fn){
  var len = this.cbs.length;
  var cb = null;

  this.completes = 0;
  this.results = [];

  for (var i=0;i<len;i++) {
    this.cbs[i](this.next.bind(this));
  }
};
// 异步函数结束时，调用next，告诉控制器已完成
Parallelizer.prototype.next = function(err, result){
  var cb = null;
  if (!!err && (err instanceof Error)) {
    this.results.push(err);
  } else {
    ++this.completes;
    this.results.push(result);
  }

  if (this.results.length === this.cbs.length) {
    this.fn(this.completes, this.results);
  }
};

module.exports = Nimble;

// 来测试一下以上代码
Nimble.series([
  function(next){
    setTimeout(function(){ console.log('并行调用'); next(); }, 1000);
  },
  function(next){
    setTimeout(function(){ console.log('并行调用'); next(); }, 500);
  },
  function(next){
    setTimeout(function(){ console.log('并行调用'); next(); }, 100);
  },
]);
