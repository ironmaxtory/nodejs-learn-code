function a() {
  console.log('函数 a 被调用');
  b();
}

function b() {
  console.log('函数 b 被调用');
  c();
}

function c() {
  console.log('函数 c 被调用');
}

// 执行函数 a
a();