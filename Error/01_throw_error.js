function throwError() {
  function getInfo(id) {
    if (id < 0) throw new Error('id must be positive');
    return {
      name: 'gitbook'
    };
  }
  var res = getInfo(-1);
  console.log(res);
  console.log('此行不会被打印');
}

throwError();