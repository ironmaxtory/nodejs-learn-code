function consoleError() {
  function getInfo(id) {
    if (id < 0) return new Error('id must be positive');
    return {
      name: 'gitbook'
    };
  }
  var res = getInfo(-1);
  console.log(res);
  console.log('此行仍然会被打印');
}

consoleError();