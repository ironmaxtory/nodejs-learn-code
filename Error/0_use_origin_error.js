function myError() {
  Error.captureStackTrace(this, test);
}
function test() {
  var stack = new myError().stack;
  console.log(stack);
}
function run() {
  test();
}
run();
